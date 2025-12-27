
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
      <Modal isOpen={isOpen} onClose={handleClose} title="デモログイン (LINE連携シミュレーション)">
        <div className="space-y-4">
          <p className="text-stone-600">LINEログインがキャンセルされたか、設定に問題がある場合に表示されます。</p>
          {users.filter(u => u.role !== UserRole.ADMIN).map((user) => (
            <button
              key={user.id}
              onClick={() => {
                onLineLogin(user);
                onClose();
              }}
              className="w-full flex items-center text-left p-4 rounded-lg border border-stone-200 hover:bg-stone-100 hover:border-green-500 transition-all duration-200"
            >
              <UserCircleIcon className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <p className="font-bold text-lg text-stone-800">{user.name}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-stone-500 uppercase">{user.role}</p>
                  {user.instagramId && <p className="text-xs text-stone-400">@{user.instagramId}</p>}
                </div>
              </div>
            </button>
          ))}
          <button onClick={() => setShowDemoUserSelection(false)} className="w-full mt-2 text-center p-2 text-sm text-stone-600 hover:bg-stone-100 rounded-md transition-colors">
            戻る
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="ログイン">
      <div className="space-y-4">
        <button
            onClick={handleRealLineLoginRedirect}
            className="w-full flex items-center justify-center p-3 rounded-lg bg-[#06C755] text-white hover:bg-[#05b34c] transition-colors duration-200 shadow-sm"
          >
            <ChatBubbleIcon className="w-6 h-6 mr-3"/>
            <span className="font-bold text-lg">LINEでログイン</span>
        </button>
        <p className="text-xs text-center text-stone-400">
            公式アカウントと連携し、予約完了通知やリマインドを受け取ることができます。
        </p>

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

        <div className="relative pt-2">
          <div className="absolute inset-0 flex items-center pt-2">
            <div className="w-full border-t border-stone-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-stone-500">またはデモユーザーでログイン</span>
          </div>
        </div>
        
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => {
              onLogin(user);
              onClose();
            }}
            className="w-full flex items-center text-left p-4 rounded-lg border border-stone-200 hover:bg-stone-100 hover:border-green-500 transition-all duration-200"
          >
            <UserCircleIcon className="w-8 h-8 text-green-600 mr-4" />
            <div>
              <p className="font-bold text-lg text-stone-800">{user.name}</p>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-stone-500 uppercase">{user.role}</p>
                {user.instagramId && <p className="text-xs text-stone-400">@{user.instagramId}</p>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
};

export default AuthModal;
