"use client";
import React, { useEffect, useState } from "react";
import { cn } from "../lib/util";
import {
  IconMenu2,
  IconX,
  IconHome,
  IconSettings,
  IconUser,
  IconCode,
  IconFileTypeHtml,
} from "@tabler/icons-react";
import useStore from '../../store';
import api from "../utils/api";

const sidebarMenuItems = [
  { icon: <IconHome size={20} />, label: "Dashboard", href: "/dashboard" },
  { icon: <IconCode size={20} />, label: "Online Compiler", href: "/online-compiler" },
  { icon: <IconFileTypeHtml size={20} />, label: "WebDev Playground", href: "/webdev-playground" },
  { icon: <IconUser size={20} />, label: "Profile", href: "/profile" },
  { icon: <IconSettings size={20} />, label: "Settings", href: "/settings" },
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

const SidebarContent = ({ isOpen, profile }) => (
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
    <div className="mt-auto">

      {/* Separator line */}
      <div className="border-t border-2 border-gray-300 dark:bordemy-2"></div>

      {/* Profile section */}
      <div
        className={cn(
          "flex items-center py-2 px-2 transition-all",
          isOpen ? "justify-start gap-4 mb-1" : "mb-2 flex w-full px-0"
        )}
      >
        <img
          src={profile?.profileImage || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png'}
          alt="Profile"
          className={cn(
            "w-12 h-12 rounded-full object-cover flex",
            isOpen ? "mt-1" : "max-w-full"
          )}
          onError={(e) => {
            e.target.src = 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png';
          }}
        />
        {isOpen && (
          <span className="text-lg leading-20 font-mono font-semibold text-neutral-700 dark:text-neutral-200 truncate">
            {profile?.fullName.toUpperCase() || "----"}
          </span>
        )}
      </div>
    </div>

  </div>
);

export const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profile = useStore(state => state.profileData);
  const { setProfileData } = useStore();

  useEffect(() => {
    const isValidBase64 = (str) => {
      if (!str || typeof str !== 'string') return false;
      try {
        // Remove data URL prefix if present
        const base64Str = str.startsWith('data:image') ? str.split(',')[1] : str;
        // Check if string is valid Base64
        return /^[A-Za-z0-9+/=]+$/.test(base64Str) && base64Str.length % 4 === 0;
      } catch {
        return false;
      }
    };

    const formatImageUrl = (base64Str, mimeType = 'image/jpeg') => {
      if (!base64Str) return null;
      // If already a data URL, return it
      if (base64Str.startsWith('data:image')) return base64Str;
      // Otherwise, add data URL prefix
      return isValidBase64(base64Str) ? `data:${mimeType};base64,${base64Str}` : null;
    };

    if (profile === null) {
      api
        .get(`/api/v1/profile`)
        .then((res) => {
          setProfileData({
            ...res.data,
            profileImage: formatImageUrl(res.data.profileImage, 'image/jpeg'),
          });
        })
        .catch((err) => {
          const status = err?.response?.status;

          if (status === 404) {
            const defaultProfile = {
              fullName: err.response.data.fullName || '----',
              email: err.response.data.email || '----',
              bio: err.response.data.bio || '',
              username: err.response.data.username || 'newuser',
              profileImage: null,
            };

            setProfileData(defaultProfile);

          } else {
            console.error('Fetch error:', err);
          }
        })
    }
  }, []);

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
          <SidebarContent isOpen={open} profile={profile} />
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
          <SidebarContent isOpen={true} profile={profile} />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
