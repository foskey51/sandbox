"use client";
import React, { useState } from "react";
import { cn } from "../lib/util";
import {
  IconMenu2,
  IconX,
  IconHome,
  IconSettings,
  IconUser,
  IconCode,
  IconFileTypeHtml,
  IconBox,
} from "@tabler/icons-react";

const sidebarMenuItems = [
  { icon: <IconHome size={20} />, label: "Dashboard", href: "/dashboard" },
  { icon: <IconUser size={20} />, label: "Profile", href: "/profile" },
  { icon: <IconSettings size={20} />, label: "Settings", href: "/settings" },
  { icon: <IconCode size={20} />, label: "Online Compiler", href: "/online-compiler" },
  { icon: <IconFileTypeHtml size={20} />, label: "WebDev Playground", href: "/webdev-playground" },
  { icon: <IconBox size={20} />, label: "Virtual Box", href: "/virtual-box" },
];

const SidebarLink = ({ link, isOpen }) => (
  <a
    href={link.href}
    className={cn(
      "flex items-center gap-2 py-2 text-neutral-700 dark:text-neutral-200 text-sm transition-[padding] duration-150 ease-in-out pr-0 hover:pl-3",
      isOpen ? "justify-start pl-2" : "justify-center"
    )}
  >
    {link.icon}
    {isOpen && <span className="whitespace-pre">{link.label}</span>}
  </a>
);

const SidebarContent = ({ isOpen }) => (
  <div className="flex flex-col h-full overflow-auto">
    {/* Header */}
    <div className="flex flex-col dark:text-white text-lg font-bold py-4">
      {isOpen ? (
        <div className="flex flex-col items-center text-center tracking-wider">
          Menu
          <div className="w-[50%] h-0.5 bg-neutral-500 dark:bg-gray-400 mt-1" />
        </div>
      ) : (
        <div className="flex flex-col pt-2 items-center">
          <span className="text-lg">S</span>
          <div className="w-4 h-0.5 bg-neutral-500 dark:bg-gray-400 mt-1" />
        </div>
      )}
    </div>

    {/* Menu Items */}
    <div className="flex flex-col gap-2 flex-grow">
      {sidebarMenuItems.map((link) => (
        <SidebarLink key={link.href} link={link} isOpen={isOpen} />
      ))}
    </div>

    {/* Footer */}
    <div className="mt-auto flex items-center gap-2 py-2">
      <IconUser size={20} className="text-neutral-700 dark:text-neutral-200" />
      {isOpen && <span className="text-sm text-neutral-700 dark:text-neutral-200">John Doe</span>}
    </div>
  </div>
);

export const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full">
        <div
          className={cn(
            "px-4 py-3 flex flex-col bg-neutral-100 dark:bg-black transition-all duration-200 ease-in-out"
          )}
          style={{ width: open ? "250px" : "60px" }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <SidebarContent isOpen={open} />
        </div>
      </div>

      {/* Mobile Header and Sidebar */}
      <div className="md:hidden">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 h-14 px-4 py-4 flex items-center justify-between bg-neutral-100 dark:bg-neutral-800 z-50">
          <span className="text-neutral-800 dark:text-neutral-200 font-semibold">Sandbox</span>
          <IconMenu2
            onClick={() => setMobileOpen(true)}
            className="cursor-pointer text-neutral-800 dark:text-neutral-200"
          />
        </div>

        {/* Mobile Sidebar Panel */}
        <div
          className={cn(
            "fixed top-0 left-0 h-full bg-white dark:bg-neutral-900 z-[100] transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
          style={{ width: "250px" }}
        >
          <div
            className="absolute right-4 top-4 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer"
            onClick={() => setMobileOpen(false)}
          >
            <IconX />
          </div>
          <SidebarContent isOpen={true} />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
