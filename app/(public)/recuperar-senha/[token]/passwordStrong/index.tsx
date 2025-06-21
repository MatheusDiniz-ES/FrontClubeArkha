'use client'
import { motion } from "framer-motion";
import { Transition } from "@headlessui/react";
import { IoMdClose } from 'react-icons/io'
import { MdCheck } from "react-icons/md";

interface LabelStrongProps {
  isUsing: boolean
  text: string
}

const LabelStrong = ({
  isUsing = false,
  text = ''
}: LabelStrongProps) => {

  return (
    <div className="flex items-center gap-2 text-gray-500">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: !isUsing ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isUsing ? <MdCheck className="w-6 h-6 text-cyan-500" /> : <IoMdClose className="w-6 h-6" />}
      </motion.div>
      {text}
    </div>
  );
};

export default LabelStrong;
