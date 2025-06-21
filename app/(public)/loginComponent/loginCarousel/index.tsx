"use client";
import Image from "next/image";
import image1 from "../../../../public/Login/padronizacao_processo.png";
import image2 from "../../../../public/Login/reducao_acidentes.png";
import image3 from "../../../../public/Login/aumento_confiabilidade.png";
import clsx from "clsx";
import { useEffect, useState } from "react";

export function Carousel() {
  const slides = [

    {
      url: image1.src,
      title: "",
      subtitle:
        "",
    },
    {
      url: image2.src,
      title: "",
      subtitle:
        "",
    },
    {
      url: image3.src,
      title: "",
      subtitle:
        "",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex(currentIndex + 1 == slides.length ? 0 : currentIndex + 1);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [currentIndex]);

  return (
    <>
      <div className="static z-10 flex flex-col gap-4 items-center justify-center">
        <Image
          alt="Imagem do carrosel"
          width={900}
          height={900}
          src={slides[currentIndex].url}
          className="mx-auto w-[300px] tall:w-[230px] object-cover transition-all duration-200"
        />
        <h1 className="text-white w-full text-center transition-all duration-200 font-semibold text-2xl lg:text-3xl 2xl:text-4xl">
          {slides[currentIndex].title}
        </h1>
        <p className="text-white w-full transition-all duration-200 text-center font-normal text-base">
          {slides[currentIndex].subtitle}
        </p>
      </div>
      <div className="static z-10 flex mt-4 gap-4 justify-center py-2">
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={clsx(
              "h-4 w-4 bg-cyan-100 rounded-full cursor-pointer transition-all duration-200",
              {
                "!w-12 !bg-white !cursor-default": currentIndex == slideIndex,
              }
            )}
          ></div>
        ))}
      </div>
    </>
  );
}
