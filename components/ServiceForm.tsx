
import React, { useState } from 'react';
import { Service, ServiceCategory } from '../types';

interface ServiceFormProps {
  onAddService: (service: Omit<Service, 'id' | 'providerId' | 'status'>) => void;
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

const ServiceForm: React.FC<ServiceFormProps> = ({ onAddService, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ServiceCategory>(ServiceCategory.FORTUNE);
  const [price, setPrice] = useState(3000);
  const [deliveryMethod, setDeliveryMethod] = useState<'online' | 'offline' | 'both'>('online');
  const [location, setLocation] = useState('東京都');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price || !location) {
      alert('すべての必須項目を入力してください。');
      return;
    }
    onAddService({
      title,
      description,
      category,
      price,
      deliveryMethod,
      location,
      imageUrl: `https://picsum.photos/seed/${title}/400/300`,
    });
    onClose();
  };

  return (
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
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-stone-700">都道府県 (活動拠点)*</label>
                <select value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-stone-700">提供方法*</label>
                <div className="flex space-x-4 mt-2">
                    <label className="flex items-center"><input type="radio" value="online" checked={deliveryMethod === 'online'} onChange={e => setDeliveryMethod(e.target.value as any)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-stone-300" /> <span className="ml-2 text-sm">オンライン</span></label>
                    <label className="flex items-center"><input type="radio" value="offline" checked={deliveryMethod === 'offline'} onChange={e => setDeliveryMethod(e.target.value as any)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-stone-300" /> <span className="ml-2 text-sm">対面</span></label>
                    <label className="flex items-center"><input type="radio" value="both" checked={deliveryMethod === 'both'} onChange={e => setDeliveryMethod(e.target.value as any)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-stone-300" /> <span className="ml-2 text-sm">両方</span></label>
                </div>
            </div>
       </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">サービス説明*</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onClose} className="bg-stone-200 text-stone-800 px-4 py-2 rounded-lg hover:bg-stone-300 transition-colors">キャンセル</button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">サービスを出品</button>
      </div>
    </form>
  );
};

export default ServiceForm;
