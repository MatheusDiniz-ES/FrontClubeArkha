'use client'
import { useEffect, useState } from 'react'
import { useThemeStore } from "@/stores/theme"
import { BsMoon, BsSun } from 'react-icons/bs';
import { motion } from 'framer-motion';

export function ToggleDarkModeButton() {

  const darkModeContext = useThemeStore(state => state.darkMode)
  const setDarkModeContext = useThemeStore(state => state.setDarkMode)

  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = async () => {
    setDarkModeContext(!darkModeContext)
  };

  useEffect(() => {
    if(typeof window != 'undefined') {
      if(darkModeContext) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      setDarkMode(darkModeContext)
    }
  }, [typeof window, darkModeContext])

  return (
    <motion.button
      onClick={toggleDarkMode}
      className="flex text-[#BF9006] hover:text-cyan-800 dark:hover:text-cyan-400 items-center justify-center p-2 rounded-full"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: darkMode ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {darkMode ? <BsSun size={20} /> : <BsMoon size={20} />}
      </motion.div>
    </motion.button>
  )
}