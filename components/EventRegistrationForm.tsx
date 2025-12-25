
import React, { useState } from 'react';
import { Event, EventRegistration, OfferingType, Product, TimeSlot, RegistrationStatus, Provider, User } from '../types';
import { PlusIcon, TrashIcon, InstagramIcon } from './icons';

interface EventRegistrationFormProps {
  event: Event;
  provider: Provider;
  currentUser: User;
  existingRegistration?: EventRegistration;
  onSave: (registration: EventRegistration, providerUpdate: Partial<Omit<Provider, 'id' | 'name'>>, userUpdate: Partial<Omit<User, 'id' | 'role'>>) => void;
  onClose: () => void;
  hasBookings: boolean;
}

const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({ event, provider, currentUser, existingRegistration, onSave, onClose, hasBookings }) => {
  const [offeringType, setOfferingType] = useState<OfferingType>(existingRegistration?.offeringType || OfferingType.GOODS);
  const [products, setProducts] = useState<Product[]>(existingRegistration?.products || []);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(existingRegistration?.timeSlots || []);
  const [isOnlineBookingEnabled, setIsOnlineBookingEnabled] = useState<boolean>(existingRegistration?.isOnlineBookingEnabled || false);

  const [providerName, setProviderName] = useState(provider.providerName);
  const [description, setDescription] = useState(provider.description);
  const [profileImageUrl, setProfileImageUrl] = useState(provider.profileImageUrl);
  const [instagramId, setInstagramId] = useState(currentUser.instagramId || '');

  // For time slot generation
  const [startTimeForGeneration, setStartTimeForGeneration] = useState(event.startTime || '10:00');
  const [endTimeForGeneration, setEndTimeForGeneration] = useState(event.endTime || '17:00');
  const [slotDuration, setSlotDuration] = useState(30);
  const [interval, setInterval] = useState(10);

  const handleAddProduct = () => {
    setProducts([...products, { id: `prod${Date.now()}`, name: '', description: '', price: 0, imageUrl: `https://picsum.photos/seed/newprod${Date.now()}/200` }]);
  };

  const handleProductChange = (index: number, field: keyof Product, value: any) => {
    const newProducts = [...products];
    (newProducts[index] as any)[field] = field === 'price' ? parseInt(value, 10) || 0 : value;
    setProducts(newProducts);
  };
  
  const handleRemoveProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };
  
  const handleAddTimeSlot = () => {
      setTimeSlots([...timeSlots, {id: `ts${Date.now()}`, startTime: '10:00', endTime: '10:30'}]);
  };
  
  const handleTimeSlotChange = (index: number, field: keyof TimeSlot, value: string) => {
      const newTimeSlots = [...timeSlots];
      newTimeSlots[index][field] = value;
      setTimeSlots(newTimeSlots);
  };

  const handleRemoveTimeSlot = (index: number) => {
      setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const handleGenerateTimeSlots = () => {
    const timeToMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const minutesToTime = (minutes: number) => {
      const h = Math.floor(minutes / 60).toString().padStart(2, '0');
      const m = (minutes % 60).toString().padStart(2, '0');
      return `${h}:${m}`;
    };

    const startMinutes = timeToMinutes(startTimeForGeneration);
    const endMinutes = timeToMinutes(endTimeForGeneration);
    const newSlots: TimeSlot[] = [];
    let currentStart = startMinutes;

    while (currentStart + slotDuration <= endMinutes) {
      const currentEnd = currentStart + slotDuration;
      newSlots.push({
        id: `ts${Date.now()}${newSlots.length}`,
        startTime: minutesToTime(currentStart),
        endTime: minutesToTime(currentEnd),
      });
      currentStart = currentEnd + interval;
    }
    setTimeSlots(newSlots);
  };

  const handleSubmit = (status: RegistrationStatus) => {
    const registration: EventRegistration = {
      id: existingRegistration?.id || `reg${Date.now()}`,
      eventId: event.id,
      providerId: provider.id,
      status,
      offeringType,
      products: offeringType === OfferingType.GOODS ? products : [],
      timeSlots: offeringType === OfferingType.SERVICE ? timeSlots : [],
      isOnlineBookingEnabled: offeringType === OfferingType.SERVICE ? isOnlineBookingEnabled : false,
    };
    const providerUpdate: Partial<Omit<Provider, 'id' | 'name'>> = {
        providerName,
        description,
        profileImageUrl,
    };
    const userUpdate: Partial<Omit<User, 'id' | 'role'>> = {
        instagramId,
    };
    onSave(registration, providerUpdate, userUpdate);
  };
  
  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <h3 className="text-lg font-semibold text-stone-800">イベント: {event.name}</h3>

      <div className="p-4 border rounded-md space-y-3 bg-stone-50">
        <h4 className="font-semibold text-stone-700">出展者情報</h4>
        <div>
            <label className="text-sm font-medium text-stone-600">屋号/サービス名</label>
            <input type="text" value={providerName} onChange={e => setProviderName(e.target.value)} className="mt-1 w-full p-1 border-b focus:outline-none focus:border-green-500"/>
        </div>
        <div>
            <label className="text-sm font-medium text-stone-600">紹介文</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="mt-1 w-full p-1 border-b focus:outline-none focus:border-green-500 text-sm"/>
        </div>
        <div>
            <label className="text-sm font-medium text-stone-600">プロフィール画像URL</label>
            <input type="text" value={profileImageUrl} onChange={e => setProfileImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="mt-1 w-full p-1 border-b focus:outline-none focus:border-green-500"/>
        </div>
         <div>
            <label className="text-sm font-medium text-stone-600 flex items-center"><InstagramIcon className="w-4 h-4 mr-1.5"/>Instagram ID (任意)</label>
            <input type="text" value={instagramId} onChange={e => setInstagramId(e.target.value)} placeholder="your_account_id" className="mt-1 w-full p-1 border-b focus:outline-none focus:border-green-500"/>
            {!instagramId && <p className="text-xs text-stone-500 mt-1">Instagramを登録すると、参加者とのコミュニケーションがスムーズになります。</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">出展タイプ</label>
        <select value={offeringType} onChange={(e) => setOfferingType(e.target.value as OfferingType)} className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
          <option value={OfferingType.GOODS}>時間予約無</option>
          <option value={OfferingType.SERVICE}>時間予約有</option>
        </select>
      </div>

      {offeringType === OfferingType.GOODS && (
        <div className="p-4 border rounded-md space-y-3 bg-stone-50">
          <h4 className="font-semibold text-stone-700">商品リスト</h4>
          {products.map((product, index) => (
            <div key={product.id} className="p-3 border rounded-md bg-white space-y-2 relative">
                <button type="button" onClick={() => handleRemoveProduct(index)} className="absolute top-2 right-2 text-stone-400 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                <input type="text" placeholder="商品名" value={product.name} onChange={e => handleProductChange(index, 'name', e.target.value)} className="w-full p-1 border-b focus:outline-none focus:border-green-500"/>
                <textarea placeholder="商品説明" value={product.description} onChange={e => handleProductChange(index, 'description', e.target.value)} rows={2} className="w-full p-1 border-b focus:outline-none focus:border-green-500 text-sm"/>
                <input type="text" placeholder="商品画像URL" value={product.imageUrl} onChange={e => handleProductChange(index, 'imageUrl', e.target.value)} className="w-full p-1 border-b focus:outline-none focus:border-green-500 text-sm"/>
                <input type="number" placeholder="価格" value={product.price} onChange={e => handleProductChange(index, 'price', e.target.value)} className="w-1/2 p-1 border-b focus:outline-none focus:border-green-500"/>
            </div>
          ))}
          <button type="button" onClick={handleAddProduct} className="flex items-center text-sm text-green-600 hover:text-green-800"><PlusIcon className="w-4 h-4 mr-1"/>商品を追加</button>
        </div>
      )}

      {offeringType === OfferingType.SERVICE && (
        <div className="p-4 border rounded-md space-y-3 bg-stone-50">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-stone-700">予約時間枠</h4>
            <div className="flex items-center">
                <input type="checkbox" id="onlineBooking" checked={isOnlineBookingEnabled} onChange={e => setIsOnlineBookingEnabled(e.target.checked)} className="h-4 w-4 text-green-600 border-stone-300 rounded focus:ring-green-500" />
                <label htmlFor="onlineBooking" className="ml-2 block text-sm text-stone-900">オンライン予約を受け付ける</label>
            </div>
          </div>
          {hasBookings && <p className="text-sm text-yellow-600 bg-yellow-100 p-2 rounded-md">既に予約が入っているため、時間枠は編集できません。</p>}

          {!hasBookings && (
            <div className="p-3 border rounded-md bg-white space-y-3">
                <h5 className="text-sm font-semibold">時間枠の自動生成</h5>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs">開始時刻</label>
                        <input type="time" value={startTimeForGeneration} onChange={e => setStartTimeForGeneration(e.target.value)} className="mt-1 w-full p-1 border rounded-md text-sm"/>
                    </div>
                    <div>
                        <label className="text-xs">終了時刻</label>
                        <input type="time" value={endTimeForGeneration} onChange={e => setEndTimeForGeneration(e.target.value)} className="mt-1 w-full p-1 border rounded-md text-sm"/>
                    </div>
                    <div>
                        <label className="text-xs">1枠の所要時間 (分)</label>
                        <input type="number" value={slotDuration} onChange={e => setSlotDuration(parseInt(e.target.value, 10))} className="mt-1 w-full p-1 border rounded-md text-sm"/>
                    </div>
                    <div>
                        <label className="text-xs">インターバル (分)</label>
                        <input type="number" value={interval} onChange={e => setInterval(parseInt(e.target.value, 10))} className="mt-1 w-full p-1 border rounded-md text-sm"/>
                    </div>
                </div>
                <button type="button" onClick={handleGenerateTimeSlots} className="w-full bg-green-100 text-green-800 text-sm px-3 py-1.5 rounded-md hover:bg-green-200">時間枠を生成</button>
            </div>
          )}

          {timeSlots.map((slot, index) => (
            <div key={slot.id} className="flex items-center space-x-2">
                <input type="time" value={slot.startTime} onChange={e => handleTimeSlotChange(index, 'startTime', e.target.value)} disabled={hasBookings} className="px-2 py-1 border rounded-md bg-white"/>
                <span className="text-stone-500">-</span>
                <input type="time" value={slot.endTime} onChange={e => handleTimeSlotChange(index, 'endTime', e.target.value)} disabled={hasBookings} className="px-2 py-1 border rounded-md bg-white"/>
                {!hasBookings && <button type="button" onClick={() => handleRemoveTimeSlot(index)} className="text-stone-400 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>}
            </div>
          ))}
          {!hasBookings && <button type="button" onClick={handleAddTimeSlot} className="flex items-center text-sm text-green-600 hover:text-green-800"><PlusIcon className="w-4 h-4 mr-1"/>時間枠を手動で追加</button>}
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onClose} className="bg-stone-200 text-stone-800 px-4 py-2 rounded-lg hover:bg-stone-300">キャンセル</button>
        <button type="button" onClick={() => handleSubmit(RegistrationStatus.DRAFT)} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">下書き保存</button>
        <button type="button" onClick={() => handleSubmit(RegistrationStatus.SUBMITTED)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">申込を確定</button>
      </div>
    </div>
  );
};

export default EventRegistrationForm;
