
import React from 'react';
import { User, UserRole } from '../types';
import { PlusIcon, UserCircleIcon, DashboardIcon, BriefcaseIcon, LogoutIcon } from './icons';

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onCreateEventClick: () => void;
  onCreateServiceClick: () => void;
  onDashboardClick: () => void;
  onHomeClick: () => void;
  onServiceListClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onLogoutClick, onCreateEventClick, onCreateServiceClick, onDashboardClick, onHomeClick, onServiceListClick }) => {
  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-stone-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-2 sm:space-x-8">
            <button onClick={onHomeClick} className="group flex items-center shrink-0 transition-opacity hover:opacity-80">
              <span className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-widest font-serif">彌榮</span>
              <span className="ml-2 text-xs sm:text-sm text-stone-500 tracking-wider pt-2 block">- IYASAKA -</span>
            </button>
            <nav className="hidden md:flex items-center space-x-8">
                <button onClick={onHomeClick} className="text-stone-600 hover:text-stone-900 font-medium tracking-wide transition-colors relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-stone-800 after:transition-all hover:after:w-full">イベント・マルシェを探す</button>
                <button onClick={onServiceListClick} className="text-stone-600 hover:text-stone-900 font-medium tracking-wide transition-colors relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-stone-800 after:transition-all hover:after:w-full">サービスを探す</button>
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <>
                <div className="hidden lg:flex items-center mr-2 bg-stone-100 rounded-full px-4 py-1">
                   <UserCircleIcon className="w-5 h-5 text-stone-500 mr-2"/>
                   <span className="text-stone-700 font-medium truncate max-w-[150px] text-sm tracking-wide">{user.name} 様</span>
                </div>
                <button
                    onClick={onDashboardClick}
                    className="flex items-center justify-center text-stone-600 hover:text-stone-900 p-2 transition-colors duration-200"
                    title="マイページ"
                >
                    <DashboardIcon className="w-6 h-6" />
                </button>
                {(user.role === UserRole.ADMIN || user.role === UserRole.PROVIDER) && (
                  <>
                    <button
                        onClick={onCreateServiceClick}
                        className="flex items-center justify-center bg-indigo-800 text-white p-2 sm:px-4 sm:py-2 rounded shadow-sm hover:bg-indigo-900 transition-colors duration-200"
                        title="サービスを出品"
                    >
                        <BriefcaseIcon className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline text-sm tracking-wide">出品</span>
                    </button>
                    <button
                        onClick={onCreateEventClick}
                        className="flex items-center justify-center bg-teal-700 text-white p-2 sm:px-4 sm:py-2 rounded shadow-sm hover:bg-teal-800 transition-colors duration-200"
                        title="イベント作成"
                    >
                        <PlusIcon className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline text-sm tracking-wide">催し作成</span>
                    </button>
                  </>
                )}
                <button
                  onClick={onLogoutClick}
                  className="flex items-center justify-center text-stone-400 hover:text-red-700 p-2 transition-colors duration-200"
                  title="ログアウト"
                >
                  <LogoutIcon className="w-6 h-6" />
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-stone-800 text-white px-3 py-2 sm:px-5 rounded shadow-sm hover:bg-stone-700 transition-colors duration-200 text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap shrink-0"
              >
                <span className="inline sm:hidden">ログイン</span>
                <span className="hidden sm:inline">ログイン / 登録</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
