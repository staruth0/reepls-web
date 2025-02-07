import React, { useEffect, useState } from "react";
import { heart, sadface, smile, thumb, clap } from "../../../assets/icons";
import { useCreateReaction } from "../hooks";
import { useUser } from "../../../hooks/useUser";

interface ReactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReact: (reaction: string) => void;
  article_id: string;
}

const ReactionModal: React.FC<ReactionModalProps> = ({isOpen,onClose,onReact,article_id}) => {
  const [isVisible, setIsVisible] = useState(false);
  const {authUser} = useUser()
  const {mutate: createReaction} = useCreateReaction()
  

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const reactions = [
    { icon: heart, name: "Love" },
    { icon: thumb, name: "Like" },
    { icon: smile, name: "smile" },
    { icon: sadface, name: "Cry" },
    { icon: clap, name: "clap" },
  ];

  const handleReaction = ( reaction: string ) => {
  
    console.log({ type: reaction, article_id, user_id: authUser?.id || "" });
    createReaction({ type: reaction, article_id, user_id: authUser?.id || "" }, {
      onSuccess: () => { 
        console.log("Reaction created successfully");
      }
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-0 z-40"
        onClick={onClose}
      ></div>

      <div
        className={`absolute z-50 mt-2 bg-background  shadow-lg rounded-full p-3 transition-opacity duration-400 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        style={{ bottom: "40px", left: "0px" }}
      >
        <div className="flex space-x-4">
          {reactions.map((reaction) => (
            <button
              key={reaction.name}
              className="flex flex-col items-center  hover:scale-110 transform transition cursor-pointer"
              onClick={() => {
                onReact(reaction.name);
                onClose();
              }}
              title={reaction.name}
            >
              <img
                src={reaction.icon}
                alt={reaction.name}
                className="w-6 h-6"
                onClick={()=>handleReaction(reaction.name)}
              />
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ReactionModal;
