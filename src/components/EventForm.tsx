
import React, { useState } from 'react';
import { Event, EventType } from '../types';

import { SparklesIcon } from './icons'; // Keep icon if potentially used, or remove if unused. Let's check usage. It was used in the button I'm removing. So I can remove it if it's the only usage. But to be safe and simple, I'll just remove the service import first.


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

  const [limit, setLimit] = useState<string>(''); // 定員・募集数の入力用

  // Admission Fees
  const [isAdmissionFeeRequired, setIsAdmissionFeeRequired] = useState(false);
  const [advanceTicketPrice, setAdvanceTicketPrice] = useState<string>('');
  const [sameDayTicketPrice, setSameDayTicketPrice] = useState<string>('');



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
      vendorLimits: eventType === EventType.MARCHE && limit ? parseInt(limit, 10) : undefined,
      attendeeLimits: eventType === EventType.SEMINAR_MEETUP && limit ? parseInt(limit, 10) : undefined,
      isAdmissionFeeRequired: eventType === EventType.MARCHE ? isAdmissionFeeRequired : false,
      advanceTicketPrice: isAdmissionFeeRequired && advanceTicketPrice ? parseInt(advanceTicketPrice, 10) : undefined,
      sameDayTicketPrice: isAdmissionFeeRequired && sameDayTicketPrice ? parseInt(sameDayTicketPrice, 10) : undefined,
    });
    onClose();
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto pr-2">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700">イベント名*</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" placeholder="例：春のパン祭りマルシェ" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700">開催日*</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-stone-700">開始*</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-stone-700">終了*</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">イベントタイプ*</label>
          <div className="flex space-x-4 mt-2">
            <label className="flex items-center cursor-pointer">
              <input type="radio" value={EventType.MARCHE} checked={eventType === EventType.MARCHE} onChange={() => setEventType(EventType.MARCHE)} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-stone-300" />
              <span className="ml-2 text-sm text-stone-700">マルシェ・市場</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="radio" value={EventType.SEMINAR_MEETUP} checked={eventType === EventType.SEMINAR_MEETUP} onChange={() => setEventType(EventType.SEMINAR_MEETUP)} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-stone-300" />
              <span className="ml-2 text-sm text-stone-700">セミナー・交流会</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">
            {eventType === EventType.MARCHE ? '募集出展者数 (店舗)' : '参加定員 (名)'}
          </label>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            min="1"
            className="mt-1 block w-32 px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            placeholder={eventType === EventType.MARCHE ? '例：20' : '例：50'}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">開催形式*</label>
          <div className="flex space-x-4 mt-2">
            <label className="flex items-center cursor-pointer">
              <input type="radio" value="offline" checked={format === 'offline'} onChange={(e) => setFormat(e.target.value as any)} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-stone-300" />
              <span className="ml-2 text-sm text-stone-700">オフライン(現地)</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="radio" value="online" checked={format === 'online'} onChange={(e) => setFormat(e.target.value as any)} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-stone-300" />
              <span className="ml-2 text-sm text-stone-700">オンライン</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="radio" value="ondemand" checked={format === 'ondemand'} onChange={(e) => setFormat(e.target.value as any)} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-stone-300" />
              <span className="ml-2 text-sm text-stone-700">オンデマンド(両方)</span>
            </label>
          </div>
        </div>

        {(format === 'offline' || format === 'ondemand') && (
          <div className="space-y-4 bg-stone-50 p-3 rounded-md border border-stone-200">
            <h4 className="text-sm font-semibold text-stone-700">開催場所の情報</h4>
            <div>
              <label className="block text-sm font-medium text-stone-700">会場名*</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="例：代々木公園 イベント広場" className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">詳細住所</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="例：東京都渋谷区代々木神園町2-1" className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">Google Map URL</label>
              <input type="url" value={googleMapUrl} onChange={(e) => setGoogleMapUrl(e.target.value)} placeholder="https://goo.gl/maps/..." className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
            </div>
          </div>
        )}

        {(format === 'online' || format === 'ondemand') && (
          <div>
            <label className="block text-sm font-medium text-stone-700">オンライン参加URL*</label>
            <input type="url" value={onlineUrl} onChange={(e) => setOnlineUrl(e.target.value)} placeholder="https://zoom.us/j/..." className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-stone-700">イベント説明*</label>
          </div>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" placeholder="イベントの魅力や詳細を入力してください。" />
        </div>

        {eventType === EventType.MARCHE && (
          <div className="space-y-4 border-t border-stone-200 pt-4">
            <div className="flex items-center">
              <input id="approval" type="checkbox" checked={isApprovalRequired} onChange={(e) => setIsApprovalRequired(e.target.checked)} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-stone-300 rounded" />
              <label htmlFor="approval" className="ml-2 block text-sm font-medium text-stone-900">出展者の承認制にする</label>
            </div>

            <div className="flex items-center">
              <input id="admission" type="checkbox" checked={isAdmissionFeeRequired} onChange={(e) => setIsAdmissionFeeRequired(e.target.checked)} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-stone-300 rounded" />
              <label htmlFor="admission" className="ml-2 block text-sm font-medium text-stone-900">入場料を設定する (一般参加者)</label>
            </div>
            {isAdmissionFeeRequired && (
              <div className="grid grid-cols-2 gap-4 pl-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700">前売りチケット (円)</label>
                  <input type="number" value={advanceTicketPrice} onChange={(e) => setAdvanceTicketPrice(e.target.value)} min="0" className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" placeholder="1000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700">当日チケット (円)</label>
                  <input type="number" value={sameDayTicketPrice} onChange={(e) => setSameDayTicketPrice(e.target.value)} min="0" className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" placeholder="1500" />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <button type="button" onClick={onClose} className="bg-stone-200 text-stone-800 px-4 py-2 rounded-lg hover:bg-stone-300 transition-colors">キャンセル</button>
          <button type="submit" className="bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition-colors">作成する</button>
        </div>
      </form >
    </div >
  );
};

export default EventForm;
