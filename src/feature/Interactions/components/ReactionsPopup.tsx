import { X } from "lucide-react";
import React, { useState } from "react";
import Tabs from "../../../components/molecules/Tabs/Tabs";
import UserReactionContainer from "./UserReactionContainer";

interface ReactionProps {
  isOpen: boolean;
  onClose: () => void;
}



const reactionsTab = [
  { id: "All", title: "All" },
  { id: "heart", title: "heart" },
  { id: "sadface", title: "sadface" },
  { id: "smile", title: "smile" },
  { id: "thumb", title: "thumb" },
  { id: "clap", title: "clap" },
];

const allReactions = [
  {
    name: "John Doe",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    reaction: "heart",
    title: "Staruth Manager",
  },
  {
    name: "Jane Smith",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    reaction: "smile",
    title: "Software Engineer",
  },
  {
    name: "Alice Johnson",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    reaction: "clap",
    title: "Product Manager",
  },
  {
    name: "Bob Williams",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    reaction: "thumb",
    title: "Tech Lead",
  },
  {
    name: "Charlie Brown",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    reaction: "sadface",
    title: "Data Scientist",
  },
  {
    name: "Diana Prince",
    image:
      "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    reaction: "heart",
    title: "UX Designer",
  },
  {
    name: "Ethan Hunt",
    image:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    reaction: "clap",
    title: "Scrum Master",
  },
  {
    name: "Fiona Green",
    image:
      "https://images.unsplash.com/photo-1573497019440-badf5f4283d2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    reaction: "thumb",
    title: "AI Researcher",
  },
  {
    name: "George White",
    image:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    reaction: "sadface",
    title: "Marketing Specialist",
  },
  {
    name: "Hannah Black",
    image:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    reaction: "smile",
    title: "Community Manager",
  },
];

const heartReactions = allReactions.filter(
  (reaction) => reaction.reaction === "heart"
);
const sadfaceReactions = allReactions.filter(
  (reaction) => reaction.reaction === "sadface"
);
const smileReactions = allReactions.filter(
  (reaction) => reaction.reaction === "smile"
);
const thumbReactions = allReactions.filter(
  (reaction) => reaction.reaction === "thumb"
);
const clapReactions = allReactions.filter(
  (reaction) => reaction.reaction === "clap"
);

const ReactionsPopup: React.FC<ReactionProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<number | string>(
    reactionsTab[0].id
  );

  if (!isOpen) return null;

  // Function to get the reactions for the active tab
  const getReactionsForTab = () => {
    switch (activeTab) {
      case "All":
        return allReactions;
      case "heart":
        return heartReactions;
      case "sadface":
        return sadfaceReactions;
      case "smile":
        return smileReactions;
      case "thumb":
        return thumbReactions;
      case "clap":
        return clapReactions;
      default:
        return [];
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-[50vw] max-w-full shadow-lg">
        <div className="border-b">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold">Reactions</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-black"
            >
              <X size={20} />
            </button>
          </div>
          <div className="w-[70%] px-2">
            <Tabs
              tabs={reactionsTab}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              scale={false}
              isReaction={true}
            />
          </div>
        </div>
        <div className="p-4 space-y-3 min-h-[30vh] max-h-[70vh] overflow-y-auto">
          {getReactionsForTab().map((reaction, index) => (
            <UserReactionContainer
              key={index}
              name={reaction.name}
              image={reaction.image}
              reaction={reaction.reaction}
              title={reaction.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReactionsPopup;
