import React, { ReactNode, useState } from "react";
import { User } from "../../../models/datamodels";
import { Pics } from "../../../assets/images";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ProfileBodyProps {
  children: ReactNode;
  user: User;
}

const ProfileBody: React.FC<ProfileBodyProps> = ({ children, user }) => {
  const [isImageOpen, setIsImageOpen] = useState(false);

  const handleImageClick = () => {
    setIsImageOpen(true);
  };

  const handleClose = () => {
    setIsImageOpen(false);
  };

  return (
    <>
      <div
        className="relative h-36 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${user.banner_picture ? user.banner_picture : Pics.bannerPlaceholder})` 
        }}
      >
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <img
            src={(user.profile_picture !== 'https://example.com/default-profile.png' || '') ? user.profile_picture :  Pics.imagePlaceholder}
            alt="profile"
            className="w-28 h-28 rounded-full border-2 border-white shadow-lg absolute bottom-0 left-4 translate-y-1/2 cursor-pointer"
            onClick={handleImageClick}
          />
        </div>
      </div>

      <div className="mt-20 px-4">{children}</div>

      {/* Image Modal with Framer Motion */}
      <AnimatePresence>
        {isImageOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 z-[999] flex items-center justify-center"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative"
              onClick={(e) => e.stopPropagation()} // Prevents closing when clicking the image
            >
              <img
                src={user.profile_picture !== 'https://example.com/default-profile.png'  ? user.profile_picture : Pics.imagePlaceholder}
                alt="profile enlarged"
                className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-xl"
              />
              <button
                className="absolute -top-12 -right-12 p-2 text-white hover:text-gray-300 transition-colors"
                onClick={handleClose}
              >
                <X size={32} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileBody;