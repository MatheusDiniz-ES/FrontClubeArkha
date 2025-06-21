'use client'
import { useEffect, useState } from 'react'
import { BsFullscreen, BsFullscreenExit } from 'react-icons/bs';
import { motion } from 'framer-motion';

export function ToggleFullScreenModeButton() {

    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };
  
      document.addEventListener('fullscreenchange', handleFullscreenChange);
  
      return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
      };
    }, []);
  
    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
          .catch((err) => console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
      } else {
        document.exitFullscreen()
          .catch((err) => console.error(`Error attempting to disable full-screen mode: ${err.message} (${err.name})`));
      }
    };

  return (
    <motion.button
      onClick={toggleFullscreen}
      className="hidden lg:flex text-[#BF9006] hover:text-cyan-800 dark:hover:text-cyan-400 items-center justify-center p-2 rounded-full"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: isFullscreen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        { isFullscreen ?  <BsFullscreenExit size={20} /> : <BsFullscreen size={20} /> }
      </motion.div>
    </motion.button>
  )
}