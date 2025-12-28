
import React, { useState } from 'react';
import { Event, EventType } from '../types';

interface EventFormProps {
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onClose: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ onAddEvent, onClose }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('18:00');
  
  const [format, setFormat] = useState<'online' | 'offline' | 'ondemand'>('offline');
  const [location, setLocation] = useState(''); // 会場名
  const [address, setAddress] = useState(''); // 住所
  const [googleMapUrl, setGoogleMapUrl] = useState('');
  const [onlineUrl, setOnlineUrl] = useState('');

  const [description, setDescription] = useState('');
  const [isApprovalRequired, setIsApprovalRequired] = useState(true);
  const [eventType, setEventType] = useState<EventType>(EventType.MARCHE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date || !description || !startTime || !endTime) {
      alert('必須項目を入力してください。');
      return;
    }
    
    // Validate format specific fields
    if (format === 'online' && !onlineUrl) {
        alert('オンライン開催の場合はURLを入力してください。');
        return;
    }
    if ((format === 'offline' || format === 'ondemand') && !location) {
        alert('開催場所（会場名）を入力してください。');
        return;
    }

    onAddEvent({
      name,
      date,
      startTime,
      endTime,
      location: format === 'online' ? 'オンライン開催' : location,
      address: format !== 'online' ? address : undefined,
      googleMapUrl: format !== 'online' ? googleMapUrl : undefined,
      onlineUrl: format !== 'offline' ? onlineUrl : undefined,
      format,
      description,
      imageUrl: `https://picsum.photos/seed/${name}/800/600`,
      isApprovalRequiredForVendors: eventType === EventType.MARCHE ? isApprovalRequired : false,
      eventType,
    });
    onClose();
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto pr-2">
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-700">イベント名*</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"/>
      </div>
      
       <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">イベントタイプ*</label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="radio" 
              name="eventType"
              value={EventType.MARCHE}
              checked={eventType === EventType.MARCHE}
              onChange={(e) => setEventType(e.target.value as EventType)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-stone-300"
            />
            <span className="text-sm font-medium text-stone-700">マルシェ (出展者あり)</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="radio" 
              name="eventType"
              value={EventType.SEMINAR_MEETUP}
              checked={eventType === EventType.SEMINAR_MEETUP}
              onChange={(e) => setEventType(e.target.value as EventType)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-stone-300"
            />
            <span className="text-sm font-medium text-stone-700">セミナー/交流会 (出展者なし)</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">開催形式*</label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="radio" value="offline" checked={format === 'offline'} onChange={() => setFormat('offline')} className="h-4 w-4 text-green-600 focus:ring-green-500 border-stone-300"/>
            <span className="text-sm text-stone-700">オフライン</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="radio" value="online" checked={format === 'online'} onChange={() => setFormat('online')} className="h-4 w-4 text-green-600 focus:ring-green-500 border-stone-300"/>
            <span className="text-sm text-stone-700">オンライン</span>
          </label>
           <label className="flex items-center space-x-2 cursor-pointer">
            <input type="radio" value="ondemand" checked={format === 'ondemand'} onChange={() => setFormat('ondemand')} className="h-4 w-4 text-green-600 focus:ring-green-500 border-stone-300"/>
            <span className="text-sm text-stone-700">オンデマンド (両方)</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium text-stone-700">開催日*</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"/>
        </div>
        <div className="grid grid-cols-2 gap-2">
            <div>
                <label className="block text-sm font-medium text-stone-700">開始時刻*</label>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-stone-700">終了時刻*</label>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"/>
            </div>
        </div>
      </div>

      {(format === 'offline' || format === 'ondemand') && (
        <div className="space-y-3 bg-stone-50 p-3 rounded border border-stone-200">
             <h4 className="text-sm font-semibold text-stone-700">会場情報</h4>
            <div>
                <label className="block text-sm font-medium text-stone-700">開催場所 (会場名)*</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="例: 代々木公園、〇〇会館" className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-stone-700">住所</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="例: 東京都渋谷区..." className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"/>
            </div>
             <div>
                <label className="block text-sm font-medium text-stone-700">Google Map URL</label>
                <input type="url" value={googleMapUrl} onChange={(e) => setGoogleMapUrl(e.target.value)} placeholder="https://goo.gl/maps/..." className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"/>
            </div>
        </div>
      )}

      {(format === 'online' || format === 'ondemand') && (
          <div className="bg-stone-50 p-3 rounded border border-stone-200">
            <h4 className="text-sm font-semibold text-stone-700 mb-2">オンライン接続情報</h4>
            <div>
                <label className="block text-sm font-medium text-stone-700">配信URL / 会議URL (Zoom等)*</label>
                <input type="url" value={onlineUrl} onChange={(e) => setOnlineUrl(e.target.value)} required placeholder="https://zoom.us/j/..." className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"/>
                <p className="text-xs text-stone-500 mt-1">※ 参加者（予約者）にのみ表示されます（シミュレーション）。</p>
            </div>
          </div>
      )}
        
        {eventType === EventType.MARCHE && (
          <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                      type="checkbox" 
                      checked={isApprovalRequired} 
                      onChange={(e) => setIsApprovalRequired(e.target.checked)}
                      className="h-4 w-4 rounded border-stone-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-stone-700">出展申込の承認制を有効にする</span>
              </label>
              <p className="text-xs text-stone-500 ml-6">チェックを外すと、出展申込は自動的に承認されます。</p>
          </div>
        )}

      <div>
        <label className="block text-sm font-medium text-stone-700">イベント説明*</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"/>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onClose} className="bg-stone-200 text-stone-800 px-4 py-2 rounded-lg hover:bg-stone-300 transition-colors">キャンセル</button>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">イベント作成</button>
      </div>
    </form>
    </div>
  );
};

export default EventForm;
