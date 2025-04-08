import React, { useState } from "react";
import { heart, sadface, smile, thumb, clap } from "../../../assets/icons";

import { useUser } from "../../../hooks/useUser";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useCreateReaction, useGetArticleReactions, useUpdateReaction } from "../../Interactions/hooks";
import { ReactionReceived } from "../../../models/datamodels";

interface ReactionModalProps {
  article_id: string;
}

const ReactionModal: React.FC<ReactionModalProps> = ({ article_id }) => {
  const [isPending, setIsPending] = useState(false);
  const [pendingReaction, setPendingReaction] = useState<string | null>(null);
  const [successReaction, setSuccessReaction] = useState<string | null>(null);
  const { authUser } = useUser();
  const { mutate: createReaction } = useCreateReaction();
  const { mutate: updateReaction } = useUpdateReaction();
  const { data: allReactions } = useGetArticleReactions(article_id);

  const handleReaction = (reaction: string) => {
    if (!authUser?.id) return; // Ensure user is logged in

    const userReaction = allReactions?.reactions?.find(
      (r: ReactionReceived) => r.user_id?.id === authUser.id
    );

    if (userReaction) {
      // Update existing reaction
      if (userReaction.type === reaction) return; // Same reaction, no action needed

      setIsPending(true);
      setPendingReaction(reaction);
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
            setTimeout(() => setSuccessReaction(null), 1000);
            
          },
          onError: () => {
            toast.error("Failed to update reaction");
            setIsPending(false);
            setPendingReaction(null);
           
          },
        }
      );
    } else {
      // Create new reaction
      setIsPending(true);
      setPendingReaction(reaction);
      createReaction(
        { type: reaction, article_id, user_id: authUser.id },
        {
          onSuccess: () => {
            toast.success("Reaction created successfully");
            setIsPending(false);
            setPendingReaction(null);
            setSuccessReaction(reaction);
            setTimeout(() => setSuccessReaction(null), 1000);
            
          },
          onError: () => {
            toast.error("Failed to create reaction");
            setIsPending(false);
            setPendingReaction(null);
         
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
    { icon: heart, name: "love" },
    { icon: thumb, name: "like" },
    { icon: smile, name: "smile" },
    { icon: sadface, name: "cry" },
    { icon: clap, name: "clap" },
  ];



  return (
    <div
      className=" mt-2 shadow-sm rounded-full bg-background p-3 transition-opacity duration-400 opacity-100 z-[999]"
      style={{ bottom: "40px", left: "0px" }}
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