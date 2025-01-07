import React from 'react';
import { useTranslation } from 'react-i18next';
import { LuInfo, LuMenu } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';

interface CreateTopBarProps {}

const CreatePostTopBar: React.FC<CreateTopBarProps> = ({}: CreateTopBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {t} = useTranslation()

  const onPublish = () => {
    if (location.pathname === '/test/posts/create') {
      navigate('/test/posts/create/preview');
    } else if (location.pathname === '/posts/create/preview') {
      console.log('Publishing the post...');
    }
  };

  const onPreview = () => {
    if (location.pathname === '/posts/create') {
      navigate('/posts/create/preview');
    } else if (location.pathname === '/posts/create/preview') {
      console.log('Publishing the post...');
    }
  };

  const handleInfo = () => {
    console.log('Info');
  };

  return (
    <div className="w-full flex items-center justify-between px-10">
      <h2 className=" text-xl font-instrumentSerif">{t(`New Article`)}</h2>
      <div className="flex items-center gap-2">
        <button className="p-2 cursor-pointer rounded-full" onClick={handleInfo}>
          <LuInfo className="w-6 h-6" />
        </button>
        <button
          className="py-3 px-10 rounded-full bg-primary-300 text-plain-b font-roboto cursor-pointer"
          onClick={onPublish}>
          {t(`Publish`)}
        </button>
        <button className="p-2 cursor-pointer rounded-full">
          <LuMenu className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default CreatePostTopBar;
