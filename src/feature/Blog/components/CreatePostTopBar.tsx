import { Menu, MenuButton, MenuItem, MenuItems, Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuDot, LuInfo, LuMenu } from 'react-icons/lu';
import { cn } from '../../../utils';
import { useUser } from '../../../hooks/useUser';
import SignInPopUp from '../../AnonymousUser/components/SignInPopUp';
import StarToggle from '../../../components/atoms/CommuniqueBtn';

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
  isCommunique: boolean;
  onToggleCommunique: (isCommunique: boolean) => void;
}

const CreatePostTopBar: React.FC<CreateTopBarProps> = ({ title, mainAction, actions, isCommunique, onToggleCommunique }) => {
  const { t } = useTranslation();
  const { isLoggedIn } = useUser();
  const [showSignInPopup, setShowSignInPopup] = useState<string | null>(null);
  const {authUser} = useUser()

  const handleActionBlocked = (action: string) => {
    if (!isLoggedIn) {
      setShowSignInPopup(action);
      return true;
    }
    return false;
  };

  const handleMainActionClick = () => {
    if (handleActionBlocked(mainAction.label.toLowerCase())) return;
    mainAction.onClick();
  };

  const handleMenuActionClick = (actionLabel: string, onClick: () => void) => {
    if (handleActionBlocked(actionLabel.toLowerCase())) return;
    onClick();
  };

  const handleInfoClick = () => {
    handleActionBlocked('view info');
  };

  return (
    <>
      <div className="w-full flex items-center justify-between px-4 lg:px-10 sticky top-0 backdrop-blur-md">
        <h2 className="text-xl font-instrumentSerif overflow-hidden text-ellipsis whitespace-nowrap max-w-md">
          {t(title)}
        </h2>
        <div className="flex items-center justify-center gap-2">
        { authUser.CanMakecommuniquer &&  <StarToggle
            isCommunique={isCommunique}
            onToggle={onToggleCommunique}
          />}
          <Popover className="relative flex items-center justify-center">
            <PopoverButton
              className={cn(
                'w-6 h-6',
                isLoggedIn
                  ? 'hover:text-primary-400 focus:text-primary-400 cursor-pointer'
                  : 'text-neutral-500 cursor-not-allowed'
              )}
              onClick={handleInfoClick}
              disabled={!isLoggedIn}
            >
              <LuInfo className="w-6 h-6" />
            </PopoverButton>
            {isLoggedIn && (
              <PopoverPanel
                anchor="bottom"
                className="flex flex-col mt-8 bg-background rounded-lg p-2 border border-neutral-300"
              >
                <span className="text-sm flex items-center gap-0">
                  <LuDot className="size-8 text-primary-400 animate-pulse" />
                  <span className="text-sm">
                    {t("Saved every")} <span className="font-bold text-primary-400">2s</span>
                  </span>
                </span>
              </PopoverPanel>
            )}
          </Popover>
          <button
            className={cn(
              'py-3 px-10 rounded-full border',
              isLoggedIn
                ? 'border-primary-300 cursor-pointer hover:bg-primary-50 focus:bg-primary-50'
                : 'border-neutral-500 text-neutral-500 cursor-not-allowed',
              'transition-all duration-300 ease-in-out'
            )}
            onClick={handleMainActionClick}
            disabled={!isLoggedIn}
          >
            {mainAction.label}
          </button>
          {actions.length > 0 && (
            <Menu>
              <MenuButton
                className={cn(
                  'inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm shadow-sm',
                  isLoggedIn
                    ? 'hover:text-primary-400 focus:text-primary-400 cursor-pointer'
                    : 'text-neutral-500 cursor-not-allowed',
                  'transition-all duration-300 ease-in-out'
                )}
                onClick={() => handleActionBlocked('view more actions')}
                disabled={!isLoggedIn}
              >
                <LuMenu className="w-6 h-6" />
              </MenuButton>
              {isLoggedIn && (
                <MenuItems
                  transition
                  anchor="bottom"
                  className={cn(
                    'w-40 mt-6 origin-top-right rounded-lg border border-neutral-300 bg-background py-1 px-2',
                    'shadow-lg relative',
                    'text-sm transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0'
                  )}
                >
                  {actions.map(({ label, ActionIcon, onClick, disabled }) => (
                    <MenuItem key={label} disabled={disabled}>
                      <button
                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:text-primary-400 text-base"
                        onClick={() => handleMenuActionClick(label, onClick)}
                        disabled={disabled}
                      >
                        <ActionIcon className="size-4" />
                        {label}
                        <kbd className="ml-auto hidden font-sans text-xs ">⌘E</kbd>
                      </button>
                    </MenuItem>
                  ))}
                </MenuItems>
              )}
            </Menu>
          )}
        </div>
      </div>

      {showSignInPopup && (
        <SignInPopUp
          text={showSignInPopup}
          position="below"
          onClose={() => setShowSignInPopup(null)}
        />
      )}
    </>
  );
};

export default CreatePostTopBar;