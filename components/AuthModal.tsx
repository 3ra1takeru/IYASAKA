
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import Modal from './Modal';
import { UserCircleIcon, ChatBubbleIcon } from './icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  // onLineLogin is still passed but we might handle the redirect directly here for the real flow
  onLineLogin: (user: User) => void;
  users: User[];
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onLineLogin, users }) => {
  const [showDemoUserSelection, setShowDemoUserSelection] = useState(false);
  const [currentRedirectUri, setCurrentRedirectUri] = useState('');

  // 現在のURL（クエリパラメータなどを除く）を取得するヘルパー関数
  const getRedirectUri = () => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    // origin (https://example.com) + pathname (/iyasaka/) を結合
    // 末尾のスラッシュの有無も現在のブラウザ表示に従うため、登録と一致させやすい
    return `${url.origin}${url.pathname}`;
  };

  // Reset internal state when modal is closed/reopened
  useEffect(() => {
    if (!isOpen) {
      setShowDemoUserSelection(false);
    }
    // クライアントサイドでのみ実行
    setCurrentRedirectUri(getRedirectUri());
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleRealLineLoginRedirect = () => {
    // 実際のアプリでは環境変数などからクライアントIDを取得します
    const LINE_CLIENT_ID = '2008776261'; // 設定されたチャネルID
    const REDIRECT_URI = getRedirectUri(); // 動的に取得したリダイレクトURI
    const state = Math.random().toString(36).substring(7); // CSRF対策のランダムな文字列

    // bot_prompt=normal を追加することで、ログイン時に公式アカウントの友だち追加を促します。
    // これにより、予約完了通知やリマインド通知を送る許可を得やすくなります。
    const authUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LINE_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}&scope=profile%20openid&bot_prompt=normal`;
    
    // リダイレクト実行
    window.location.href = authUrl;
  };

  if (showDemoUserSelection) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="デモユーザー選択">
        <div className="space-y-4">
          <p className="text-sm text-stone-600 mb-2">ログインするデモアカウントを選択してください。</p>
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => {
                onLineLogin(user);
                onClose();
              }}
              className="w-full flex items-center text-left p-3 rounded-lg border border-stone-200 hover:bg-stone-100 hover:border-green-500 transition-all duration-200"
            >
              <UserCircleIcon className="w-8 h-8 text-green-600 mr-3 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-base text-stone-800 truncate">{user.name}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-stone-500 uppercase">{user.role}</p>
                  {user.instagramId && <p className="text-xs text-stone-400 truncate">@{user.instagramId}</p>}
                </div>
              </div>
            </button>
          ))}
          <button onClick={() => setShowDemoUserSelection(false)} className="w-full mt-4 bg-stone-200 text-stone-800 py-2 rounded hover:bg-stone-300 transition-colors">
            戻る
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="ログイン">
      <div className="space-y-6">
        <div>
            <button
                onClick={handleRealLineLoginRedirect}
                className="w-full flex items-center justify-center p-3 rounded-lg bg-[#06C755] text-white hover:bg-[#05b34c] transition-colors duration-200 shadow-sm"
            >
                <ChatBubbleIcon className="w-6 h-6 mr-3"/>
                <span className="font-bold text-lg">LINEでログイン</span>
            </button>
            <p className="text-xs text-center text-stone-400 mt-2">
                公式アカウントと連携し、予約完了通知やリマインドを受け取ることができます。
            </p>
        </div>

        {/* 開発者向けヘルプメッセージ: 400エラー対策 */}
        <div className="bg-stone-100 p-3 rounded-md text-xs text-stone-600 border border-stone-200">
            <p className="font-bold text-stone-700 mb-1 flex items-center">
                <span className="mr-1">⚠️</span> 400エラーが出る場合
            </p>
            <p className="mb-2 leading-relaxed">
                LINE Developersコンソールの「LINEログイン設定」＞「コールバックURL」に、以下のURLを<b>正確に</b>追加登録してください。<br/>
                （末尾のスラッシュの有無も一致させる必要があります）
            </p>
            <div className="bg-white p-2 rounded border border-stone-300 break-all font-mono select-all">
                {currentRedirectUri}
            </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#faf9f6] text-stone-500">デモ環境用</span>
          </div>
        </div>
        
        <button
            onClick={() => setShowDemoUserSelection(true)}
            className="w-full flex items-center justify-center p-3 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-50 transition-all duration-200 bg-white"
        >
            <UserCircleIcon className="w-6 h-6 mr-2 text-stone-400" />
            <span className="font-medium">デモアカウントでログイン</span>
        </button>
      </div>
    </Modal>
  );
};

export default AuthModal;
