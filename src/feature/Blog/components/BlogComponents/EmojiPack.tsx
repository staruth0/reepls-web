import React from "react";

const emojis = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
  "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
  "😋", "😜", "🤪", "😝", "🤑", "🤗", "🤔", "🤭", "🤫", "🤥",
  "😎", "🤓", "🧐", "😕", "🙁", "☹️", "😮", "😯", "👩‍🦱", "👸", "🕵️‍♂️",
  "😲", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳",
  "🥶", "😱", "😨", "😰", "😥", "😓", "🤒", "🤕", "🤑",
];

interface EmojiPackProps {
  onSelectEmoji: (emoji: string) => void;
  onClose: () => void;
}

const EmojiPack: React.FC<EmojiPackProps> = ({ onSelectEmoji, onClose }) => {
  return (
    <div className="absolute bottom-full mb-2 right-0 w-80 bg-background shadow-md rounded-xl  z-10">
      <div
        className="p-4 grid grid-cols-8 gap-3 max-h-64 overflow-y-auto"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
        }}
      >
        {emojis.map((emoji, index) => (
          <button
            key={index}
            className="text-xl hover:bg-neutral-100 rounded-full p-2 focus:outline-none transition"
            onClick={() => {
              onSelectEmoji(emoji);
              onClose();
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPack;
