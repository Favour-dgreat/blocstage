"use client";

import { CalendarDays, Settings, UserPen, Trophy, Ticket } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from "next/image";

const menuItems = [
  { icon: CalendarDays, title: 'Events', active: true },
  { icon: Trophy, title: 'Rewards' },
  { icon: Ticket, title: 'Raffle Draws' },
];

const sectionItems = [
  { icon: Settings, title: 'Settings' },
  { icon: UserPen, title: 'Edit Profile' },
];
export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col justify-between z-50">
      {/* Top Section */}
      <div className="px-6 py-8 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-12">
          <Image
            className="justify-center items-center"
            src="/images/sidebarlogo.png"
            alt="blocStage"
            width={120}
            height={32}
          />
        </div>

        {/* Menu Items */}
        <nav className="space-y-1 border-b border-gray-200 pb-4 mb-6">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className={`flex items-center justify-between px-3 py-4 rounded-lg cursor-pointer transition-colors ${
                  item.active
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {IconComponent && <IconComponent className="w-5 h-5" />}
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
              </div>
            );
          })}
        </nav>

        {/* More Section */}
        <div className="mt-80">
          <span className="text-xs font-medium text-[#98A2B3] tracking-wider block mb-4">
            More
          </span>
          <nav className="space-y-1 mb-8">
            {sectionItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between px-3 py-4 rounded-lg cursor-pointer font-light text-[#282828] hover:bg-gray-50' transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {IconComponent && <IconComponent className="w-5 h-5 text-[#282828]" />}
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom User Profile */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex flex-row items-center gap-3 p-2 rounded-lg cursor-pointer">
          <Avatar className="w-10 h-10">
            <AvatarImage src="./images/Avatars.png" />
            <AvatarFallback>AE</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Alison Eyo</p>
            <p className="text-xs text-gray-500 truncate">alison.e@rayna.ui</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
