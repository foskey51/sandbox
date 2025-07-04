"use client";
import { cn } from "../lib/util";
import React, { useState, createContext, useContext } from "react";
import { IconMenu2, IconX, IconHome, IconSettings, IconUser, IconCode, IconFileTypeHtml, IconBox } from "@tabler/icons-react";

const sidebarMenuItems = [
  { icon: <IconHome size={20} />, label: "Dashboard", href: "/dashboard" },
  { icon: <IconUser size={20} />, label: "Profile", href: "/profile" },
  { icon: <IconSettings size={20} />, label: "Settings", href: "/settings" },
  { icon: <IconCode size={20} />, label: "Online Compiler", href: "/online-compiler" },
  { icon: <IconFileTypeHtml size={20} />, label: "WebDev Playground", href: "/webdev-playground" },
  { icon: <IconBox size={20} />, label: "Virtual Box", href: "/virtual-box" }
];

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
}) => (
  <SidebarProvider open={open} setOpen={setOpen}>
    {children}
  </SidebarProvider>
);

const SidebarContent = ({ className }) => {
  const { open } = useSidebar();
  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Menu title */}
      <div className="flex flex-col dark:text-white text-lg font-bold py-4">
        {open ? (
          <div className="flex flex-col items-center justify-center text-center leading-loose tracking-wider">
            Menu
            <div className="w-[50%] h-0.5 bg-neutral-500 dark:bg-gray-400 mt-1" />
          </div>
        ) : (
          <div className="flex flex-col pt-2 items-center justify-center">
            <span className="text-center dark:text-white text-lg">S</span>
            <div className="w-4 h-0.5 bg-neutral-500 dark:bg-gray-400 mt-1" />
          </div>
        )}
      </div>

      {/* Links */}
      <div className="flex flex-col gap-2 flex-grow">
        {sidebarMenuItems.map((link) => (
          <SidebarLink key={link.href} link={link} />
        ))}
      </div>

      {/* Profile section */}
      <div className="mt-auto flex items-center gap-2 py-2">
        <IconUser size={20} className="text-neutral-700 dark:text-neutral-200" />
        {open && (
          <span className="text-sm text-neutral-700 dark:text-neutral-200 pl-2">
            John Doe
          </span>
        )}
      </div>
    </div>
  );
};

export const DesktopSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();

  return (
    <div className="flex h-screen w-screen">
      <div
        className={cn(
          "px-4 py-3 hidden md:flex md:flex-col bg-neutral-100 dark:bg-black shrink-0 transition-all duration-200 ease-in-out",
          className
        )}
        style={{ width: open ? "250px" : "60px" }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        <SidebarContent />
      </div>
      <div className="flex overflow-hidden flex-grow">{children}</div>
    </div>
  );
};

export const MobileSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();

  return (
    <>
      <div
        className="h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full"
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <IconMenu2
            className="text-neutral-800 dark:text-neutral-200"
            onClick={() => setOpen(!open)}
          />
        </div>
        {open && (
          <div
            className={cn(
              "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col",
              className
            )}
          >
            <div
              className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
              onClick={() => setOpen(false)}
            >
              <IconX />
            </div>

            <SidebarContent />

            <div className="flex overflow-hidden flex-grow">{children}</div>
          </div>
        )}
      </div>
    </>
  );
};

export const SidebarBody = (props) => (
  <>
    <DesktopSidebar {...props} />
    <MobileSidebar {...props} />
  </>
);

export const SidebarLink = ({ link, className, ...props }) => {
  const { open } = useSidebar();

  return (
    <a
      href={link.href}
      className={cn(
        "flex items-center gap-2 py-2 text-neutral-700 dark:text-neutral-200 text-sm transition-[padding] duration-150 ease-in-out pr-0 hover:pl-3",
        open ? "justify-start pl-2" : "justify-center",
        className
      )}
      {...props}
    >
      {link.icon}
      {open && <span className="whitespace-pre">{link.label}</span>}
    </a>
  );
};

