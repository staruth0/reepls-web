import React, { useEffect, useState } from "react";
import { heart, sadface, smile, thumb, clap } from "../../../assets/icons";
import { useCreateReaction } from "../hooks";
import { useUser } from "../../../hooks/useUser";
import { motion, AnimatePresence } from "framer-motion";

interface ReactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReact: (reaction: string) => void;
  article_id: string;
}

const ReactionModal: React.FC<ReactionModalProps> = ({ isOpen, onClose, onReact, article_id }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [successReaction, setSuccessReaction] = useState<string | null>(null);
  const { authUser } = useUser();
  const { mutate: createReaction } = useCreateReaction();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const reactions = [
    { icon: heart, name: "love" },
    { icon: thumb, name: "like" },
    { icon: smile, name: "smile" },
    { icon: sadface, name: "cry" },
    { icon: clap, name: "clap" },
  ];

  const handleReaction = (reaction: string) => {
    setIsPending(true);
    createReaction({ type: reaction, article_id, user_id: authUser?.id || "" }, {
      onSuccess: () => {
        setIsPending(false);
        setSuccessReaction(reaction);
        setTimeout(() => setSuccessReaction(null), 1000); // Reset after animation
        console.log("Reaction created successfully");
      },
      onError: () => {
        setIsPending(false);
      }
    });
  };

  const getAnimation = (reaction: string) => {
    switch (reaction) {
      case "love":
        return { scale: [1, 1.5, 1], rotate: [0, 20, -20, 0], transition: { duration: 0.5 } };
      case "like":
        return { scale: [1, 1.3, 1], transition: { duration: 0.3 } };
      case "smile":
        return { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0], transition: { duration: 0.4 } };
      case "cry":
        return { scale: [1, 1.1, 1], y: [0, -10, 0], transition: { duration: 0.5 } };
      case "clap":
        return { scale: [1, 1.4, 1], transition: { duration: 0.3 } };
      default:
        return {};
    }
  };

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
            <motion.button
              key={reaction.name}
              className="flex flex-col items-center hover:scale-110 transform transition cursor-pointer"
              onClick={() => {
                onReact(reaction.name);
                handleReaction(reaction.name);
              }}
              title={reaction.name}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence>
                {isPending && successReaction === reaction.name && (
                  <motion.img
                    src={reaction.icon}
                    alt={reaction.name}
                    className="w-6 h-6"
                    initial={{ scale: 0 }}
                    animate={getAnimation(reaction.name)}
                    exit={{ scale: 0 }}
                  />
                )}
                {!isPending && (
                  <motion.img
                    src={reaction.icon}
                    alt={reaction.name}
                    className="w-6 h-6"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ReactionModal;