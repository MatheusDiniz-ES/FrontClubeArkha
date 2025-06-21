"use client";

import { Header } from "@/components/Header";
import { Divisor } from "@/components/Divisor";
import { BsHouse } from "react-icons/bs";
import Lottie from "lottie-react";
import { motion } from "motion/react"
import animation from "../../../../public/animation/page-Initial.json"

const fadeInUp = {
  initial: { opacity: 0, x: -90 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};




export default function Home() {

  return (
    <main className="flex flex-col gap-4 items-center">
      <Header
        title={{
          children: "Pagina Inicial",
        }}
        icon={<BsHouse className="w-6 h-6" />}
      />
      <Divisor/>

      <motion.div
         animate={fadeInUp.animate}
         initial={fadeInUp.initial}
         transition={fadeInUp.transition} className="w-full h-full items-center justify-center flex flex-col mt-8">
        <div className="flex justify-center items-center">
          <Lottie 
            autoPlay={true}
            animationData={animation}
            loop={true}
            className="w-[450px]"
          />
        </div>
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl font-extrabold">Seja Bem Vindo(a) à <span className="font-black text-[#C0A300]">ClubeArkha</span>.</h1>
            <p className="text-lg font-bold">Interaja com o meu menu para começar</p>
        </div>
      </motion.div>

    </main>
  );
}
