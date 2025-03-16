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
    <div className="w-full flex items-center justify-between px-10 sticky top-0 backdrop-blur-md">
      <h2 className=" text-xl font-instrumentSerif overflow-hidden text-ellipsis whitespace-nowrap max-w-md">
        {t(title)}
      </h2>
      <div className="flex items-center gap-2">
        <button
          className={cn('p-2 cursor-pointer rounded-full', 'hover:text-primary-400 focus:text-primary-400')}
          onClick={handleInfo}>
          <LuInfo className="w-6 h-6" />
        </button>
        <button
          className="py-3 px-10 rounded-full border border-primary-300 cursor-pointer relative"
          onClick={mainAction.onClick}>
          {mainAction.label}
        </button>
        {actions.length > 0 && (
          <Menu>
            <MenuButton
              className={cn(
                'inline-flex items-center gap-2 rounded-md  py-1.5 px-3 text-sm  shadow-sm  ',
                'hover:text-primary-400 focus:text-primary-400',
                'cursor-pointer transition-all duration-300 ease-in-out'
              )}>
              <LuMenu className="w-6 h-6" />
            </MenuButton>

            <MenuItems
              transition
              anchor="bottom"
              className={cn(
                'w-40 mt-6 origin-top-right rounded-lg border border-neutral-300 bg-background py-1 px-2',
                'shadow-lg relative',
                ' text-sm transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0'
              )}>
              {actions.map(({ label, ActionIcon, onClick, disabled }) => (
                <MenuItem key={label} disabled={disabled}>
                  <button
                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:text-primary-400 text-base"
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
