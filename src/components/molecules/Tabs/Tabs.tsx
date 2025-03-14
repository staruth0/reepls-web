import React, {  useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface TabsProps {
  tabs: { id: number | string; title: string; icon?: React.ReactNode }[];
  activeTab: number | string;
  setActiveTab: (tabId: number | string) => void;
  scale?: boolean;
  borderBottom?: boolean;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab, borderBottom }) => {
  // const [tabStyle, setTabStyle] = useState<React.CSSProperties>({});
  const tabRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // useEffect(() => {
  //   const activeTabElement = tabRef.current?.querySelector('.active') as HTMLElement;
  //   if (activeTabElement) {
  //     setTabStyle({
  //       left: activeTabElement.offsetLeft,
  //       width: activeTabElement.offsetWidth,
  //     });
  //   }
  // }, [activeTab]);

  const handleTabClick = (tabId: number | string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="flex flex-col items-center backdrop-blur-sm">
      <div ref={tabRef} className={`relative flex w-full ${borderBottom ? 'border-b border-neutral-300' : ''}`}>
        {tabs.map((tab) => (
          <span
            key={tab.id}
            id={`tab-${tab.id}`}
            className={`relative flex-1 px-2 py-2 cursor-pointer transition-all duration-300 flex items-center justify-center ${
              activeTab === tab.id
                ? 'text-neutral-50'
                : 'text-neutral-400'
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.icon && tab.icon}
            {t(tab.title)}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary-400"></div>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Tabs;