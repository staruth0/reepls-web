import React, { useState } from "react";
import { Icon } from "@iconify/react";

import { useUser } from "../../../hooks/useUser";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import { t } from "i18next";
import { useCreateReactionRepost, useGetAllReactionsForTarget, useUpdateReactionRepost} from "../../Repost/hooks/useRepost";

interface PodcastReactionModalProps {
  podcast_id: string;
  onReact: (reaction: string) => void;
  onClose: () => void;
}

const PodcastReactionModal: React.FC<PodcastReactionModalProps> = ({
  podcast_id,
  onReact,
  onClose,
}) => {
  const [isPending, setIsPending] = useState(false);
  const [pendingReaction, setPendingReaction] = useState<string | null>(null);
  const [successReaction, setSuccessReaction] = useState<string | null>(null);
  const { authUser } = useUser();

  const { mutate: createReactionRepost } = useCreateReactionRepost();
  const { mutate: updateReactionRepost } = useUpdateReactionRepost();
  const { data: allReactions } = useGetAllReactionsForTarget("Podcast", podcast_id);

  const handleReaction = ( reaction: string) => {

    if (!authUser?.id) {
      toast.error("Please login to react");
      return;
    }

    const userReaction = allReactions?.data?.reactions?.find(
      (r: any) => r.user_id === authUser.id
    );

    // If same reaction already made, no action
    if (userReaction && userReaction.type === reaction) return;

    setIsPending(true);
    setPendingReaction(reaction);

    if (userReaction) {
        console.log("Updating existing reaction:", {
          reactionId: userReaction._id,
          type: reaction,
        });
      updateReactionRepost(
        {
          reactionId: userReaction._id,
          type: reaction,
        },
        {
          onSuccess: () => {
            toast.success("Reaction updated successfully");
            setIsPending(false);
            setPendingReaction(null);
            setSuccessReaction(reaction);
            onReact(reaction);
            setTimeout(() => {
              setSuccessReaction(null);
              onClose();
            }, 1000);
          },
          onError: () => {
            toast.error("Failed to update reaction");
            setIsPending(false);
            setPendingReaction(null);
          },
        }
      );
    } else {

        console.log("Creating new reaction:",   {
          target_id: podcast_id,
          target_type: "Podcast",
          type: reaction,
        });

      createReactionRepost(
        {
          target_id: podcast_id,
          target_type: "Podcast",
          type: reaction,
        },
        {
          onSuccess: () => {
            toast.success(t("blog.alerts.ReactionSuccess"));
            setIsPending(false);
            setPendingReaction(null);
            setSuccessReaction(reaction);
            onReact(reaction);
            setTimeout(() => {
              setSuccessReaction(null);
              onClose();
            }, 1000);
          },
          onError: (error) => {
            toast.error(t("blog.alerts.ReactionFailed"));
            setIsPending(false);
            setPendingReaction(null);
            console.error("Error creating reaction:", error);
          },
        }
      );
    }
  };

  const bounceVariants = {
    bounce: {
      x: [0, 10, -10, 0],
      y: [5, -10, 0],
      transition: { duration: 0.5, times: [0, 0.6, 1] },
    },
  };

  const glowVariants = {
    glow: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const reactions = [
    { icon: "pepicons-pencil:hands-clapping", name: "clap" },
    { icon: "heroicons:hand-thumb-up", name: "like" },
    { icon: "heroicons:heart", name: "love" },
    { icon: "heroicons:face-smile", name: "smile" },
    { icon: "heroicons:face-frown", name: "cry" },
  ];

  return (
    <div
      className="shadow-lg rounded-full bg-neutral-800 p-3 transition-opacity duration-400 opacity-100 border border-neutral-600"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex space-x-4">
        {reactions.map((reaction) => (
          <button
            key={reaction.name}
            className="relative flex flex-col items-center hover:scale-110 transform transition cursor-pointer"
            onClick={() => handleReaction(reaction.name)}
            title={reaction.name}
            disabled={isPending && pendingReaction !== reaction.name}
          >
            <motion.div
              variants={{ ...bounceVariants, ...glowVariants }}
              animate={
                successReaction === reaction.name
                  ? "bounce"
                  : isPending && pendingReaction === reaction.name
                  ? "glow"
                  : ""
              }
            >
              <Icon 
                icon={reaction.icon} 
                className={`w-6 h-6 ${reaction.name === "clap" ? "transform scale-x-[-1]" : ""} ${
                  isPending && pendingReaction === reaction.name ? "text-primary-400" : ""
                }`}
              />
            </motion.div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PodcastReactionModal;
