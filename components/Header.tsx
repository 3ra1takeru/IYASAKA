
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
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 sm:space-x-8">
            <button onClick={onHomeClick} className="text-xl sm:text-2xl font-bold text-green-700 flex items-center shrink-0">
              <span role="img" aria-label="leaf" className="mr-1 sm:mr-2">🌿</span>
              <span>IYASAKA</span>
            </button>
            <nav className="hidden md:flex items-center space-x-6">
                <button onClick={onHomeClick} className="text-stone-600 hover:text-green-700 font-medium transition-colors">イベントを探す</button>
                <button onClick={onServiceListClick} className="text-stone-600 hover:text-green-700 font-medium transition-colors">サービスを探す</button>
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <>
                <div className="hidden lg:flex items-center mr-2">
                   <UserCircleIcon className="w-6 h-6 text-stone-500 mr-2"/>
                   <span className="text-stone-700 font-medium truncate max-w-[150px]">{user.name}</span>
                </div>
                <button
                    onClick={onDashboardClick}
                    className="flex items-center justify-center bg-stone-100 text-stone-700 p-2 sm:px-3 sm:py-2 rounded-lg hover:bg-stone-200 transition-colors duration-200"
                    title="ダッシュボード"
                >
                    <DashboardIcon className="w-5 h-5 sm:mr-2" />
                    <span className="hidden sm:inline">ダッシュボード</span>
                </button>
                {(user.role === UserRole.ADMIN || user.role === UserRole.PROVIDER) && (
                  <>
                    <button
                        onClick={onCreateServiceClick}
                        className="flex items-center justify-center bg-blue-600 text-white p-2 sm:px-3 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        title="サービスを出品"
                    >
                        <BriefcaseIcon className="w-5 h-5 sm:mr-2" />
                        <span className="hidden sm:inline">サービスを出品</span>
                    </button>
                    <button
                        onClick={onCreateEventClick}
                        className="flex items-center justify-center bg-green-600 text-white p-2 sm:px-3 sm:py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                        title="イベント作成"
                    >
                        <PlusIcon className="w-5 h-5 sm:mr-2" />
                        <span className="hidden sm:inline">イベント作成</span>
                    </button>
                  </>
                )}
                <button
                  onClick={onLogoutClick}
                  className="flex items-center justify-center bg-stone-200 text-stone-800 p-2 sm:px-3 sm:py-2 rounded-lg hover:bg-stone-300 transition-colors duration-200"
                  title="ログアウト"
                >
                  <LogoutIcon className="w-5 h-5 sm:mr-2" />
                  <span className="hidden sm:inline">ログアウト</span>
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-green-600 text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
              >
                ログイン<span className="hidden sm:inline"> / 会員登録</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
