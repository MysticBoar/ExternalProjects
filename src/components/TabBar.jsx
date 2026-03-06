// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Home, FileText, DollarSign, User, Shield, Settings } from 'lucide-react';

export function TabBar({
  activePage,
  onPageChange,
  className
}) {
  const menuItems = [{
    id: 'home',
    label: '首页',
    icon: Home
  }, {
    id: 'publish',
    label: '发布',
    icon: FileText
  }, {
    id: 'match',
    label: '匹配',
    icon: DollarSign
  }, {
    id: 'creditProfile',
    label: '信用档案',
    icon: Shield
  }, {
    id: 'adminDashboard',
    label: '管理',
    icon: Settings
  }, {
    id: 'profile',
    label: '我的',
    icon: User
  }];
  return <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 ${className || ''}`}>
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return <button key={item.id} onClick={() => onPageChange && onPageChange(item.id)} className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? 'text-[#0D47A1] bg-blue-50' : 'text-gray-500 hover:text-gray-700'}`}>
                <Icon size={24} className={isActive ? 'text-[#0D47A1]' : 'text-gray-500'} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>;
        })}
        </div>
      </div>
    </div>;
}
export default TabBar;