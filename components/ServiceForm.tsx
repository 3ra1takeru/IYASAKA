
import React, { useState } from 'react';
import { Service, ServiceCategory } from '../types';

interface ServiceFormProps {
  onAddService: (service: Omit<Service, 'id' | 'providerId' | 'status'>) => void;
  onClose: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ onAddService, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ServiceCategory>(ServiceCategory.FORTUNE);
  const [price, setPrice] = useState(3000);
  const [deliveryMethod, setDeliveryMethod] = useState<'online' | 'offline' | 'both'>('online');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price) {
      alert('すべての必須項目を入力してください。');
      return;
    }
    onAddService({
      title,
      description,
      category,
      price,
      deliveryMethod,
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
       <div>
            <label className="block text-sm font-medium text-stone-700">提供方法*</label>
            <div className="flex space-x-4 mt-1">
                <label className="flex items-center"><input type="radio" value="online" checked={deliveryMethod === 'online'} onChange={e => setDeliveryMethod(e.target.value as any)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-stone-300" /> <span className="ml-2">オンライン</span></label>
                <label className="flex items-center"><input type="radio" value="offline" checked={deliveryMethod === 'offline'} onChange={e => setDeliveryMethod(e.target.value as any)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-stone-300" /> <span className="ml-2">対面</span></label>
                <label className="flex items-center"><input type="radio" value="both" checked={deliveryMethod === 'both'} onChange={e => setDeliveryMethod(e.target.value as any)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-stone-300" /> <span className="ml-2">両方</span></label>
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
