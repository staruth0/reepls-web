import React, { useState, useEffect } from "react";
import { heart, sadface, smile, thumb, clap } from "../../../assets/icons";
import { useUser } from "../../../hooks/useUser";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  useGetArticleReactions,
  useUpdateReaction,
} from "../../Interactions/hooks";
import { ReactionReceived, Article } from "../../../models/datamodels";
import { t } from "i18next";
import {
  useCreateReactionRepost,
  useUpdateReactionRepost,
} from "../../Repost/hooks/useRepost";

interface ReactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReact: (reaction: string) => void;
  article_id: string;
  article: Article;
}

const ReactionModal: React.FC<ReactionModalProps> = ({
  isOpen,
  onClose,
  onReact,
  article_id,
  article,
}) => {
  const [isPending, setIsPending] = useState(false);
  const [pendingReaction, setPendingReaction] = useState<string | null>(null);
  const [successReaction, setSuccessReaction] = useState<string | null>(null);
  const { authUser } = useUser();

  // const { mutate: createReaction } = useCreateReaction();
  const { mutate: updateReaction } = useUpdateReaction();
  const { data: allReactions } = useGetArticleReactions(article_id);

  const { mutate: createReactionRepost } = useCreateReactionRepost();
  const { mutate: updateReactionRepost } = useUpdateReactionRepost();

  // Determine if the article is a repost for conditional logic
  const isRepost = article?.type === "Repost" && !!article?.repost?.repost_id;
  // Safely get repost ID if available
  const repostId = article?.repost?.repost_id;

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
    if (!authUser?.id) return; // Require login

    const userReaction = allReactions?.reactions?.find(
      (r: ReactionReceived) => r.user_id?.id === authUser.id
    );

    // If user already reacted with this type, do nothing
    if (userReaction && userReaction.type === reaction) return;

    setIsPending(true);
    setPendingReaction(reaction);

    if (isRepost) {
      // For repost article: create or update reactions with repost-specific mutations

      if (userReaction) {
        // Update reaction on repost
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
        // Create new reaction on repost
        if (!repostId) {
          toast.error("Invalid repost ID.");
          setIsPending(false);
          setPendingReaction(null);
          return;
        }

        console.log("repostdata",   {
            target_id: repostId,
            target_type: "Comment",
            type: reaction,
          });


        createReactionRepost(
          {
            target_id: repostId,
            target_type: "Repost",
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
              console.error('error message',error.message)
            },
          }
        );
      }
    } else {
      // For normal article: create or update reactions with normal mutations

      if (userReaction) {
        updateReaction(
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
        // createReaction(
        //   {
        //     type: reaction,
        //     article_id,
        //     user_id: authUser.id,
        //   },

      
          createReactionRepost(
          {
            target_id: article_id,
            target_type: "Article",
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
            onError: () => {
              toast.error(t("blog.alerts.ReactionFailed"));
              setIsPending(false);
              setPendingReaction(null);
            },
          }
        );
      }
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
    { icon: heart, name: "love" },
    { icon: thumb, name: "like" },
    { icon: smile, name: "smile" },
    { icon: sadface, name: "cry" },
    { icon: clap, name: "clap" },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="absolute mt-2 shadow-lg rounded-full bg-background p-3 transition-opacity duration-400 opacity-100 z-[999]"
      style={{ bottom: "40px", left: "0px" }}
    >
      <div className="reaction-modal-content flex space-x-4">
        {reactions.map((reaction) => (
          <button
            key={reaction.name}
            className="relative flex flex-col items-center hover:scale-110 transform transition cursor-pointer"
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

export default ReactionModal;
