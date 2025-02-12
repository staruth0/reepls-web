import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface TabsProps {
  tabs: { id: number | string; title: string }[]; // title is now only a string
  activeTab: number | string;
  setActiveTab: (tabId: number | string) => void;
  scale?: boolean;
  borderBottom?: boolean;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  scale,
  borderBottom,
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

  return (
    <div className="flex flex-col items-center backdrop-blur-sm">
      <div
        ref={tabRef}
        className={`relative flex justify-between w-full ${
          borderBottom ? "border-b" : ""
        }`}
      >
        {tabs.map((tab) => (
          <span
            key={tab.id}
            id={`tab-${tab.id}`}
            className={`px-2 py-2 cursor-pointer transition-all border-b-2 -mb-0 flex items-center ${
              activeTab === tab.id
                ? `border-primary-400 text-neutral-50 ${
                    scale ? "scale-110" : ""
                  }`
                : "border-transparent text-neutral-50"
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {t(tab.title)} 
          </span>
        ))}
        <div
          className="absolute bottom-0 h-[2px] bg-primary-400 transition-all duration-300"
          style={tabStyle}
        ></div>
      </div>
    </div>
  );
};

export default Tabs;
