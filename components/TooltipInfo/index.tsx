import React, { useState } from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';

interface TooltipInfosProps {
  text: string;
}

const TooltipInfos: React.FC<TooltipInfosProps> = ({ text }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className="relative flex justify-center items-center p-1">
      <IoInformationCircleOutline
        size={16}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="text-gray-400 cursor-pointer"
      />
      {showTooltip && (
        <div className="absolute z-10 w-36 p-2 text-sm text-center text-white bg-gray-900 rounded-md top-full left-1/2 transform -translate-x-1/2">
          {text}
        </div>
      )}
    </div>
  );
};

export default TooltipInfos;
