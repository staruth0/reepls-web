import React, { useEffect, useState } from "react";
import { heart, sadface, smile, thumb, clap } from "../../../assets/icons";
import {
  useCreateReaction,
  useGetArticleReactions,
  useUpdateReaction,
} from "../hooks";
import { useUser } from "../../../hooks/useUser";
import { motion } from "framer-motion";
import { toast } from "react-toastify"; // Import toast (adjust if using a different library)
import {ReactionReceived } from "../../../models/datamodels";

interface ReactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReact: (reaction: string) => void;
  article_id: string;
}

const ReactionModal: React.FC<ReactionModalProps> = ({
  isOpen,
  onClose,
  onReact,
  article_id,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [pendingReaction, setPendingReaction] = useState<string | null>(null);
  const [successReaction, setSuccessReaction] = useState<string | null>(null);
  const { authUser } = useUser();
  const { mutate: createReaction } = useCreateReaction();
  const { mutate: updateReaction } = useUpdateReaction();
  const { data: allReactions } = useGetArticleReactions(article_id);

  // State to store the array of user IDs
  const [userIds, setUserIds] = useState<string[]>([]);

  useEffect(() => {
    console.log("allReactions", allReactions);

    // Extract user_ids from allReactions and store in userIds array
    if (allReactions?.reactions && Array.isArray(allReactions?.reactions)) {
      const extractedUserIds = allReactions?.reactions.map((reaction:ReactionReceived
      ) => reaction.user_id.id);
      setUserIds(extractedUserIds);
    }

    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen, allReactions]);

  // Log userIds whenever it updates (for debugging purposes)
  useEffect(() => {
    console.log("Extracted userIds:", userIds);
  }, [userIds]);

  if (!isVisible) return null;

  const handleReaction = (reaction: string) => {
    // Check if authUser.id exists in userIds
    const userHasReacted = authUser?.id && userIds.includes(authUser.id);
    console.log('userhasreacted',userHasReacted)

    if (userHasReacted) {
      // Find the existing reaction for this user
      console.log('reactions',allReactions?.reactions)
      console.log('id',authUser?.id)
      const existingReaction = allReactions?.reactions.find(
        (r:ReactionReceived) => r?.user_id?.id === authUser?.id
      );
      console.log('existing reaction',existingReaction);

      if (existingReaction) {
        // Check if the new reaction is different from the existing one
        if (existingReaction.type === reaction) {
          // If the reaction is the same, do nothing and exit
          console.log("Same reaction selected, no update needed");
          return;
        }
        console.log('reaching here')
        // If the reaction is different, proceed with update
        setIsPending(true);
        setPendingReaction(reaction);
        updateReaction(
          {
            reactionId: existingReaction._id,
            type: reaction,
          },
          {
            onSuccess: () => {
              setIsPending(false);
              setPendingReaction(null);
              setSuccessReaction(reaction);
              setTimeout(() => setSuccessReaction(null), 1000);
              toast.success("Reaction updated successfully");
              console.log("Reaction updated successfully");
            },
            onError: () => {
              setIsPending(false);
              setPendingReaction(null);
              toast.error("Failed to update reaction");
              console.log("Failed to update reaction");
            },
          }
        );
      }
    } else {
      // Create a new reaction if user hasn't reacted yet
      setIsPending(true);
      setPendingReaction(reaction);
      createReaction(
        { type: reaction, article_id, user_id: authUser?.id || "" },
        {
          onSuccess: () => {
            setIsPending(false);
            setPendingReaction(null);
            setSuccessReaction(reaction);
            setTimeout(() => setSuccessReaction(null), 1000);
            toast.success("Reaction created successfully");
            console.log("Reaction created successfully");
          },
          onError: () => {
            setIsPending(false);
            setPendingReaction(null);
            toast.error("Failed to create reaction");
            console.log("Failed to create reaction");
          },
        }
      );
    }
  };

  const bounceVariants = {
    bounce: {
      x: [0, 10, -10, 0],
      y: [5, -10, 0],
      transition: {
        duration: 0.5,
        times: [0, 0.6, 1],
      },
    },
  };

  const glowVariants = {
    glow: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
      },
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
    <>
      <div
        className="fixed inset-0 bg-black opacity-0 z-40"
        onClick={onClose}
      ></div>

      <div
        className={`absolute z-50 mt-2 bg-background shadow-lg rounded-full p-3 transition-opacity duration-400 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        style={{ bottom: "40px", left: "0px" }}
      >
        <div className="flex space-x-4">
          {reactions.map((reaction) => (
            <button
              key={reaction.name}
              className="relative flex flex-col items-center hover:scale-110 transform transition cursor-pointer"
              onClick={() => {
                onReact(reaction.name);
                handleReaction(reaction.name);
              }}
              title={reaction.name}
              disabled={isPending && pendingReaction !== reaction.name}
            >
              <motion.img
                src={reaction.icon}
                alt={reaction.name}
                className="w-6 h-6"
                variants={{
                  ...bounceVariants,
                  ...glowVariants,
                }}
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
    </>
  );
};

export default ReactionModal;
