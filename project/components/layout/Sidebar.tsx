'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  FileText,
  Map,
  Settings,
  Users,
  ClipboardList,
  Shield,
  Activity,
  Database,
  Menu,
  X,
  Sprout
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  roles: string[];
}

const sidebarItems: SidebarItem[] = [
  // Gapoktan
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/gapoktan/dashboard', roles: ['gapoktan'] },
  { id: 'agenda', label: 'Agenda', icon: Calendar, href: '/gapoktan/agenda', roles: ['gapoktan'] },
  { id: 'laporan', label: 'Laporan', icon: FileText, href: '/gapoktan/laporan', roles: ['gapoktan'] },
  { id: 'pengaturan-akun', label: 'Pengaturan Akun', icon: Settings, href: '/gapoktan/pengaturan-akun', roles: ['gapoktan'] },
  { id: 'mari', label: 'MARI (AI Chatbot)', icon: Users, href: '/gapoktan/mari', roles: ['gapoktan'] },

  // Penyuluh
  { id: 'dashboard-penyuluh', label: 'Dashboard', icon: LayoutDashboard, href: '/penyuluh/dashboard', roles: ['penyuluh'] },
  { id: 'tugas', label: 'Tugas', icon: ClipboardList, href: '/penyuluh/tugas', roles: ['penyuluh'] },
  { id: 'laporan-penyuluh', label: 'Laporan', icon: FileText, href: '/penyuluh/laporan', roles: ['penyuluh'] },
  { id: 'mari-penyuluh', label: 'MARI (AI Chatbot)', icon: Users, href: '/penyuluh/mari', roles: ['penyuluh'] },
  { id: 'peta-lahan', label: 'Peta Lahan', icon: Map, href: '/penyuluh/peta-lahan', roles: ['penyuluh'] },
  { id: 'pengaturan-akun-penyuluh', label: 'Pengaturan Akun', icon: Settings, href: '/penyuluh/pengaturan-akun', roles: ['penyuluh'] },

  // Admin (jika ada, tambahkan sesuai kebutuhan)
  { id: 'dashboard-admin', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', roles: ['admin'] },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) return null;

  const role = (user as any)?.user_metadata?.role || user?.role;
  const userItems = sidebarItems.filter(item => item.roles.includes(role));

  return (
    <aside className={cn(
      "bg-white border-r border-earth-brown-200 transition-all duration-300 flex flex-col min-h-screen h-screen fixed top-0 left-0 z-30",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-earth-brown-200">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center gap-2", isCollapsed && "justify-center")}> 
            <Sprout className="h-8 w-8 text-earth-green-600" />
            {!isCollapsed && (
              <span className="font-bold text-xl text-earth-green-700">HarvestSun</span>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-earth-brown-100 rounded-md transition-colors"
          >
            {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-earth-brown-200">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}> 
          <div className="w-10 h-10 rounded-full bg-earth-green-100 flex items-center justify-center">
            <span className="text-earth-green-700 font-semibold text-sm">
              {(user?.name?.charAt(0) || user?.email?.charAt(0) || '?').toUpperCase()}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-earth-brown-800 truncate">{user.name || user.email || '-'}</p>
              <p className="text-sm text-earth-brown-600 capitalize">{(role || '').replace('_', ' ')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {userItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.id}>
                <button
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200",
                    isActive 
                      ? "bg-earth-green-500 text-white hover:bg-earth-green-600" 
                      : "text-earth-brown-700 hover:bg-earth-green-100 hover:text-earth-green-700",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isCollapsed ? "h-6 w-6" : "")}/>
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout sticky di bawah */}
      <div className="p-4 border-t border-earth-brown-200 sticky bottom-0 bg-white">
        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 text-red-600 hover:bg-red-50",
            isCollapsed && "justify-center px-2"
          )}
        >
          <Activity className={cn("h-5 w-5", isCollapsed ? "h-6 w-6" : "")}/>
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}