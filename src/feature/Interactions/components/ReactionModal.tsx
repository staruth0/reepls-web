import React, { useState, useEffect } from "react";
import { Icon } from '@iconify/react';
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
  const [showBurstAnimation, setShowBurstAnimation] = useState<string | null>(null);
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

  // Sound effect functions for each reaction type
  const playReactionSound = (reaction: string) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      switch (reaction) {
        case "clap":
          playClapSound(audioContext);
          break;
        case "like":
          playLikeSound(audioContext);
          break;
        case "love":
          playLoveSound(audioContext);
          break;
        case "smile":
          playSmileSound(audioContext);
          break;
        case "cry":
          playSadSound(audioContext);
          break;
        default:
          break;
      }
    } catch (error) {
      // Silently fail if audio context not available
      void error;
    }
  };

  // Clap sound - percussive, sharp, energetic (like hands clapping)
  const playClapSound = (audioContext: AudioContext) => {
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Two tones for percussive effect
    oscillator1.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator2.frequency.setValueAtTime(600, audioContext.currentTime);
    
    // Sharp attack, quick decay (like a clap)
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

    oscillator1.type = 'square';
    oscillator2.type = 'square';
    oscillator1.start(audioContext.currentTime);
    oscillator2.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 0.15);
    oscillator2.stop(audioContext.currentTime + 0.15);
  };

  // Like sound - positive, upbeat, ascending
  const playLikeSound = (audioContext: AudioContext) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Upward, positive tone
    oscillator.frequency.setValueAtTime(350, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(450, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.type = 'sine';
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  // Love sound - warm, melodic, heart-like (two-tone harmony)
  const playLoveSound = (audioContext: AudioContext) => {
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Harmony: root note and fifth (warm, pleasant)
    oscillator1.frequency.setValueAtTime(330, audioContext.currentTime); // E4
    oscillator2.frequency.setValueAtTime(495, audioContext.currentTime); // B4 (fifth)
    
    // Gentle fade
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

    oscillator1.type = 'sine';
    oscillator2.type = 'sine';
    oscillator1.start(audioContext.currentTime);
    oscillator2.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 0.4);
    oscillator2.stop(audioContext.currentTime + 0.4);
  };

  // Smile sound - cheerful, bouncy, happy (short upbeat notes)
  const playSmileSound = (audioContext: AudioContext) => {
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Cheerful upward bounce
    oscillator1.frequency.setValueAtTime(450, audioContext.currentTime);
    oscillator1.frequency.linearRampToValueAtTime(550, audioContext.currentTime + 0.15);
    oscillator2.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);

    oscillator1.type = 'sine';
    oscillator2.type = 'sine';
    oscillator1.start(audioContext.currentTime);
    oscillator2.start(audioContext.currentTime + 0.1);
    oscillator1.stop(audioContext.currentTime + 0.25);
    oscillator2.stop(audioContext.currentTime + 0.25);
  };

  // Cry sound - sad, descending tone
  const playSadSound = (audioContext: AudioContext) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Sad, descending tone (lower frequency, downward pitch)
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
    
    // Soft volume
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.type = 'sine';
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const handleReaction = (reaction: string) => {
    if (!authUser?.id) return; // Require login

    const userReaction = allReactions?.reactions?.find(
      (r: ReactionReceived) => r.user_id?.id === authUser.id
    );

    // If user already reacted with this type, do nothing
    if (userReaction && userReaction.type === reaction) return;

    // Start animation immediately
    setShowBurstAnimation(reaction);
    setIsPending(true);
    setPendingReaction(reaction);

    // Play sound effect for the reaction
    playReactionSound(reaction);

    // Close modal immediately when animation finishes
    // Sad animation is slightly longer (700ms) vs normal burst (600ms)
    const animationDuration = reaction === "cry" ? 700 : 600;
    setTimeout(() => {
      setShowBurstAnimation(null);
      onReact(reaction); // Update parent component
      onClose(); // Close modal immediately after animation
    }, animationDuration);

    // Execute mutation in background (no need to wait for it)
    const executeMutation = () => {
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
              setIsPending(false);
              setPendingReaction(null);
              // Modal already closed after burst animation
            },
            onError: () => {
              toast.error("Failed to update reaction");
              setIsPending(false);
              setPendingReaction(null);
              // Optionally reopen modal or show error state
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

        // Removed console.log for production


        createReactionRepost(
          {
            target_id: repostId,
            target_type: "Repost",
            type: reaction,
          },
          {
            onSuccess: () => {
              setIsPending(false);
              setPendingReaction(null);
              // Modal already closed after burst animation
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
              setIsPending(false);
              setPendingReaction(null);
              // Modal already closed after burst animation
            },
            onError: () => {
              toast.error("Failed to update reaction");
              setIsPending(false);
              setPendingReaction(null);
              // Optionally reopen modal or show error state
            },
          }
        );
      } else {
      

      
          createReactionRepost(
          {
            target_id: article_id,
            target_type: "Article",
            type: reaction,
          },
          {
            onSuccess: () => {
              setIsPending(false);
              setPendingReaction(null);
              // Modal already closed after burst animation
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

    // Execute mutation immediately - modal will close after burst animation regardless
    executeMutation();
  };

  // Medium-style burst animation - scales up and rotates slightly
  const burstVariants = {
    burst: {
      scale: [1, 1.8, 1.5],
      rotate: [0, 15, -10, 0],
      opacity: [1, 1, 0.9],
      transition: { 
        duration: 0.6,
        times: [0, 0.4, 1],
        ease: [0.34, 1.56, 0.64, 1] // Medium-style elastic easing
      },
    },
  };

  // Sad animation - droops downward to reflect sadness
  const sadVariants = {
    sad: {
      scale: [1, 1.3, 1.1],
      rotate: [0, -5, 5, -3, 0], // Slight wobble
      y: [0, 8, 12], // Moves downward
      opacity: [1, 0.95, 0.9],
      transition: { 
        duration: 0.7,
        times: [0, 0.5, 1],
        ease: [0.25, 0.46, 0.45, 0.94] // Slow, sad easing
      },
    },
  };

  // Particle animation variants for Medium-style effect
  const particleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: (i: number) => ({
      opacity: [0, 1, 0],
      scale: [0, 1.2, 0],
      x: Math.cos((i * 360) / 8) * 40,
      y: Math.sin((i * 360) / 8) * 40,
      transition: {
        duration: 0.6,
        delay: i * 0.05,
        ease: "easeOut"
      }
    })
  };

  // Sad particle animation - particles fall downward like tears
  const sadParticleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: (i: number) => ({
      opacity: [0, 0.8, 0],
      scale: [0, 0.8, 0],
      x: (Math.random() - 0.5) * 30, // Random horizontal spread
      y: [0, 30 + i * 5], // Fall downward
      transition: {
        duration: 0.8,
        delay: i * 0.1,
        ease: "easeIn" // Accelerate downward like tears
      }
    })
  };

  const reactions = [
    { icon: "pepicons-pencil:hands-clapping" , name: "clap" },
    { icon: "heroicons:hand-thumb-up", name: "like" },
    { icon: "heroicons:heart", name: "love" },
    { icon: "heroicons:face-smile", name: "smile" },
    { icon: "heroicons:face-frown", name: "cry" },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="absolute shadow-lg rounded-full bg-background p-3 transition-opacity duration-400 opacity-100 z-[999]"
    >
      <div className="reaction-modal-content flex space-x-4 relative">
        {reactions.map((reaction) => (
          <button
            key={reaction.name}
            className="relative flex flex-col items-center hover:scale-110 transform transition cursor-pointer"
            onClick={() => handleReaction(reaction.name)}
            title={reaction.name}
            disabled={isPending && pendingReaction !== reaction.name}
          >
            {/* Particles for burst effect or tears for sad */}
            {showBurstAnimation === reaction.name && (
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                {[...Array(reaction.name === "cry" ? 5 : 8)].map((_, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={reaction.name === "cry" ? sadParticleVariants : particleVariants}
                    initial="initial"
                    animate="animate"
                    className={`absolute ${reaction.name === "cry" ? "w-1 h-4 bg-blue-400/60" : "w-2 h-2 rounded-full bg-primary-400"}`}
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                ))}
              </div>
            )}
            
            <motion.div
              variants={reaction.name === "cry" ? sadVariants : burstVariants}
              animate={
                showBurstAnimation === reaction.name
                  ? reaction.name === "cry" ? "sad" : "burst"
                  : ""
              }
            >
              <Icon 
                icon={reaction.icon} 
                className={`w-6 h-6 ${reaction.name === "clap" ? "transform scale-x-[-1]" : ""} ${
                  isPending && pendingReaction === reaction.name ? "text-primary-400" : ""
                } ${showBurstAnimation === reaction.name ? "text-primary-400" : ""}`}
              />
            </motion.div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReactionModal;
