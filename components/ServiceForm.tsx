
import React, { useState, useEffect } from 'react';
import { Service, ServiceCategory } from '../types';

interface ServiceFormProps {
  onAddService: (service: Omit<Service, 'id' | 'providerId' | 'status'>) => void;
  onUpdateService?: (id: string, service: Partial<Service>) => void; // 編集用コールバック
  initialService?: Service | null; // 編集時の初期データ
  onClose: () => void;
}

const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

const ServiceForm: React.FC<ServiceFormProps> = ({ onAddService, onUpdateService, initialService, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ServiceCategory>(ServiceCategory.FORTUNE);
  const [price, setPrice] = useState(3000);
  const [deliveryMethod, setDeliveryMethod] = useState<'online' | 'offline' | 'ondemand'>('online');
  const [location, setLocation] = useState('東京都');
  const [address, setAddress] = useState('');
  const [googleMapUrl, setGoogleMapUrl] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('');

  // 編集モードの場合、初期値をセット
  useEffect(() => {
    if (initialService) {
        setTitle(initialService.title);
        setDescription(initialService.description);
        setCategory(initialService.category);
        setPrice(initialService.price);
        setDeliveryMethod(initialService.deliveryMethod);
        setLocation(initialService.location === 'オンライン' ? '東京都' : initialService.location);
        setAddress(initialService.address || '');
        setGoogleMapUrl(initialService.googleMapUrl || '');
        setMeetingUrl(initialService.meetingUrl || '');
    }
  }, [initialService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price) {
      alert('必須項目を入力してください。');
      return;
    }

    if (deliveryMethod !== 'online' && !location) {
        alert('活動拠点（都道府県）を選択してください。');
        return;
    }

    const serviceData = {
      title,
      description,
      category,
      price,
      deliveryMethod,
      location: deliveryMethod === 'online' ? 'オンライン' : location,
      address: deliveryMethod !== 'online' ? address : undefined,
      googleMapUrl: deliveryMethod !== 'online' ? googleMapUrl : undefined,
      meetingUrl: deliveryMethod !== 'offline' ? meetingUrl : undefined,
      imageUrl: initialService?.imageUrl || `https://picsum.photos/seed/${title}/400/300`,
    };

    if (initialService && onUpdateService) {
        onUpdateService(initialService.id, serviceData);
    } else {
        onAddService(serviceData);
    }
    onClose();
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto pr-2">
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-stone-700">サービス名*</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-stone-700">カテゴリ*</label>
                <select value={category} onChange={e => setCategory(e.target.value as ServiceCategory)} className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    {Object.values(ServiceCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-stone-700">価格（円）*</label>
                <input type="number" value={price} onChange={e => setPrice(parseInt(e.target.value, 10))} required min="500" step="100" className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-stone-700">提供方法*</label>
            <div className="flex space-x-4 mt-2">
                <label className="flex items-center cursor-pointer"><input type="radio" value="online" checked={deliveryMethod === 'online'} onChange={e => setDeliveryMethod(e.target.value as any)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-stone-300" /> <span className="ml-2 text-sm">オンライン</span></label>
                <label className="flex items-center cursor-pointer"><input type="radio" value="offline" checked={deliveryMethod === 'offline'} onChange={e => setDeliveryMethod(e.target.value as any)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-stone-300" /> <span className="ml-2 text-sm">対面</span></label>
                <label className="flex items-center cursor-pointer"><input type="radio" value="ondemand" checked={deliveryMethod === 'ondemand'} onChange={e => setDeliveryMethod(e.target.value as any)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-stone-300" /> <span className="ml-2 text-sm">オンデマンド (両方)</span></label>
            </div>
        </div>

        {(deliveryMethod === 'online' || deliveryMethod === 'ondemand') && (
            <div>
                <label className="block text-sm font-medium text-stone-700">ミーティングURL (Zoom, Google Meetなど)</label>
                <input type="url" value={meetingUrl} onChange={(e) => setMeetingUrl(e.target.value)} placeholder="https://zoom.us/j/..." className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                <p className="text-xs text-stone-500 mt-1">※ 予約成立後に依頼者に表示されます。</p>
            </div>
        )}
        
        {(deliveryMethod === 'offline' || deliveryMethod === 'ondemand') && (
            <div className="space-y-4 bg-stone-50 p-3 rounded-md border border-stone-200">
                <h4 className="text-sm font-semibold text-stone-700">開催場所の情報</h4>
                <div>
                    <label className="block text-sm font-medium text-stone-700">都道府県 (活動拠点)*</label>
                    <select value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-700">詳細な住所 / 施設名</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="〇〇市〇〇町 1-2-3 カフェ〇〇" className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-stone-700">Google Map URL</label>
                    <input type="url" value={googleMapUrl} onChange={(e) => setGoogleMapUrl(e.target.value)} placeholder="https://goo.gl/maps/..." className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>
            </div>
        )}

        <div>
            <label className="block text-sm font-medium text-stone-700">サービス説明*</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="bg-stone-200 text-stone-800 px-4 py-2 rounded-lg hover:bg-stone-300 transition-colors">キャンセル</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                {initialService ? '保存する' : 'サービスを出品'}
            </button>
        </div>
        </form>
    </div>
  );
};

export default ServiceForm;
