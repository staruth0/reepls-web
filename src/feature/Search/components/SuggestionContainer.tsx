import React from 'react'
import { ArrowUpRight, Search } from "lucide-react";

interface SuggestionContainerProps { 
    text: string;
}

const SuggestionContainer:React.FC<SuggestionContainerProps> = ({text}) => {
  return (
    <div
      className="flex items-center gap-3 cursor-pointer p-2 hover:shadow-sm rounded-lg transition-all"
    >
      <ArrowUpRight className="w-4 h-4 text-neutral-50" />

      <p className="flex-1 text-neutral-50">{text}</p>

      <Search className="w-4 h-4 text-neutral-50" />
    </div>
  );
}

export default SuggestionContainer