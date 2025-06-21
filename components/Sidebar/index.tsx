"use client";

import { useSidebarStorage } from "@/stores/sidebarStore";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { TfiAnnouncement } from "react-icons/tfi";
import logo from "../../public/Logo.svg";
import { motion } from 'framer-motion';
import {
  MdKeyboardArrowLeft,
  MdLocalPostOffice,
  MdOutlineArchitecture,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdPrivacyTip
} from "react-icons/md";
import TooltipInfos from "../TooltipInfo";
import Image from "next/image";
import { Group, Settings, User } from "lucide-react";
import { FaShoppingCart } from "react-icons/fa";
import { GrUserPolice } from "react-icons/gr";
import { BsHouse } from "react-icons/bs";
import { BiHome } from "react-icons/bi";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface NavItem {
  name: string;
  href?: string;
  icon: any;
  current: boolean;
  desc?: string;
  items?: NavItem[];
}

export default function Sidebar() {
  const pathName = usePathname();
  const setIsOpen = useSidebarStorage((e: any) => e.setIsOpen);
  const [permUser, setPermUser] = useState([]);
  const [area, setArea] = useState("");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const userInfos = localStorage.getItem("user-storage");

    if (userInfos) {
      const parsedUserInfos = JSON.parse(userInfos);
      const areaStore = parsedUserInfos.state.user?.area || '';
      setArea(areaStore?.toLowerCase());
      setPermUser(parsedUserInfos.state.user.funcionalidades);
    }
  }, []);

  useEffect(() => {
    setIsOpen(sidebarOpen);
  }, [sidebarOpen]);

  const toggleItem = (name: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const navigation = {
    "backoffice": [
      {
        name: "Pagina Inicial",
        href: "/backoffice/home",
        icon: BiHome,
        current: pathName.includes("/backoffice/home"),
      },
      {
        name: "Usuários Administrativos",
        href: "/backoffice/usuarios",
        icon: User,
        current: pathName.includes("/backoffice/usuarios"),
        desc: "Aqui você poderá criar e editar um usuário.",
      },
      {
        name: "Arquiteto",
        href: "/backoffice/arquitetos",
        icon: MdOutlineArchitecture,
        current: pathName.includes("/backoffice/arquitetos"),
        desc: "Aqui você poderá criar e editar um arquiteto.",
      },
      {
        name: "Lojistas",
        href: "/backoffice/lojistas",
        icon: FaShoppingCart,
        current: pathName.includes("/backoffice/lojistas"),
        desc: "Aqui você poderá criar e editar um lojista.",
      },
      {
        name: "Prêmios",
        href: "/backoffice/promocoes",
        icon: TfiAnnouncement,
        current: pathName.includes("/backoffice/promocoes"),
        desc: "Aqui você poderá criar e editar um Prêmio.",
      },
      {
        name: "Configuração",
        icon: Settings,
        current: pathName.includes("/backoffice/grupo") && 
                pathName.includes("/backoffice/politica-privacidade"),
        items: [
          {
            name: "Grupo",
            href: "/backoffice/grupo",
            icon: Group,
            current: pathName.includes("/backoffice/grupo"),
          },
          {
            name: "Políticas de privacidade",
            href: "/backoffice/politica-privacidade",
            icon: MdPrivacyTip,
            current: pathName.includes("/backoffice/politica-privacidade"),
          }
        ],
      },
    ],
    "lojista": [
      {
        name: "Dashboard",
        href: "/lojista/dashboard",
        icon: MdOutlineArchitecture,
        current: pathName.includes("/lojista/dashboard"),
        desc: "Aqui você poderá ver sua Dashboard",
      },
      {
        name: "Usuários Administrativos",
        href: "/lojista/usuarios",
        icon: User,
        current: pathName.includes("/lojista/usuarios"),
        desc: "Aqui você poderá criar e editar um usuário.",
      },
      {
        name: "Pontuação",
        href: "/lojista/pontuacao",
        icon: FaShoppingCart,
        current: pathName.includes("/lojista/pontuacao"),
        desc: "Aqui você poderá atribuir uma pontuação",
      },
    ]
  };

  const renderNavItem = (item: NavItem) => {
    if (item.items) {
      // This is a parent item with subitems
      const isExpanded = expandedItems[item.name] || item.current;
      
      return (
        <div key={item.name} className="space-y-1">
          <button
            onClick={() => toggleItem(item.name)}
            className={classNames(
              item.current
                ? "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-600",
              "group w-full flex items-center justify-between px-3 py-4 text-sm font-medium rounded-md transition-colors duration-200"
            )}
          >
            <div className="flex items-center">
              <item.icon
                className={`mr-3 flex-shrink-0 h-6 w-6 ${
                  !item.current && "text-gray-400"
                }`}
                aria-hidden="true"
              />
              {item.name}
            </div>
            {isExpanded ? (
              <MdKeyboardArrowUp className="h-5 w-5" />
            ) : (
              <MdKeyboardArrowDown className="h-5 w-5" />
            )}
          </button>
          
          <Transition
            show={isExpanded}
            enter="transition-all duration-200 ease-in-out"
            enterFrom="opacity-0 max-h-0"
            enterTo="opacity-100 max-h-96"
            leave="transition-all duration-200 ease-in-out"
            leaveFrom="opacity-100 max-h-96"
            leaveTo="opacity-0 max-h-0"
            className="space-y-1 overflow-hidden"
          >
            {item.items.map((subItem) => (
              <Link
                key={subItem.name}
                href={subItem.href || '#'}
                className={classNames(
                  subItem.current
                    ? "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-600",
                  "group flex items-center px-3 py-4 text-sm font-medium rounded-md transition-colors duration-200"
                )}
              >
                <subItem.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    !subItem.current && "text-gray-400"
                  }`}
                  aria-hidden="true"
                />
                {subItem.name}
              </Link>
            ))}
          </Transition>
        </div>
      );
    } else {
      // Regular item without subitems
      return (
        <Link
          key={item.name}
          href={item.href || '#'}
          className={classNames(
            item.current
              ? "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-600",
            "group flex items-center px-3 py-4 text-sm font-medium rounded-md transition-colors duration-200"
          )}
        >
          <item.icon
            className={`mr-3 flex-shrink-0 h-6 w-6 ${
              !item.current && "text-gray-400"
            }`}
            aria-hidden="true"
          />
          {item.name}
          {item.desc && <TooltipInfos text={item.desc} />}
        </Link>
      );
    }
  };

  return (
    <>
      <div>
        <Transition
          show={sidebarOpen}
          enter="transition-opacity duration-1000"
          enterFrom="opacity-100"
          enterTo="opacity-100"
          leave="transition-opacity duration-1000"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Transition
            show={sidebarOpen}
            enter="transition-opacity duration-1000"
            enterFrom="opacity-100"
            enterTo="opacity-100"
            leave="transition-opacity duration-1000"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              onClick={() => setSidebarOpen(false)}
              className="fixed z-50 lg:hidden bg-gray-950 bg-opacity-60 top-0 bottom-0 left-0 right-0"
            />
          </Transition>
          <div className="z-[60] lg:z-0 flex w-64 flex-col fixed inset-y-0">
            <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-750 border-r border-gray-100 dark:border-gray-600">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="items-center justify-center flex-shrink-0 px-4 flex">
                  <Image
                    className="mx-auto w-[300px] transition-all duration-200"
                    src={logo}
                    width={200}
                    style={{ width: '200px' }}
                    alt="Logo do sistema"
                  />
                </div>

                <nav className="mt-5 flex-1 px-2 space-y-1">
                  {area === "backoffice" &&
                    navigation.backoffice.map((item: NavItem) => renderNavItem(item))}
                  {area === "lojista" && 
                    navigation.lojista.map((item: NavItem) => renderNavItem(item))}
                </nav>
              </div>
            </div>
          </div>
        </Transition>
        <div
          className={clsx("flex flex-col flex-1 transition-all duration-1000", {
            "lg:pl-64": sidebarOpen,
          })}
        >
          <div className="absolute top-0 pl-3 pt-3 flex">
            <motion.button
              whileHover={{scale: 1.2}}
              type="button"
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-300 hover:text-gray-700 dark:hover:text-gray-500"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="sr-only">Toggle sidebar</span>
              <MdKeyboardArrowLeft
                className={clsx("w-6 h-6 transition-all", {
                  "rotate-180": !sidebarOpen,
                })}
              />
            </motion.button>
            <div className="items-center justify-center h-12 flex-shrink-0 px-4 hidden md:flex">
              {/* Optional logo can go here */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}