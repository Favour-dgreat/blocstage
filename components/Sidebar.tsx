"use client";

import { Hash, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from "next/image";
import { LogOut } from 'lucide-react';

const menuItems = [
  { title: 'Events', count: 10, active: true },
  { title: 'Menu title', count: 10 },
  { title: 'Menu title', count: 10 },
  { title: 'Menu title', count: 10 },
  { title: 'Menu title', count: 10 },
];

const sectionItems = [
  { title: 'Menu title', count: 10 },
  { title: 'Menu title', count: 10 },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 px-6 py-8">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-12">
       <Image className="justify-center items-center"
                             src="/images/sidebarlogo.png"
                             alt="blocStage"
                             width={120}
                             height={32}
                             />
      </div>

      {/* Menu Items */}
      <nav className="space-y-1">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
              item.active 
                ? 'bg-orange-50 text-orange-600' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Hash className="w-4 h-4" />
              <span className="text-sm font-medium">{item.title}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              item.active ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
            }`}>
              {item.count}
            </span>
          </div>
        ))}
      </nav>

      {/* Section Title */}
      <div className="mt-8 mb-4">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Section Title
        </span>
      </div>

      {/* Section Items */}
      <nav className="space-y-1">
        {sectionItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Hash className="w-4 h-4" />
              <span className="text-sm font-medium">{item.title}</span>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">
              {item.count}
            </span>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-10 left-6 right-6">
        <div className="flex flex-row items-center gap-3 p-3 rounded-lg  cursor-pointer">
          <Avatar className="w-8 h-8">
            <AvatarImage src="./images/Avatars.png" />
            <AvatarFallback>AE</AvatarFallback>
          </Avatar>
          <div className="flex-2 min-w-0 max-w-md gap-4">
            <p className="text-sm font-medium text-gray-900 truncate">Alison Eyo</p>
            <p className="text-xs text-gray-500 truncate">alison.e@rayna.ui</p>
          </div>
          <div className="flex gap-2">
            <LogOut className="w-6 h-6 text-black hover:text-black transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}