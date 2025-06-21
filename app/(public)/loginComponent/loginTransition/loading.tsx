import { motion } from "framer-motion";
import logo from "../../../../public/Logo.svg";
import Lottie from "lottie-react";
import gif from "./waitingGif.json";
import Image from "next/image";

export default function Loading() {
  return (
    <>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed z-[100] top-0 right-0 bottom-0 left-0 flex flex-col gap-12 items-center justify-center bg-white bg-cover"
      >
        <div className="absolute top-0 bottom-0 right-0 left-0 opacity-95" />
        <Image
          src={logo}
          height={500}
          width={500}
          alt="Logo do sistema"
          className="w-[380px] sm:w-[473px] static z-10 object-cover"
        />
        <Lottie
          animationData={gif}
          className="w-8 md:w-12 lg:w-16 static z-10 text-gray-400"
          style={{ filter: "brightness(0.5)" }}
        />
      </motion.div>
    </>
  );
}
