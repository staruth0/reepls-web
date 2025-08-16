import React, { useState, useEffect } from "react";
import { useUser } from "../../../hooks/useUser";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  useCreateReactionRepost,
  useUpdateReactionRepost,
} from "../../Repost/hooks/useRepost";
import { useGetAllReactionsForTarget } from "../../Repost/hooks/useRepost";
import { t } from "i18next";
import { heart, sadface, smile, thumb, clap } from "../../../assets/icons";

interface PodcastReactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReact: (reaction: string) => void;
  podcast_id: string;
}

const PodcastReactionModal: React.FC<PodcastReactionModalProps> = ({
  isOpen,
  onClose,
  onReact,
  podcast_id,
}) => {
  const [isPending, setIsPending] = useState(false);
  const [pendingReaction, setPendingReaction] = useState<string | null>(null);
  const [successReaction, setSuccessReaction] = useState<string | null>(null);
  const { authUser } = useUser();

  const { mutate: createReactionRepost } = useCreateReactionRepost();
  const { mutate: updateReactionRepost } = useUpdateReactionRepost();
  const { data: allReactions } = useGetAllReactionsForTarget("Podcast", podcast_id);

  // Close the modal when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".reaction-modal-content")) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleReaction = (reaction: string) => {
    if (!authUser?.id) {
      toast.error("Please login to react");
      return;
    }

    const userReaction = allReactions?.data?.reactions?.find(
      (r: any) => r.user_id === authUser.id
    );

    if (userReaction && userReaction.type === reaction) return;

    setIsPending(true);
    setPendingReaction(reaction);

    if (userReaction) {
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
            console.error('Error creating reaction:', error);
          },
        }
      );
    }
  };

  const bounceVariants = {
    bounce: {
      y: [0, -10, 0],
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
    { icon: heart, name: "love" },
    { icon: thumb, name: "like" },
    { icon: smile, name: "smile" },
    { icon: sadface, name: "cry" },
    { icon: clap, name: "clap" },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="absolute mt-2 shadow-lg rounded-full bg-background p-3 z-[999]"
      style={{ bottom: "40px", left: "0px" }}
    >
      <div className="reaction-modal-content flex space-x-4">
        {reactions.map((reaction) => (
          <button
            key={reaction.name}
            className="relative flex flex-col items-center hover:scale-110 transition-transform cursor-pointer"
            onClick={() => handleReaction(reaction.name)}
            title={reaction.name}
            disabled={isPending && pendingReaction !== reaction.name}
          >
            <motion.img
              src={reaction.icon}
              alt={reaction.name}
              className="w-6 h-6"
              variants={{ ...bounceVariants, ...glowVariants }}
              animate={
                successReaction === reaction.name
                  ? "bounce"
                  : isPending && pendingReaction === reaction.name
                  ? "glow"
                  : ""
              }
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PodcastReactionModal;