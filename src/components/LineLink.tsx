import React, { useState } from 'react';

interface LineLinkProps {
    isLinked: boolean;
    onLink: () => void;
    onUnlink: () => void;
}

const LineLink: React.FC<LineLinkProps> = ({ isLinked, onLink, onUnlink }) => {
    return (
        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-800 mb-2">LINE連携</h3>
            <p className="text-sm text-stone-600 mb-4">
                LINEアカウントと連携すると、予約の確認やメッセージの通知をLINEで受け取ることができます。
            </p>

            {isLinked ? (
                <div className="flex items-center justify-between bg-green-50 p-3 rounded border border-green-100">
                    <div className="flex items-center text-green-700 font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        連携済み
                    </div>
                    <button
                        onClick={onUnlink}
                        className="text-stone-500 text-sm hover:text-red-600 underline"
                    >
                        解除する
                    </button>
                </div>
            ) : (
                <button
                    onClick={onLink}
                    className="w-full bg-[#06C755] hover:bg-[#05b34d] text-white font-bold py-2 px-4 rounded transition-colors flex items-center justify-center"
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.6 8.7c0-4.8-5-8.7-11.2-8.7S-1.8 3.9-1.8 8.7c0 4.3 3.8 7.9 9.4 8.6.4.1.9.3 1 .6 0 0 .1.3 0 .7-.1.4-.5 1.4-.8 2.3-.2.9-.6 2.3 2 1.3 2.7-1 7.3-4.3 8.8-7.3 1.1-1.7 1.9-3.7 1.9-5.9z" />
                    </svg>
                    LINE連携設定を行う
                </button>
            )}
        </div>
    );
};

export default LineLink;
