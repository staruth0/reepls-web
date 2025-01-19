import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LuCalendar, LuEye, LuInfo, LuMenu, LuSave, LuShare, LuTag } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../../utils';
interface CreateTopBarProps {}

const CreatePostTopBar: React.FC<CreateTopBarProps> = ({}: CreateTopBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const actions = [
    {
      label: 'Preview',
      disabled: false,
      ActionIcon: LuEye,
      onClick: () => {
        console.log('Previewing the post...');
        navigate('/posts/article/preview/view');
      },
    },
    {
      label: 'Schedule',
      disabled: false,
      ActionIcon: LuCalendar,
      onClick: () => {
        console.log('Scheduling the post...');
      },
    },
    {
      label: 'Share',
      disabled: false,
      ActionIcon: LuShare,
      onClick: () => {
        console.log('Sharing the post...');
      },
    },
    {
      label: 'Save Draft',
      disabled: false,
      ActionIcon: LuSave,
      onClick: () => {
        console.log('Saving the draft...');
      },
    },
    {
      label: 'Add Tags',
      ActionIcon: LuTag,
      disabled: false,
      onClick: () => {
        console.log('Adding tags...');
      },
    },
  ];

  const onPublish = () => {
    navigate('/posts/article/preview/view');
  };

  const handleInfo = () => {
    console.log('Info');
  };

  return (
    <div className="w-full flex items-center justify-between px-10 z-100 sticky top-0 ">
      <h2 className=" text-xl font-instrumentSerif">{t(`New Article`)}</h2>
      <div className="flex items-center gap-2">
        <button
          className={cn('p-2 cursor-pointer rounded-full', 'hover:text-primary-400 focus:text-primary-400')}
          onClick={handleInfo}>
          <LuInfo className="w-6 h-6" />
        </button>
        <button className="py-3 px-10 rounded-full border border-primary-300 cursor-pointer" onClick={onPublish}>
          {t(`Publish`)}
        </button>

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
      </div>
    </div>
  );
};

export default CreatePostTopBar;
