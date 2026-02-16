import React, { ReactNode } from "react";

interface ConfigurationWrapperProps {
  children: ReactNode;
}

const ConfigurationWrapper: React.FC<ConfigurationWrapperProps> = ({ children}) => {
  return (
    <div className="px-1 text-[14px] cursor-pointer py-2 border-b-[1px] border-neutral-500 rounded flex justify-between items-center">
      {children}
    </div>
  );
};


export default ConfigurationWrapper;
