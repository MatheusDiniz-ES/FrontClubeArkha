"use client";
import { Title } from "@/components/Title";
import { Subtitle } from "@/components/Subtitle";
import { LoginForm } from "./loginComponent/loginForm";
import { Carousel } from "./loginComponent/loginCarousel";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { changeColor } from "@/lib/utils";
import Loading from "./loginComponent/loginTransition/loading";
import logo from '../../public/Logo.svg'

export default function Home() {
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    if (typeof window != "undefined") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("cyan");
      changeColor("cyan");
    }
  }, [typeof window]);

  return (
    <>
      <div className=" absolute w-full h-full bg-center top-0 left-0 flex items-center justify-center">
        <div className="absolute bg-logo-clube  bg-center bg-no-repeat w-[400px] h-[400px] flex justify-center items-center" />
      </div>
     <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex w-screen min-h-screen items-center"
      >
        {/* Container geral */}
        <div className="flex w-full h-full items-center">
          
          {/* Lado do login */}
          <div className="flex justify-center w-full md:w-1/2 h-full md:bg-white items-center">
            <div className="flex flex-col w-[90%] max-w-[500px] bg-white md:bg-transparent rounded shadow-lg md:shadow-none md:rounded-none p-8 md:p-16 gap-8 h-auto md:h-screen justify-center">
              <Image
                className="w-[300px] mx-auto"
                src={logo}
                width={500}
                height={500}
                alt="Logo do sistema"
              />
              <div className="flex flex-col gap-2">
                <Title bold="800">Seja bem-vindo!</Title>
                <Subtitle>Insira suas credenciais e acesse a plataforma.</Subtitle>
              </div>
              <LoginForm setLogged={setLogged} />
            </div>
          </div>

          <div className="relative hidden md:block w-1/2 h-screen">
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
              <div className="w-full h-full bg-initial-image bg-cover bg-center relative z-0 flex flex-col items-center justify-center">
                {/* <Carousel /> */};
              </div>
            </div>
        </div>

        {logged && <Loading />}
      </motion.div>

    </>
  );
}
