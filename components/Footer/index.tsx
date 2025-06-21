"use client";
import { useSidebarStorage } from "@/stores/sidebarStore";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import logo from "../../public/logo.jpg";
import Image from "next/image";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Footer() {
  const pathName = usePathname();
  const setIsOpen = useSidebarStorage((e: any) => e.setIsOpen);
  const [permUser, setPermUser] = useState([]);

  useEffect(() => {
    const userInfos = localStorage.getItem("user-storage");

    if (userInfos) {
      const parsedUserInfos = JSON.parse(userInfos);
      setPermUser(parsedUserInfos.state.user.funcionalidades);
    } else {
      console.log("No user information found in localStorage");
    }
  }, []);


  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setIsOpen(sidebarOpen);
  }, [sidebarOpen]);
  return (
    <>
      <footer>
        <Transition
          show={sidebarOpen}
          enter="transition-opacity duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Transition
            show={sidebarOpen}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              onClick={() => setSidebarOpen(false)}
              className="fixed z-50 lg:hidden bg-white bg-opacity-60"
            />
          </Transition>
        </Transition>
        <div
          className={clsx(" w-full transition-all duration-300", {
            "": sidebarOpen,
          })}
        >
          <div className="flex pt-2 bg-white dark:bg-gray-750 border-r border-gray-100 dark:border-gray-600">
            <div className="items-center justify-between h-12 flex w-full">
                {/* <Image
                  className="transition-all pl-3 duration-200"
                  src={logo}
                  width={200}
                  style={{width: '200px'}}
                  alt="Logo do sistema"
                /> */}
            </div>
            <div className="flex justify-center items-center">
                <p className="text-xs text-center text-gray-400">
                  Texto Footer
                </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
