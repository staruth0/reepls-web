import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  heart,
  sadface,
  smile,
  thumb,
  clap,
} from "../../../assets/icons/index";

interface TabsProps {
  tabs: { id: number | string; title: string }[];
  activeTab: number | string;
  setActiveTab: (tabId: number | string) => void;
  scale: boolean;
  borderBottom?: boolean;
  isReaction?: boolean;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  scale,
  borderBottom,
  isReaction
}) => {
  const [tabStyle, setTabStyle] = useState<React.CSSProperties>({});
  const tabRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const activeTabElement = tabRef.current?.querySelector(
      ".active"
    ) as HTMLElement;
    if (activeTabElement) {
      setTabStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }
  }, [activeTab]);

  const handleTabClick = (tabId: number | string) => {
    setActiveTab(tabId);
  };


  const getIcon = (title: string) => {
    switch (title) {
      case "All":
        return (
          <div className="font-semibold text-[16px] space-x-1">
            <span>{title}</span>
            <span>56</span>
          </div>
        );
      case "heart":
        return (
          <div className="flex items-center gap-1 font-semibold text-[16px]">
            <img src={heart} alt="Heart" className="w-6 h-6" />
            <span>10</span>
          </div>
        );
      case "sadface":
        return (
          <div className="flex items-center gap-1 font-semibold text-[16px]">
            <img src={sadface} alt="Sad Face" className="w-6 h-6" />
            <span>5</span>
          </div>
        );
      case "smile":
        return (
          <div className="flex items-center gap-1 font-semibold text-[16px]">
            <img src={smile} alt="Smile" className="w-6 h-6" />
            <span>15</span>
          </div>
        );
      case "thumb":
        return (
          <div className="flex items-center gap-1 font-semibold text-[16px]">
            <img src={thumb} alt="Thumb" className="w-6 h-6" />
            <span>8</span>
          </div>
        );
      case "clap":
        return (
          <div className="flex items-center gap-1 font-semibold text-[16px] ">
            <img src={clap} alt="Clap" className="w-6 h-6" />
            <span>12</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center backdrop-blur-sm">
      {/* Tabs */}
      <div
        ref={tabRef}
        className={`relative flex justify-between w-full  ${
          borderBottom ? "border-b" : ""
        }`}
      >
        {tabs.map((tab) => (
          <span
            key={tab.id}
            id={`tab-${tab.id}`}
            className={`px-2 py-2 cursor-pointer transition-all border-b-2 -mb-0  flex items-center  ${
              activeTab === tab.id
                ? `border-primary-400 text-neutral-50 ${
                    scale ? "scale-110" : ""
                  }`
                : "border-transparent text-neutral-50"
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {isReaction ? getIcon(tab.title) : t(`${tab.title}`)}
          </span>
        ))}
        {/* Tab slider */}
        <div
          className="absolute bottom-0 h-[2px] bg-primary-400 transition-all duration-300"
          style={tabStyle}
        ></div>
      </div>
    </div>
  );
};

export default Tabs;
