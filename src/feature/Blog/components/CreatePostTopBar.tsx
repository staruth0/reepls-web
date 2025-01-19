import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LuInfo, LuMenu } from 'react-icons/lu';
import { cn } from '../../../utils';
interface CreateTopBarProps {
  title: string;
  mainAction: {
    label: string;
    onClick: () => void;
  };
  actions: {
    label: string;
    onClick: () => void;
    disabled: boolean;
    ActionIcon: React.ElementType;
  }[];
}

const CreatePostTopBar: React.FC<CreateTopBarProps> = ({ title, mainAction, actions }: CreateTopBarProps) => {
  const { t } = useTranslation();

  const handleInfo = () => {
    console.log('Info');
  };

  return (
    <div className="w-full flex items-center justify-between px-10 z-100 sticky top-0 ">
      <h2 className=" text-xl font-instrumentSerif overflow-hidden text-ellipsis whitespace-nowrap">{title}</h2>
      <div className="flex items-center gap-2">
        <button
          className={cn('p-2 cursor-pointer rounded-full', 'hover:text-primary-400 focus:text-primary-400')}
          onClick={handleInfo}>
          <LuInfo className="w-6 h-6" />
        </button>
        <button
          className="py-3 px-10 rounded-full border border-primary-300 cursor-pointer"
          onClick={mainAction.onClick}>
          {mainAction.label}
        </button>
        {actions.length > 0 && (
          <Menu>
            <MenuButton
              className={cn(
                'inline-flex items-center gap-2 rounded-md  py-1.5 px-3 text-sm  shadow-inner ',
                'hover:text-primary-400 focus:text-primary-400',
                'cursor-pointer transition-all duration-300 ease-in-out'
              )}>
              <LuMenu className="w-6 h-6" />
            </MenuButton>

            <MenuItems
              transition
              anchor="bottom"
              className="w-36 mt-2 origin-top-right rounded-xl border border-neutral-300 bg-background p-1 text-sm transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0">
              {actions.map(({ label, ActionIcon, onClick, disabled }) => (
                <MenuItem key={label} disabled={disabled}>
                  <button
                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:text-primary-400"
                    onClick={onClick}>
                    <ActionIcon className="size-4" />
                    {label}
                    <kbd className="ml-auto hidden font-sans text-xs ">⌘E</kbd>
                  </button>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        )}
      </div>
    </div>
  );
};

export default CreatePostTopBar;
