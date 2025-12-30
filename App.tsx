
import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import EventCard from './components/EventCard';
import AuthModal from './components/AuthModal';
import Modal from './components/Modal';
import EventForm from './components/EventForm';
import { User, Event, Provider, EventReservation, UserRole, EventRegistration, RegistrationStatus, OfferingType, Product, TimeSlot, TimeSlotBooking, Review, Favorite, EventType, Service, ServiceCategory, ServiceOrder, ServiceReview, ChatMessage } from './types';
import ProviderDetailModal from './components/VendorDetailModal';
import EventRegistrationForm from './components/EventRegistrationForm';
import EventProvidersModal from './components/EventVendorsModal';
import { EditIcon, TrashIcon, InstagramIcon, StarIcon, ChatBubbleIcon, BriefcaseIcon, UserCircleIcon, QrcodeIcon, CalendarIcon, StoreIcon, PlusIcon, LocationMarkerIcon } from './components/icons';
import ServiceCard from './components/ServiceCard';
import ServiceForm from './components/ServiceForm';

// Helper functions for dynamic dates
const getFutureDate = (daysToAdd: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
};

const getPastDate = (daysToSubtract: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysToSubtract);
  return date.toISOString().split('T')[0];
};

const defaultLineSettings = {
  eventReservations: true,
  favoriteProviderUpdates: true,
  serviceBookings: true,
};

// Mock Data
const MOCK_USERS: User[] = [
  { id: 'organizer1', name: 'マルシェ主催者', role: UserRole.ADMIN, profileImageUrl: 'https://picsum.photos/seed/organizer/200' }, // 主催者アカウントを追加
  { id: 'provider1', name: '花屋さん', role: UserRole.PROVIDER, instagramId: 'hanaya_hidamari', isLineLinked: true, lineNotificationSettings: { ...defaultLineSettings }, profileImageUrl: 'https://picsum.photos/seed/flower-shop/200' },
  { id: 'provider2', name: 'パン屋さん', role: UserRole.PROVIDER, instagramId: 'komugi_bakery', isLineLinked: false, lineNotificationSettings: { ...defaultLineSettings }, profileImageUrl: 'https://picsum.photos/seed/bakery/200' },
  { id: 'provider3', name: '占い師さん', role: UserRole.PROVIDER, isLineLinked: false, lineNotificationSettings: { ...defaultLineSettings }, profileImageUrl: 'https://picsum.photos/seed/fortune-teller/200' },
  { id: 'member1', name: '佐藤さん', role: UserRole.MEMBER, instagramId: 'sato_san_123', isLineLinked: true, lineNotificationSettings: { ...defaultLineSettings } },
  { id: 'member2', name: '鈴木さん', role: UserRole.MEMBER, isLineLinked: false, lineNotificationSettings: { ...defaultLineSettings, favoriteProviderUpdates: false } },
];

const MOCK_PROVIDERS: Provider[] = [
    { id: 'provider1', name: '花屋さん', providerName: '陽だまり生花店', description: '季節の花やドライフラワーを販売します。', profileImageUrl: 'https://picsum.photos/seed/flower-shop/200' },
    { id: 'provider2', name: 'パン屋さん', providerName: 'こむぎの香りベーカリー', description: '国産小麦を使った焼きたてパンのお店です。', profileImageUrl: 'https://picsum.photos/seed/bakery/200' },
    { id: 'provider3', name: '占い師さん', providerName: '星読みの館', description: 'タロットカードであなたの未来を占います。30分間のセッションです。', profileImageUrl: 'https://picsum.photos/seed/fortune-teller/200' },
];

const MOCK_PRODUCTS: { [key: string]: Product[] } = {
  provider2: [
    { id: 'prod1', name: '焼きたてクロワッサン', description: 'バターの香り豊かなサクサクのクロワッサン。', price: 300, imageUrl: 'https://picsum.photos/seed/croissant/200/200' },
    { id: 'prod2', name: '天然酵母のカンパーニュ', description: '噛むほどに味わい深い、本格的な田舎パン。', price: 500, imageUrl: 'https://picsum.photos/seed/campagne/200/200' },
  ],
};

const MOCK_TIMESLOTS: { [key: string]: TimeSlot[] } = {
    provider3: [
        { id: 'ts1', startTime: '10:00', endTime: '10:30' },
        { id: 'ts2', startTime: '10:30', endTime: '11:00' },
        { id: 'ts3', startTime: '11:00', endTime: '11:30' },
        { id: 'ts4', startTime: '13:00', endTime: '13:30' },
        { id: 'ts5', startTime: '13:30', endTime: '14:00' },
    ]
};

const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

const MOCK_EVENTS: Event[] = [
  { id: 'event-past-1', ownerId: 'organizer1', name: '春のオーガニックマルシェ', date: getPastDate(90), startTime: '10:00', endTime: '17:00', location: '東京都 代々木公園', format: 'offline', googleMapUrl: 'https://goo.gl/maps/1', description: '新鮮なオーガニック野菜や果物、手作りのジャムやパンが並びます。心地よい春の風を感じながら、特別な逸品を見つけに来てください。', imageUrl: 'https://picsum.photos/seed/spring-marche/800/600', isApprovalRequiredForVendors: true, eventType: EventType.MARCHE, vendorLimits: 30 },
  { id: 'event-future-1', ownerId: 'organizer1', name: '夏のクラフトフェア', date: getFutureDate(30), startTime: '11:00', endTime: '19:00', location: '神奈川県 赤レンガ倉庫', format: 'offline', googleMapUrl: 'https://goo.gl/maps/2', description: '全国から集まった作家による、個性豊かなアクセサリー、陶器、布小物などが並びます。あなただけのお気に入りを見つけに来てください。', imageUrl: 'https://picsum.photos/seed/craft-fair/800/600', isApprovalRequiredForVendors: true, eventType: EventType.MARCHE, vendorLimits: 50 },
  { id: 'event-future-3', ownerId: 'organizer1', name: 'Webデザイナ交流会', date: getFutureDate(45), startTime: '19:00', endTime: '21:00', location: '大阪府 co-working space ABC', format: 'ondemand', googleMapUrl: 'https://goo.gl/maps/3', onlineUrl: 'https://zoom.us/abc', description: 'Webデザイナーやフロントエンドエンジニア向けの交流会です。軽食をとりながら、情報交換やネットワーキングを楽しみましょう。', imageUrl: 'https://picsum.photos/seed/meetup/800/600', isApprovalRequiredForVendors: false, eventType: EventType.SEMINAR_MEETUP, attendeeLimits: 20 },
  { id: 'event-future-2', ownerId: 'organizer1', name: '秋の手作り市', date: getFutureDate(90), startTime: '10:00', endTime: '16:00', location: '京都府 梅小路公園', format: 'offline', description: '温かみのある手作り雑貨やアート作品が勢揃い。作家さんとの会話も楽しみながら、お気に入りの一品を探してみませんか。', imageUrl: 'https://picsum.photos/seed/autumn-market/800/600', isApprovalRequiredForVendors: true, eventType: EventType.MARCHE, vendorLimits: 20 }
];

const MOCK_EVENT_REGISTRATIONS: EventRegistration[] = [
    { id: 'reg1', eventId: 'event-past-1', providerId: 'provider1', status: RegistrationStatus.APPROVED, offeringType: OfferingType.GOODS, products: [], timeSlots: [] },
    { id: 'reg2', eventId: 'event-past-1', providerId: 'provider2', status: RegistrationStatus.APPROVED, offeringType: OfferingType.GOODS, products: MOCK_PRODUCTS.provider2, timeSlots: [] },
    { id: 'reg3', eventId: 'event-future-1', providerId: 'provider2', status: RegistrationStatus.DRAFT, offeringType: OfferingType.GOODS, products: [], timeSlots: [], notes: '検討中' },
    { id: 'reg4', eventId: 'event-future-1', providerId: 'provider3', status: RegistrationStatus.APPROVED, offeringType: OfferingType.SERVICE, products: [], timeSlots: MOCK_TIMESLOTS.provider3, isOnlineBookingEnabled: true },
    { id: 'reg5', eventId: 'event-future-1', providerId: 'provider1', status: RegistrationStatus.SUBMITTED, offeringType: OfferingType.GOODS, products: [], timeSlots: [] }, // SUBMITTEDに変更して承認待ちを演出
    { id: 'reg6', eventId: 'event-future-2', providerId: 'provider1', status: RegistrationStatus.APPROVED, offeringType: OfferingType.GOODS, products: [], timeSlots: [] },
    { id: 'reg7', eventId: 'event-future-2', providerId: 'provider3', status: RegistrationStatus.SUBMITTED, offeringType: OfferingType.SERVICE, products: [], timeSlots: MOCK_TIMESLOTS.provider3, isOnlineBookingEnabled: true },
];

const MOCK_REVIEWS: Review[] = [
    { id: 'rev1', eventId: 'event-past-1', providerId: 'provider1', userId: 'member1', rating: 5, comment: 'とても素敵なブーケを作っていただきました！対応も丁寧で、またお願いしたいです。', createdAt: getPastDate(89) },
    { id: 'rev2', eventId: 'event-past-1', providerId: 'provider2', userId: 'member1', rating: 4, comment: 'クロワッサンが絶品でした。外はサクサク、中はもっちり。少し値段は張りますが、食べる価値ありです！', createdAt: getPastDate(89) },
];

const MOCK_SERVICES: Service[] = [
    { id: 'service1', providerId: 'provider3', title: 'あなたの未来を占うタロットリーディング', description: '恋愛、仕事、人間関係など、どんなお悩みでもご相談ください。タロットカードがあなたを導きます。', category: ServiceCategory.FORTUNE, price: 3000, imageUrl: 'https://picsum.photos/seed/tarot/400/300', deliveryMethod: 'online', location: '東京都', status: 'open' },
    { id: 'service2', providerId: 'provider1', title: 'オーダーメイドの記念日ブーケ', description: '誕生日や記念日に、世界で一つだけの特別なブーケをお作りします。色や花の種類などご希望をお聞かせください。', category: ServiceCategory.OTHER, price: 5000, imageUrl: 'https://picsum.photos/seed/bouquet/400/300', deliveryMethod: 'offline', location: '神奈川県', googleMapUrl: 'https://goo.gl/maps/123', status: 'open' },
];

const MOCK_SERVICE_ORDERS: ServiceOrder[] = [
    { id: 'order1', serviceId: 'service2', buyerId: 'member1', providerId: 'provider1', status: 'requested', createdAt: getPastDate(2)},
    { id: 'order2', serviceId: 'service1', buyerId: 'member2', providerId: 'provider3', status: 'completed', createdAt: getPastDate(10)},
];

const MOCK_SERVICE_REVIEWS: ServiceReview[] = [
    { id: 'srev1', serviceId: 'service1', userId: 'member2', rating: 5, comment: 'とても当たっていて驚きました。的確なアドバイスで、前向きな気持ちになれました。ありがとうございました！', createdAt: getPastDate(9) },
];

const MOCK_CHAT_MESSAGES: ChatMessage[] = [
    { id: 'msg1', orderId: 'order1', senderId: 'member1', receiverId: 'provider1', message: 'こんにちは！ブーケの件でご相談です。記念日のプレゼントで、ピンク色を基調とした華やかな雰囲気でお願いしたいのですが、ご予算5000円で可能でしょうか？', createdAt: new Date(new Date(getPastDate(2)).getTime() + 1000 * 60 * 5).toISOString(), isRead: true },
    { id: 'msg2', orderId: 'order1', senderId: 'provider1', receiverId: 'member1', message: '佐藤さん、こんにちは！ご相談ありがとうございます。もちろんです、ご予算5000円で素敵なブーケをお作りしますよ。ピンクのバラやガーベラをメインに、季節の小花を添えるのはいかがでしょうか？', createdAt: new Date(new Date(getPastDate(2)).getTime() + 1000 * 60 * 15).toISOString(), isRead: true },
    { id: 'msg3', orderId: 'order1', senderId: 'member1', receiverId: 'provider1', message: 'ありがとうございます！ぜひその内容でお願いします。とても楽しみです。', createdAt: new Date(new Date(getPastDate(2)).getTime() + 1000 * 60 * 20).toISOString(), isRead: true },
];


// --- NEW COMPONENT DEFINITION ---
interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  provider: Provider | null;
  currentUser: User | null;
  onRequestService: (serviceId: string) => void;
  reviews: ServiceReview[];
  serviceOrders: ServiceOrder[];
  users: User[];
  onAddReview: (review: Omit<ServiceReview, 'id' | 'createdAt'>) => void;
}

const StarRatingDisplay = ({ rating, className = "w-5 h-5" }: { rating: number, className?: string }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <StarIcon key={i} className={`${className} ${i < rating ? 'text-yellow-400' : 'text-stone-300'}`} filled={i < rating} />
    ))}
  </div>
);


const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ isOpen, onClose, service, provider, currentUser, onRequestService, reviews, serviceOrders, users, onAddReview }) => {
  if (!isOpen || !service || !provider) return null;
  
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const canRequest = currentUser && currentUser.role === UserRole.MEMBER && currentUser.id !== service.providerId;
  const serviceReviews = reviews.filter(r => r.serviceId === service.id).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const averageRating = serviceReviews.length > 0 ? serviceReviews.reduce((sum, r) => sum + r.rating, 0) / serviceReviews.length : 0;
  
  const canPostReview = currentUser && 
      serviceOrders.some(o => o.serviceId === service.id && o.buyerId === currentUser.id && o.status === 'completed') &&
      !serviceReviews.some(r => r.serviceId === service.id && r.userId === currentUser.id);

  const handleAddReview = () => {
    if (newRating > 0 && newComment.trim() && currentUser) {
        onAddReview({
            serviceId: service.id,
            userId: currentUser.id,
            rating: newRating,
            comment: newComment,
        });
        setNewRating(0);
        setNewComment('');
    }
  };

  const deliveryMethodText = {
      online: 'オンライン',
      offline: '対面',
      ondemand: 'オンデマンド (両方)'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="サービス詳細">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <img src={service.imageUrl} alt={service.title} className="w-full h-56 object-cover rounded shadow-sm border border-stone-100" />
        
        <div className="flex justify-between items-start">
            <div>
                 <span className="text-xs font-serif font-medium tracking-wide text-indigo-800 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-sm">{service.category}</span>
                 <h2 className="text-2xl font-bold text-stone-800 mt-3 font-serif tracking-wide">{service.title}</h2>
            </div>
            <div className="flex items-center text-xs bg-stone-100 px-2 py-1 rounded text-stone-600 mt-1 whitespace-nowrap">
                <LocationMarkerIcon className="w-3 h-3 mr-1 text-stone-500" />
                {service.googleMapUrl ? (
                    <a href={service.googleMapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-teal-700 hover:underline">
                        {service.location}
                    </a>
                ) : (
                    service.location
                )}
            </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
             <div className="flex items-center text-md text-stone-700">
                <img src={provider.profileImageUrl} alt={provider.providerName} className="w-10 h-10 rounded-full object-cover mr-3 border border-stone-200" />
                <span className="font-semibold text-sm">{provider.providerName}</span>
            </div>
            <span className="text-2xl font-bold text-teal-800 font-serif">&yen;{service.price.toLocaleString()}</span>
        </div>
        
        <div className="space-y-2 bg-stone-50 p-4 rounded border border-stone-100">
            <h3 className="font-semibold text-stone-700 text-sm">サービス内容</h3>
            <p className="text-stone-600 whitespace-pre-wrap text-sm leading-relaxed font-light">{service.description}</p>
        </div>
        <div className="space-y-2">
            <h3 className="font-semibold text-stone-700 text-sm">提供方法</h3>
            <p className="text-stone-600 capitalize text-sm">{deliveryMethodText[service.deliveryMethod]}</p>
        </div>
        {service.address && (
             <div className="space-y-2">
                <h3 className="font-semibold text-stone-700 text-sm">住所</h3>
                <p className="text-stone-600 text-sm">{service.address}</p>
            </div>
        )}

        {/* Reviews Section */}
        <div className="pt-4 border-t border-stone-100">
            <div className="flex items-center gap-4 mb-3">
                <h4 className="font-semibold text-stone-800 mb-0 text-sm">口コミ ({serviceReviews.length}件)</h4>
                {serviceReviews.length > 0 && (
                    <div className="flex items-center gap-2">
                        <StarRatingDisplay rating={averageRating} />
                        <span className="font-bold text-stone-700">{averageRating.toFixed(1)}</span>
                    </div>
                )}
            </div>

            {serviceReviews.length > 0 ? (
                <div className="space-y-4">
                    {serviceReviews.map(review => {
                        const reviewer = users.find(u => u.id === review.userId);
                        return (
                        <div key={review.id} className="bg-stone-50 p-3 rounded border border-stone-100">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                     {reviewer?.profileImageUrl ? (
                                        <img src={reviewer.profileImageUrl} alt={reviewer.name} className="w-6 h-6 rounded-full object-cover" />
                                     ) : (
                                        <UserCircleIcon className="w-4 h-4 text-stone-400"/>
                                     )}
                                    <p className="font-semibold text-xs text-stone-700">{reviewer?.name || '匿名ユーザー'}</p>
                                </div>
                                <StarRatingDisplay rating={review.rating} className="w-3 h-3"/>
                            </div>
                            <p className="text-stone-600 text-sm font-light">{review.comment}</p>
                            <p className="text-right text-xs text-stone-400 mt-1 font-serif">{review.createdAt}</p>
                        </div>
                        )
                    })}
                </div>
            ) : (
                <p className="text-sm text-stone-500">まだ口コミはありません。</p>
            )}
        </div>

        {/* Review Form Section */}
        {canPostReview && (
            <div className="pt-4 border-t border-stone-100">
                 <h4 className="font-semibold text-stone-800 mb-2 text-sm">このサービスの口コミを投稿する</h4>
                 <div className="space-y-3">
                    <div>
                        <label className="text-xs font-medium text-stone-600">評価</label>
                        <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                            <button key={i} onClick={() => setNewRating(i + 1)} onMouseOver={() => setHoverRating(i+1)} onMouseOut={() => setHoverRating(0)}>
                                <StarIcon 
                                    className={`w-6 h-6 cursor-pointer transition-colors ${(hoverRating || newRating) > i ? 'text-yellow-400' : 'text-stone-300'}`} 
                                    filled={(hoverRating || newRating) > i}
                                />
                            </button>
                            ))}
                        </div>
                    </div>
                     <div>
                        <label className="text-xs font-medium text-stone-600">コメント</label>
                        <textarea 
                            value={newComment} 
                            onChange={e => setNewComment(e.target.value)} 
                            rows={3} 
                            placeholder="サービスの感想を教えてください"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm"
                        />
                    </div>
                    <div className="text-right">
                        <button onClick={handleAddReview} disabled={!newRating || !newComment.trim()} className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800 disabled:bg-stone-300 text-sm tracking-wide transition-colors">投稿する</button>
                    </div>
                         </div>
            </div>
        )}


        <div className="pt-4 border-t border-stone-100">
            {canRequest ? (
                <button 
                    onClick={() => onRequestService(service.id)}
                    className="w-full bg-teal-700 text-white px-4 py-3 rounded hover:bg-teal-800 transition-colors flex items-center justify-center font-bold text-lg tracking-wide shadow-sm"
                >
                    <BriefcaseIcon className="w-5 h-5 mr-2" />
                    このサービスについて相談する
                </button>
            ) : (
                <div className="text-center p-3 bg-stone-100 rounded text-stone-600 text-sm">
                    {currentUser?.id === service.providerId 
                        ? "ご自身のサービスです。"
                        : "サービスに申し込むには会員としてログインしてください。"
                    }
                </div>
            )}
        </div>
      </div>
    </Modal>
  );
};


const renderServiceStatus = (status: ServiceOrder['status']) => {
    const styles = {
        requested: "bg-yellow-50 text-yellow-800 border-yellow-200",
        accepted: "bg-indigo-50 text-indigo-800 border-indigo-200",
        completed: "bg-teal-50 text-teal-800 border-teal-200",
        cancelled: "bg-stone-200 text-stone-700 border-stone-300",
    };
    const text = {
        requested: "承認待ち",
        accepted: "進行中",
        completed: "完了",
        cancelled: "取消",
    };
    return <span className={`px-2 py-0.5 text-xs font-medium rounded border ${styles[status]}`}>{text[status]}</span>;
}

interface ChatSession {
  id: string; // orderId or bookingId
  providerId: string;
  buyerId: string; // userId of the member
  title: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: ChatSession | null;
  currentUser: User | null;
  messages: ChatMessage[];
  onSendMessage: (sessionId: string, messageText: string) => void;
  users: User[];
  providers: Provider[];
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, session, currentUser, messages, onSendMessage, users, providers }) => {
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);


  if (!isOpen || !session || !currentUser) return null;

  const isProvider = currentUser.id === session.providerId;
  const otherUserId = isProvider ? session.buyerId : session.providerId;
  const otherUser = isProvider 
      ? users.find(u => u.id === otherUserId) 
      : providers.find(p => p.id === otherUserId);
  const otherUserName = isProvider ? otherUser?.name : (otherUser as Provider)?.providerName;


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(session.id, newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${otherUserName}とのメッセージ`}>
      <div className="flex flex-col h-[60vh]">
        <div className="bg-stone-100 p-2 text-sm text-stone-600 mb-2 rounded-sm text-center border border-stone-200">
            <span className="font-semibold">{session.title}</span> に関する連絡
        </div>
        <div className="flex-grow overflow-y-auto p-4 bg-[#fcfcf9] rounded border border-stone-200 space-y-4">
          {messages.length > 0 ? messages.map(msg => {
            const isMyMessage = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${isMyMessage ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-stone-700 rounded-bl-none border border-stone-200 shadow-sm'}`}>
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-xs mt-1 ${isMyMessage ? 'text-indigo-200' : 'text-stone-400'} text-right`}>
                    {new Date(msg.createdAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                    {isMyMessage && msg.isRead && <span className="ml-1 text-indigo-300">既読</span>}
                  </p>
                </div>
              </div>
            )
          }) : <p className="text-center text-stone-500 text-sm">まだメッセージはありません。</p>}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-grow block w-full px-3 py-2 bg-white border border-stone-300 rounded shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
          <button type="submit" className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800 disabled:bg-stone-300 transition-colors" disabled={!newMessage.trim()}>送信</button>
        </form>
      </div>
    </Modal>
  );
};


// New Component: QR Code Modal for Members
interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: string;
    title: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, data, title }) => {
    if (!isOpen) return null;
    
    // Using a reliable public API for QR code generation
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data)}`;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="flex flex-col items-center space-y-4 p-4">
                <p className="text-sm text-stone-600 text-center">受付でこのQRコードを提示してください。</p>
                <div className="border-4 border-stone-100 rounded-xl p-2 bg-white">
                    <img src={qrUrl} alt="QR Code" className="w-64 h-64" />
                </div>
                <div className="text-xs text-stone-400 break-all text-center max-w-[250px] font-mono">
                    ID: {data}
                </div>
                <button onClick={onClose} className="w-full bg-stone-200 text-stone-800 py-2 rounded hover:bg-stone-300 transition-colors">閉じる</button>
            </div>
        </Modal>
    );
};

// New Component: Scan Modal for Providers
interface ScanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScan: (ticketId: string) => void;
}

const ScanModal: React.FC<ScanModalProps> = ({ isOpen, onClose, onScan }) => {
    const [ticketIdInput, setTicketIdInput] = useState('');
    
    if (!isOpen) return null;

    const handleScanSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (ticketIdInput.trim()) {
            onScan(ticketIdInput.trim());
            setTicketIdInput('');
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="QR受付スキャン">
            <div className="space-y-6 p-2">
                <div className="bg-stone-900 h-48 rounded flex items-center justify-center text-stone-400 flex-col">
                    <QrcodeIcon className="w-12 h-12 mb-2"/>
                    <p className="text-sm">カメラを起動中... (シミュレーション)</p>
                </div>
                
                <div className="text-center">
                    <p className="text-sm text-stone-600 mb-2">または、チケットIDを手入力してください</p>
                    <form onSubmit={handleScanSubmit} className="flex gap-2">
                        <input 
                            type="text" 
                            value={ticketIdInput}
                            onChange={e => setTicketIdInput(e.target.value)}
                            placeholder="ticket-event-user"
                            className="flex-grow p-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <button type="submit" className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800 transition-colors">確認</button>
                    </form>
                </div>
            </div>
        </Modal>
    );
}

// New Component: Event Applications Modal for Organizers
interface EventApplicationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event;
    registrations: EventRegistration[];
    providers: Provider[];
    onUpdateStatus: (registrationId: string, status: RegistrationStatus) => void;
}

const EventApplicationsModal: React.FC<EventApplicationsModalProps> = ({ isOpen, onClose, event, registrations, providers, onUpdateStatus }) => {
    if (!isOpen) return null;

    // Filter registrations for this event
    const eventRegistrations = registrations.filter(r => r.eventId === event.id);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${event.name} - 出展申込管理`}>
             <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {eventRegistrations.length > 0 ? (
                    eventRegistrations.map(reg => {
                        const provider = providers.find(p => p.id === reg.providerId);
                        if (!provider) return null;
                        
                        return (
                            <div key={reg.id} className="p-4 border border-stone-200 rounded-lg bg-white shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center">
                                         {provider.profileImageUrl ? (
                                            <img src={provider.profileImageUrl} alt={provider.providerName} className="w-10 h-10 rounded-full object-cover mr-3 border border-stone-200" />
                                        ) : (
                                            <StoreIcon className="w-10 h-10 text-stone-400 mr-3"/>
                                        )}
                                        <div>
                                            <h4 className="font-bold text-stone-800">{provider.providerName}</h4>
                                            <p className="text-xs text-stone-500">{provider.name}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                                        reg.status === RegistrationStatus.APPROVED ? 'bg-green-100 text-green-800' :
                                        reg.status === RegistrationStatus.REJECTED ? 'bg-red-100 text-red-800' :
                                        reg.status === RegistrationStatus.SUBMITTED ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-stone-100 text-stone-600'
                                    }`}>
                                        {reg.status === RegistrationStatus.APPROVED ? '承認済み' :
                                         reg.status === RegistrationStatus.REJECTED ? '却下' :
                                         reg.status === RegistrationStatus.SUBMITTED ? '承認待ち' : '下書き'}
                                    </span>
                                </div>
                                <div className="bg-stone-50 p-2 rounded text-sm text-stone-700 mb-3">
                                    <p><span className="font-semibold">タイプ:</span> {reg.offeringType === OfferingType.GOODS ? '物品販売' : 'サービス提供'}</p>
                                    {reg.notes && <p className="mt-1"><span className="font-semibold">備考:</span> {reg.notes}</p>}
                                </div>
                                
                                {reg.status === RegistrationStatus.SUBMITTED && (
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => onUpdateStatus(reg.id, RegistrationStatus.REJECTED)}
                                            className="px-3 py-1.5 text-xs bg-white border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors"
                                        >
                                            却下
                                        </button>
                                        <button 
                                            onClick={() => onUpdateStatus(reg.id, RegistrationStatus.APPROVED)}
                                            className="px-3 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-bold"
                                        >
                                            承認する
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p className="text-stone-500 text-center py-4">まだ出展申込はありません。</p>
                )}
             </div>
        </Modal>
    );
};


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [providers, setProviders] = useState<Provider[]>(MOCK_PROVIDERS);
  const [eventReservations, setEventReservations] = useState<EventReservation[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>(MOCK_EVENT_REGISTRATIONS);
  const [timeSlotBookings, setTimeSlotBookings] = useState<TimeSlotBooking[]>([]);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(MOCK_SERVICE_ORDERS);
  const [serviceReviews, setServiceReviews] = useState<ServiceReview[]>(MOCK_SERVICE_REVIEWS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);


  const [view, setView] = useState<'home' | 'dashboard'>('home');
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isEventFormOpen, setEventFormOpen] = useState(false);
  const [isServiceFormOpen, setServiceFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null); // 編集中のサービス
  const [isRegistrationFormOpen, setRegistrationFormOpen] = useState(false);
  const [registrationFormData, setRegistrationFormData] = useState<{eventId: string, registrationId?: string} | null>(null);
  const [isProviderDetailOpen, setProviderDetailOpen] = useState(false);
  const [selectedProviderInfo, setSelectedProviderInfo] = useState<{provider: Provider, registration: EventRegistration} | null>(null);
  const [isGenericModalOpen, setGenericModalOpen] = useState(false);
  const [genericModalContent, setGenericModalContent] = useState({ title: '', message: ''});
  
  const [isEventProvidersModalOpen, setEventProvidersModalOpen] = useState(false);
  const [selectedEventForProviders, setSelectedEventForProviders] = useState<Event | null>(null);
  const [isServiceDetailOpen, setServiceDetailOpen] = useState(false);
  const [selectedServiceInfo, setSelectedServiceInfo] = useState<{service: Service, provider: Provider} | null>(null);
  const [isChatModalOpen, setChatModalOpen] = useState(false);
  const [selectedChatSession, setSelectedChatSession] = useState<ChatSession | null>(null);
  
  const [isQRModalOpen, setQRModalOpen] = useState(false);
  const [qrData, setQrData] = useState<{data: string, title: string} | null>(null);
  
  const [isScanModalOpen, setScanModalOpen] = useState(false);
  
  const [isEventApplicationsModalOpen, setEventApplicationsModalOpen] = useState(false); // 主催者用
  const [selectedEventForApplications, setSelectedEventForApplications] = useState<Event | null>(null); // 主催者用

  const [searchType, setSearchType] = useState<'events' | 'services'>('events');

  const receivedBookings = currentUser ? timeSlotBookings.filter(b => b.providerId === currentUser.id) : [];

  // Notification Logic
  const unreadMessagesCount = currentUser ? chatMessages.filter(m => m.receiverId === currentUser.id && !m.isRead).length : 0;
  const pendingServiceOrdersCount = currentUser && currentUser.role === UserRole.PROVIDER 
      ? serviceOrders.filter(o => o.providerId === currentUser.id && o.status === 'requested').length 
      : 0;
  
  const hasUnreadNotifications = unreadMessagesCount > 0 || pendingServiceOrdersCount > 0;


  // --- Handle LINE Login Callback ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    // const state = params.get('state'); // In a real app, verify state to prevent CSRF

    if (code) {
        // Backend simulation: Exchange code for access_token, then get profile.
        // For this frontend-only demo, we assume success if 'code' is present.
        
        console.log("LINE Login Code received:", code);
        
        // 実際のアプリではバックエンドでトークン交換とユーザー情報の取得・保存を行いますが、
        // デモ環境では「佐藤さん」ではなく、新規ユーザーを作成してログインさせます。
        
        // 仮のLINEユーザーを作成
        const newUserId = `line_user_${Date.now()}`;
        const newLineUser: User = {
            id: newUserId,
            name: "LINE 太郎", // 仮の名前
            role: UserRole.MEMBER,
            isLineLinked: true,
            // ダミーのアイコン画像
            profileImageUrl: "https://placehold.co/200x200/06C755/ffffff?text=LINE",
            lineNotificationSettings: { ...defaultLineSettings },
        };
        
        // Update user list state
        setUsers(prev => [...prev, newLineUser]);
        setCurrentUser(newLineUser);
        
        // Clean the URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        showMessage('LINEログイン成功', 'LINEアカウントでの認証に成功しました。\n(デモ環境のため、実際のLINE名は取得できませんが、仮の名前でログインしました)');
    }
  }, []); // Run only on mount (removed [users] dependency to prevent loop/re-run issues though it was harmless before due to 'code' check)


  const showMessage = (title: string, message: string) => {
    setGenericModalContent({ title, message });
    setGenericModalOpen(true);
  };
  
  // ... rest of the component
  
  const handleLogin = (user: User) => {
    const latestUser = users.find(u => u.id === user.id) || user;
    setCurrentUser(latestUser);
    setView('home');
  };
  
  const handleLineLogin = (userToLink: User) => {
    // Simulate LINE login. Find a demo user, mark as LINE linked, and log in.
    const updatedUser = { ...userToLink, isLineLinked: true };
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    setView('home');
    showMessage('LINEログイン成功', `${updatedUser.name}としてログインしました。LINEアカウントが連携されました。`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('home');
  };

  const handleAddEvent = (newEventData: Omit<Event, 'id'>) => {
    // 現在のユーザーIDをownerIdとして設定
    const newEvent: Event = { 
        ...newEventData, 
        id: `event${Date.now()}`,
        ownerId: currentUser?.id 
    };
    setEvents(prev => [...prev, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };
  
  const handleAddService = (newServiceData: Omit<Service, 'id' | 'providerId' | 'status'>) => {
    if (!currentUser || currentUser.role !== UserRole.PROVIDER) return;
    const newService: Service = { 
        ...newServiceData, 
        id: `service${Date.now()}`,
        providerId: currentUser.id,
        status: 'open',
    };
    setServices(prev => [newService, ...prev]);
  };

  const handleUpdateService = (id: string, serviceUpdate: Partial<Service>) => {
      setServices(prev => prev.map(s => s.id === id ? { ...s, ...serviceUpdate } : s));
      showMessage("更新完了", "サービス情報を更新しました。");
  };

  const handleEditServiceClick = (service: Service) => {
    setEditingService(service);
    setServiceFormOpen(true);
  };
  
  const handleAddServiceClick = () => {
      setEditingService(null);
      setServiceFormOpen(true);
  };

  const handleMemberReserve = (eventId: string) => {
    if (!currentUser || currentUser.role !== UserRole.MEMBER) return;
    setEventReservations(prev => [...prev, { userId: currentUser.id, eventId }]);
    let message = "イベントへの参加予約が完了しました。あなたと主催者に確認メールが送信されました（シミュレーション）。";
    if (currentUser.isLineLinked && currentUser.lineNotificationSettings?.eventReservations) {
      message += "\nLINEにも通知を送信しました。";
    }
    showMessage("予約完了", message);
  };
  
  const handleCancelEventReservation = (eventId: string) => {
    if (!currentUser) return;
    setEventReservations(prev => prev.filter(r => !(r.eventId === eventId && r.userId === currentUser.id)));
    let message = "イベントの参加予約をキャンセルしました。あなたと主催者にキャンセル確認メールが送信されました（シミュレーション）。";
    if (currentUser.isLineLinked && currentUser.lineNotificationSettings?.eventReservations) {
      message += "\nLINEにも通知を送信しました。";
    }
    showMessage("予約キャンセル", message);
  }

  const handleProviderRegisterClick = (eventId: string, registrationId?: string) => {
    setRegistrationFormData({ eventId, registrationId });
    setRegistrationFormOpen(true);
  };
  
  const handleSaveRegistration = (registration: EventRegistration, providerUpdate?: Partial<Omit<Provider, 'id' | 'name'>>, userUpdate?: Partial<Omit<User, 'id' | 'role'>>) => {
    if (currentUser?.role !== UserRole.PROVIDER) return;

    const event = events.find(e => e.id === registration.eventId);
    let finalRegistration = { ...registration };

    if (event && event.isApprovalRequiredForVendors === false && finalRegistration.status === RegistrationStatus.SUBMITTED) {
      finalRegistration.status = RegistrationStatus.APPROVED;
    }
    
    setEventRegistrations(prev => {
        const index = prev.findIndex(r => r.id === finalRegistration.id);
        if (index > -1) {
            const newRegs = [...prev];
            newRegs[index] = finalRegistration;
            return newRegs;
        }
        return [...prev, finalRegistration];
    });

    if (providerUpdate) {
        setProviders(prev => prev.map(v => v.id === currentUser.id ? { ...v, ...providerUpdate } : v));
    }

    if (userUpdate) {
        setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...userUpdate } : u));
        setCurrentUser(prev => prev ? { ...prev, ...userUpdate } : null);
    }

    setRegistrationFormOpen(false);
    
    let messageTitle = "保存しました";
    let messageBody = "";
    if (finalRegistration.status === RegistrationStatus.DRAFT) {
        messageBody = "申込を下書き保存しました。";
    } else if (finalRegistration.status === RegistrationStatus.APPROVED) {
        messageBody = "出展申込が承認され、登録が完了しました。";
    } else { // SUBMITTED
        messageBody = "出展申込が完了しました。主催者の承認をお待ちください。";
    }
    showMessage(messageTitle, messageBody);
  };

  const handleSelectProvider = (provider: Provider, registration: EventRegistration) => {
    setSelectedProviderInfo({ provider, registration });
    setProviderDetailOpen(true);
  };
  
  const handleShowAllProviders = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
        setSelectedEventForProviders(event);
        setEventProvidersModalOpen(true);
    }
  };

  const handleBookTimeSlot = (eventId: string, providerId: string, timeSlotId: string, bookingType: 'online' | '現地') => {
    if (!currentUser || currentUser.role !== UserRole.MEMBER) return;
    setTimeSlotBookings(prev => [...prev, {id: `booking${Date.now()}`, userId: currentUser.id, eventId, providerId, timeSlotId, bookingType}]);
    let message = `時間枠の予約が完了しました。(${bookingType}) あなたと出展者に確認メールが送信されました（シミュレーション）。`;
    if (currentUser.isLineLinked && currentUser.lineNotificationSettings?.serviceBookings) {
      message += "\nLINEにも通知を送信しました。";
    }
    showMessage("予約完了", message);
  };

  const handleCancelTimeSlotBooking = (bookingId: string) => {
    if (!currentUser) return;
    setTimeSlotBookings(prev => prev.filter(b => b.id !== bookingId));
    let message = "時間枠の予約をキャンセルしました。あなたと出展者にキャンセル確認メールが送信されました（シミュレーション）。";
     if (currentUser.isLineLinked && currentUser.lineNotificationSettings?.serviceBookings) {
      message += "\nLINEにも通知を送信しました。";
    }
    showMessage("予約キャンセル", message);
  }
  
  const handleAddReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
        ...reviewData,
        id: `rev${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
    };
    setReviews(prev => [newReview, ...prev]);
    showMessage("投稿完了", "口コミを投稿しました。ご協力ありがとうございます！");
  };

  const handleToggleFavorite = (providerId: string) => {
    if (!currentUser || currentUser.role !== UserRole.MEMBER) {
      showMessage("ログインが必要です", "お気に入り機能を利用するには会員としてログインしてください。");
      return;
    }
    setFavorites(prev => {
      const isFavorited = prev.some(f => f.userId === currentUser.id && f.providerId === providerId);
      if (isFavorited) {
        showMessage("お気に入り解除", "お気に入りから削除しました。");
        return prev.filter(f => !(f.userId === currentUser.id && f.providerId === providerId));
      } else {
        showMessage("お気に入り登録", "お気に入りに追加しました！");
        return [...prev, { userId: currentUser.id, providerId }];
      }
    });
  };

  const handleLinkLine = () => {
    if (!currentUser) return;
    // For demo purposes when clicking "Link LINE" from dashboard, just simulate.
    // In real app, this would also redirect to Auth URL but with state tracking to link account.
    const updatedUser = { ...currentUser, isLineLinked: true };
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    showMessage("連携完了", "LINEアカウントとの連携が完了しました。");
  };

  const handleToggleLineNotification = (key: keyof NonNullable<User['lineNotificationSettings']>, value: boolean) => {
     if (!currentUser) return;
     const updatedUser = {
        ...currentUser,
        lineNotificationSettings: {
            ...currentUser.lineNotificationSettings,
            [key]: value
        } as NonNullable<User['lineNotificationSettings']>
     };
     setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
     setCurrentUser(updatedUser);
  };
  
  const handleSelectService = (service: Service) => {
    const provider = providers.find(p => p.id === service.providerId);
    if (provider) {
        setSelectedServiceInfo({ service, provider });
        setServiceDetailOpen(true);
    }
  };

  const handleRequestService = (serviceId: string) => {
    if (!currentUser || currentUser.role !== UserRole.MEMBER) {
        showMessage("ログインが必要です", "サービスをリクエストするには会員としてログインしてください。");
        return;
    }
    
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    const existingOrder = serviceOrders.find(o => o.serviceId === serviceId && o.buyerId === currentUser.id);
    if (existingOrder) {
        showMessage("リクエスト済み", "このサービスは既に相談リクエストを送信済みです。提供者からの連絡をお待ちください。");
        return;
    }

    const newOrder: ServiceOrder = {
        id: `order${Date.now()}`,
        serviceId: serviceId,
        buyerId: currentUser.id,
        providerId: service.providerId,
        status: 'requested',
        createdAt: new Date().toISOString().split('T')[0],
    };
    setServiceOrders(prev => [newOrder, ...prev]);
    setServiceDetailOpen(false);
    showMessage("リクエスト完了", "サービスについて相談リクエストを送信しました。提供者からの連絡をお待ちください。");
  };
  
  const handleUpdateServiceOrderStatus = (orderId: string, newStatus: ServiceOrder['status']) => {
    setServiceOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
    ));
    let message = "";
    switch(newStatus) {
        case "accepted": message = "依頼を承認しました。"; break;
        case "completed": message = "サービスを完了にしました。"; break;
        case "cancelled": message = "依頼をキャンセルしました。"; break;
    }
    if (message) showMessage("ステータス更新", message);
  };

  const handleAddServiceReview = (reviewData: Omit<ServiceReview, 'id' | 'createdAt'>) => {
    const newReview: ServiceReview = {
        ...reviewData,
        id: `srev${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
    };
    setServiceReviews(prev => [newReview, ...prev]);
    showMessage("投稿完了", "サービスの口コミを投稿しました。ご協力ありがとうございます！");
  };
  
  const handleOpenChat = (session: ChatSession) => {
    setSelectedChatSession(session);
    setChatModalOpen(true);
    
    // Mark messages as read
    if (currentUser) {
        setChatMessages(prev => prev.map(msg => 
            (msg.orderId === session.id && msg.receiverId === currentUser.id && !msg.isRead) 
            ? { ...msg, isRead: true } 
            : msg
        ));
    }
  };
  
  const handleSendMessage = (sessionId: string, messageText: string) => {
    if (!currentUser || !selectedChatSession) return;

    const newMessage: ChatMessage = {
      id: `msg${Date.now()}`,
      orderId: sessionId, // Reuse orderId for session ID (works for both orders and bookings)
      senderId: currentUser.id,
      receiverId: currentUser.id === selectedChatSession.providerId ? selectedChatSession.buyerId : selectedChatSession.providerId,
      message: messageText,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setChatMessages(prev => [...prev, newMessage]);
  };
  
  const handleShowQR = (title: string, data: string) => {
      setQrData({ title, data });
      setQRModalOpen(true);
  };

  const handleScanTicket = (ticketId: string) => {
    // Ticket ID format: ticket-{eventId}-{userId}
    const parts = ticketId.split('-');
    if (parts.length < 3) {
        showMessage("エラー", "無効なチケットIDです。");
        return;
    }
    const eventId = parts[1] + (parts.length > 3 ? '-' + parts[2] : ''); // simple join for ids with hyphens if any, though ID structure might vary
    // More robust parsing assuming format `ticket-{eventId}-{userId}` where eventId might have hyphens? 
    // Actually our ID generation is `ticket-${event.id}-${currentUser.id}`.
    // Let's iterate reservations to find a match.
    
    const reservation = eventReservations.find(r => `ticket-${r.eventId}-${r.userId}` === ticketId);
    
    if (reservation) {
        const user = users.find(u => u.id === reservation.userId);
        const event = events.find(e => e.id === reservation.eventId);
        showMessage("受付完了", `${user?.name} 様\n${event?.name}\n\nチェックインを確認しました。`);
        setScanModalOpen(false);
    } else {
        showMessage("エラー", "予約が見つかりません。チケットIDを確認してください。");
    }
  };

  // 主催者用：申込ステータス更新
  const handleRegistrationStatusUpdate = (registrationId: string, status: RegistrationStatus) => {
      setEventRegistrations(prev => prev.map(r => r.id === registrationId ? { ...r, status } : r));
      const statusText = status === RegistrationStatus.APPROVED ? '承認' : '却下';
      showMessage(`${statusText}完了`, `出展申込を${statusText}しました。`);
  };

  const handleOpenEventApplications = (event: Event) => {
      setSelectedEventForApplications(event);
      setEventApplicationsModalOpen(true);
  };


  const HomePage = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    // Event filters
    const [eventSearchFilters, setEventSearchFilters] = useState({
      startDate: '',
      endDate: '',
      prefecture: '',
      keyword: '',
      includePast: false,
    });

    const handleEventFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      if (type === 'checkbox') {
          const { checked } = e.target as HTMLInputElement;
          setEventSearchFilters(prev => ({ ...prev, [name]: checked }));
      } else {
          setEventSearchFilters(prev => ({ ...prev, [name]: value }));
      }
    };

    const resetEventFilters = () => {
        setEventSearchFilters({
            startDate: '',
            endDate: '',
            prefecture: '',
            keyword: '',
            includePast: false,
        });
    };

    const filteredEvents = events
      .filter(event => {
        const { startDate, endDate, prefecture, keyword, includePast } = eventSearchFilters;
        const lowerKeyword = keyword.toLowerCase();
        const today = new Date().toISOString().split('T')[0];

        if (!includePast && event.date < today) {
            return false;
        }

        const startDateMatch = !startDate || event.date >= startDate;
        const endDateMatch = !endDate || event.date <= endDate;
        const prefectureMatch = !prefecture || event.location.includes(prefecture);
        const keywordMatch = !keyword ||
          event.name.toLowerCase().includes(lowerKeyword) ||
          event.description.toLowerCase().includes(lowerKeyword);

        return startDateMatch && endDateMatch && prefectureMatch && keywordMatch;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Service filters
    const [serviceSearchFilters, setServiceSearchFilters] = useState({
        keyword: '',
        category: '',
        maxPrice: '',
        deliveryMethod: '',
        prefecture: '', // Added prefecture filter state
    });

    const handleServiceFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setServiceSearchFilters(prev => ({ ...prev, [name]: value }));
    };

    const resetServiceFilters = () => {
        setServiceSearchFilters({
            keyword: '',
            category: '',
            maxPrice: '',
            deliveryMethod: '',
            prefecture: '',
        });
    };

    const filteredServices = services.filter(service => {
        const { keyword, category, maxPrice, deliveryMethod, prefecture } = serviceSearchFilters;
        const lowerKeyword = keyword.toLowerCase();

        const keywordMatch = !keyword || service.title.toLowerCase().includes(lowerKeyword) || service.description.toLowerCase().includes(lowerKeyword);
        const categoryMatch = !category || service.category === category;
        const priceMatch = !maxPrice || service.price <= parseInt(maxPrice, 10);
        const deliveryMatch = !deliveryMethod || service.deliveryMethod === deliveryMethod || service.deliveryMethod === 'both';
        // Check prefecture match if selected
        const prefectureMatch = !prefecture || service.location.includes(prefecture);
        
        return keywordMatch && categoryMatch && priceMatch && deliveryMatch && prefectureMatch;
    });

    return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-16 mt-8">
                <h1 className="text-4xl md:text-5xl font-bold text-stone-800 tracking-[0.2em] font-serif leading-tight">幸せが広がる、<br className="md:hidden"/>ご縁結び</h1>
                <p className="mt-6 text-lg text-stone-600 max-w-2xl mx-auto font-light tracking-wide">想いが詰まった出会いを、<br/>特別な空間でお楽しみください。</p>
                <div className="mt-8 flex justify-center">
                    <div className="w-16 h-1 bg-teal-800 opacity-50"></div>
                </div>
            </div>
            
            <div className="bg-white rounded shadow-sm border border-stone-200 mb-12 overflow-hidden">
                <div className="flex border-b border-stone-200">
                    <button 
                        onClick={() => { setSearchType('events'); setIsFilterOpen(false); }} 
                        className={`flex-1 py-5 text-center font-bold text-lg transition-all tracking-widest ${searchType === 'events' ? 'text-teal-800 border-b-2 border-teal-800 bg-teal-50/50' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'}`}
                    >
                        イベント・マルシェを探す
                    </button>
                    <button 
                        onClick={() => { setSearchType('services'); setIsFilterOpen(false); }} 
                        className={`flex-1 py-5 text-center font-bold text-lg transition-all tracking-widest ${searchType === 'services' ? 'text-indigo-800 border-b-2 border-indigo-800 bg-indigo-50/50' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'}`}
                    >
                        サービスを探す
                    </button>
                </div>
                
                <div className="p-8">
                    {/* Keyword Input Area */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-grow relative">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                name="keyword"
                                value={searchType === 'events' ? eventSearchFilters.keyword : serviceSearchFilters.keyword}
                                onChange={searchType === 'events' ? handleEventFilterChange : handleServiceFilterChange}
                                placeholder={searchType === 'events' ? "イベント名、キーワードで検索..." : "サービス名、キーワードで検索..."}
                                className="block w-full pl-10 pr-3 py-3 border border-stone-300 rounded leading-5 bg-stone-50 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-shadow font-light"
                            />
                        </div>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center justify-center px-6 py-3 border border-stone-300 rounded text-sm font-medium transition-colors tracking-wide ${isFilterOpen ? 'bg-stone-200 text-stone-900' : 'bg-white text-stone-700 hover:bg-stone-100'}`}
                        >
                            <span className="mr-2">絞り込み</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 ${isFilterOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    {/* Expanded Filters */}
                    {isFilterOpen && (
                        <div className="mt-6 pt-6 border-t border-stone-200 animate-fade-in-down">
                            {searchType === 'events' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1 tracking-wide">期間</label>
                                            <div className="flex items-center space-x-2">
                                                <input type="date" name="startDate" value={eventSearchFilters.startDate} onChange={handleEventFilterChange} className="block w-full px-3 py-2 bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"/>
                                                <span className="text-stone-400">〜</span>
                                                <input type="date" name="endDate" value={eventSearchFilters.endDate} onChange={handleEventFilterChange} className="block w-full px-3 py-2 bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"/>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1 tracking-wide">都道府県</label>
                                            <select name="prefecture" value={eventSearchFilters.prefecture} onChange={handleEventFilterChange} className="block w-full px-3 py-2 bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500">
                                                <option value="">すべて</option>
                                                {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input type="checkbox" name="includePast" checked={eventSearchFilters.includePast} onChange={handleEventFilterChange} className="h-4 w-4 text-teal-700 border-stone-300 rounded focus:ring-teal-500"/>
                                            <span className="text-sm text-stone-700">過去のイベントを含める</span>
                                        </label>
                                        <button onClick={resetEventFilters} className="text-sm text-stone-500 hover:text-red-700 underline">条件をクリア</button>
                                    </div>
                                </div>
                            )}

                            {searchType === 'services' && (
                                <div className="space-y-4">
                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1 tracking-wide">カテゴリ</label>
                                            <select name="category" value={serviceSearchFilters.category} onChange={handleServiceFilterChange} className="block w-full px-3 py-2 bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                                <option value="">すべて</option>
                                                {Object.values(ServiceCategory).map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1 tracking-wide">都道府県</label>
                                            <select name="prefecture" value={serviceSearchFilters.prefecture} onChange={handleServiceFilterChange} className="block w-full px-3 py-2 bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                                <option value="">すべて</option>
                                                {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1 tracking-wide">上限価格</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2 text-stone-500">¥</span>
                                                <input type="number" name="maxPrice" value={serviceSearchFilters.maxPrice} onChange={handleServiceFilterChange} placeholder="例: 5000" min="0" className="block w-full pl-8 pr-3 py-2 bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1 tracking-wide">提供方法</label>
                                            <div className="flex items-center space-x-4 mt-2">
                                                <label className="flex items-center"><input type="radio" name="deliveryMethod" value="" checked={serviceSearchFilters.deliveryMethod === ''} onChange={handleServiceFilterChange} className="h-4 w-4 text-indigo-700 focus:ring-indigo-500 border-stone-300"/> <span className="ml-2 text-sm">すべて</span></label>
                                                <label className="flex items-center"><input type="radio" name="deliveryMethod" value="online" checked={serviceSearchFilters.deliveryMethod === 'online'} onChange={handleServiceFilterChange} className="h-4 w-4 text-indigo-700 focus:ring-indigo-500 border-stone-300"/> <span className="ml-2 text-sm">オンライン</span></label>
                                                <label className="flex items-center"><input type="radio" name="deliveryMethod" value="offline" checked={serviceSearchFilters.deliveryMethod === 'offline'} onChange={handleServiceFilterChange} className="h-4 w-4 text-indigo-700 focus:ring-indigo-500 border-stone-300"/> <span className="ml-2 text-sm">対面</span></label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button onClick={resetServiceFilters} className="text-sm text-stone-500 hover:text-red-700 underline">条件をクリア</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-12">
                <h2 className="text-3xl font-bold text-stone-800 mb-8 border-l-4 border-indigo-800 pl-4 py-1 font-serif tracking-widest">注目のサービス</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.slice(0, 3).map(service => (
                        <ServiceCard key={service.id} service={service} provider={providers.find(p => p.id === service.providerId)!} onSelect={handleSelectService}/>
                    ))}
                </div>
                 <div className="text-center mt-8">
                    <button onClick={() => { setView('home'); setSearchType('services'); }} className="bg-white border border-stone-300 text-stone-600 px-8 py-3 rounded hover:bg-stone-50 transition-colors tracking-widest text-sm font-medium">すべてのサービスを見る</button>
                </div>
            </div>
            
            {searchType === 'events' && (
                <>
                    <h2 className="text-3xl font-bold text-stone-800 mb-8 border-l-4 border-teal-800 pl-4 py-1 font-serif tracking-widest pt-12">イベント・マルシェ一覧</h2>
                    {filteredEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredEvents.map((event) => (
                            <EventCard
                                key={event.id} event={event} user={currentUser}
                                reservations={eventReservations} providers={providers}
                                registrations={eventRegistrations}
                                onMemberReserve={handleMemberReserve}
                                onProviderRegister={handleProviderRegisterClick}
                                onProviderSelect={handleSelectProvider}
                                onShowAllProviders={handleShowAllProviders}
                            />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded border border-stone-200">
                            <h3 className="text-xl font-medium text-stone-700">お探しのイベントは見つかりませんでした</h3>
                            <p className="text-stone-500 mt-2 font-light">検索条件を変更して、もう一度お試しください。</p>
                        </div>
                    )}
                </>
            )}

            {searchType === 'services' && (
                <>
                    <h2 className="text-3xl font-bold text-stone-800 mb-8 border-l-4 border-indigo-800 pl-4 py-1 font-serif tracking-widest pt-12">検索結果</h2>
                    {filteredServices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredServices.map((service) => (
                            <ServiceCard
                                key={service.id} service={service} 
                                provider={providers.find(p => p.id === service.providerId)!} 
                                onSelect={handleSelectService}
                            />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded border border-stone-200">
                            <h3 className="text-xl font-medium text-stone-700">お探しのサービスは見つかりませんでした</h3>
                            <p className="text-stone-500 mt-2 font-light">検索条件を変更して、もう一度お試しください。</p>
                        </div>
                    )}
                </>
            )}
        </main>
    );
  };
  // ... (dashboard rendering remains same with user.profileImageUrl used in profile section)
  const DashboardPage = () => {
    if (!currentUser) return <div className="p-8 text-center text-stone-500">ログインしてください</div>;

    const myEventReservations = eventReservations.filter(r => r.userId === currentUser.id);
    const myServiceOrdersAsBuyer = serviceOrders.filter(o => o.buyerId === currentUser.id);
    const myBookingsAsBuyer = timeSlotBookings.filter(b => b.userId === currentUser.id);
    
    const myRegistrations = eventRegistrations.filter(r => r.providerId === currentUser.id);
    const myServices = services.filter(s => s.providerId === currentUser.id);
    const myReceivedServiceOrders = serviceOrders.filter(o => o.providerId === currentUser.id);

    // 主催しているイベント
    const myHostedEvents = events.filter(e => e.ownerId === currentUser.id);
    
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editName, setEditName] = useState(currentUser.name);

    const handleSaveProfile = () => {
        if (!editName.trim()) return;
        setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, name: editName } : u));
        setCurrentUser(prev => prev ? { ...prev, name: editName } : null);
        setIsEditingProfile(false);
        showMessage("プロフィール更新", "ユーザー名を更新しました。");
    };

    return (
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-8 font-serif tracking-widest">マイページ</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile & Settings */}
          <div className="space-y-6">
             {/* Profile Card */}
             <div className="bg-white rounded shadow-sm p-6 border border-stone-200">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-stone-100 p-1 rounded-full shrink-0">
                        {currentUser.profileImageUrl ? (
                            <img src={currentUser.profileImageUrl} alt={currentUser.name} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                            <UserCircleIcon className="w-12 h-12 text-stone-500" />
                        )}
                    </div>
                    <div className="flex-grow min-w-0">
                        {isEditingProfile ? (
                            <div className="flex flex-col gap-2">
                                <input 
                                    type="text" 
                                    value={editName} 
                                    onChange={e => setEditName(e.target.value)} 
                                    className="border border-stone-300 rounded px-2 py-1 text-sm w-full"
                                />
                                <div className="flex gap-2">
                                    <button onClick={handleSaveProfile} className="bg-teal-600 text-white px-2 py-1 rounded text-xs hover:bg-teal-700">保存</button>
                                    <button onClick={() => { setIsEditingProfile(false); setEditName(currentUser.name); }} className="bg-stone-200 text-stone-700 px-2 py-1 rounded text-xs hover:bg-stone-300">取消</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-stone-800 truncate">{currentUser.name}</h2>
                                <button onClick={() => setIsEditingProfile(true)} className="text-stone-400 hover:text-teal-600 ml-2">
                                    <EditIcon className="w-4 h-4"/>
                                </button>
                            </div>
                        )}
                        <span className="text-xs uppercase bg-stone-100 text-stone-500 px-2 py-1 rounded inline-block mt-1">{currentUser.role}</span>
                    </div>
                </div>
                {/* ... (rest of profile card) */}
                
                {/* LINE Settings */}
                <div className="border-t border-stone-100 pt-4 mt-4">
                    <h3 className="font-semibold text-stone-700 mb-2 text-sm">LINE連携設定</h3>
                    {currentUser.isLineLinked ? (
                        <div className="space-y-3">
                            <p className="text-green-600 text-sm flex items-center"><span className="mr-2">●</span>連携済み</p>
                            <div className="space-y-2">
                                <label className="flex items-center justify-between text-sm text-stone-600">
                                    <span>イベント予約通知</span>
                                    <input type="checkbox" checked={currentUser.lineNotificationSettings?.eventReservations} onChange={(e) => handleToggleLineNotification('eventReservations', e.target.checked)} className="rounded text-green-600 focus:ring-green-500"/>
                                </label>
                                <label className="flex items-center justify-between text-sm text-stone-600">
                                    <span>お気に入り更新通知</span>
                                    <input type="checkbox" checked={currentUser.lineNotificationSettings?.favoriteProviderUpdates} onChange={(e) => handleToggleLineNotification('favoriteProviderUpdates', e.target.checked)} className="rounded text-green-600 focus:ring-green-500"/>
                                </label>
                                <label className="flex items-center justify-between text-sm text-stone-600">
                                    <span>サービス予約/依頼通知</span>
                                    <input type="checkbox" checked={currentUser.lineNotificationSettings?.serviceBookings} onChange={(e) => handleToggleLineNotification('serviceBookings', e.target.checked)} className="rounded text-green-600 focus:ring-green-500"/>
                                </label>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="text-stone-500 text-xs mb-2">LINE連携すると、予約確認やリマインド通知を受け取れます。</p>
                            <button onClick={handleLinkLine} className="w-full bg-[#06C755] text-white py-2 rounded text-sm font-bold hover:bg-[#05b34c] transition-colors">LINEと連携する</button>
                        </div>
                    )}
                </div>
             </div>
             
             {/* Favorites (Member only) */}
             {currentUser.role === UserRole.MEMBER && (
                 <div className="bg-white rounded shadow-sm p-6 border border-stone-200">
                    <h3 className="font-semibold text-stone-700 mb-4 flex items-center">
                        <StarIcon className="w-5 h-5 mr-2 text-yellow-400" filled />
                        お気に入り ({favorites.filter(f => f.userId === currentUser.id).length})
                    </h3>
                    <div className="space-y-3">
                        {favorites.filter(f => f.userId === currentUser.id).map(fav => {
                            const provider = providers.find(p => p.id === fav.providerId);
                            if (!provider) return null;
                            return (
                                <div key={fav.providerId} className="flex items-center justify-between p-2 bg-stone-50 rounded">
                                    <div className="flex items-center">
                                         {provider.profileImageUrl ? (
                                            <img src={provider.profileImageUrl} alt={provider.providerName} className="w-8 h-8 rounded-full object-cover mr-2" />
                                        ) : <StoreIcon className="w-8 h-8 text-stone-400 mr-2"/>}
                                        <span className="text-sm font-medium text-stone-700">{provider.providerName}</span>
                                    </div>
                                    <button onClick={() => handleToggleFavorite(provider.id)} className="text-stone-400 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
                                </div>
                            );
                        })}
                        {favorites.filter(f => f.userId === currentUser.id).length === 0 && <p className="text-xs text-stone-400">お気に入りの出展者はまだいません。</p>}
                    </div>
                 </div>
             )}
          </div>
          
          {/* Center & Right Column: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Notifications / Messages */}
            <div className="bg-white rounded shadow-sm p-6 border border-stone-200">
                 <div className="flex items-center gap-2 mb-4">
                     <h2 className="text-xl font-bold text-stone-800 font-serif">メッセージ / 通知</h2>
                     {hasUnreadNotifications && (
                         <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">New</span>
                     )}
                 </div>
                 <div className="space-y-2">
                    {/* Service Orders */}
                    {/* Fixed: Removed .filter(o => o.status !== 'completed' ...) to show history, preventing lost messages */}
                    {[...myServiceOrdersAsBuyer, ...myReceivedServiceOrders].filter(o => o.status !== 'cancelled').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => {
                         const service = services.find(s => s.id === order.serviceId);
                         const otherUser = currentUser.id === order.buyerId 
                            ? providers.find(p => p.id === order.providerId)?.providerName 
                            : users.find(u => u.id === order.buyerId)?.name;
                         
                         const unreadCount = chatMessages.filter(m => m.orderId === order.id && m.receiverId === currentUser.id && !m.isRead).length;
                         const isPendingRequest = currentUser.id === order.providerId && order.status === 'requested';

                         return (
                             <div key={order.id} className="p-3 bg-indigo-50 border border-indigo-100 rounded flex justify-between items-center relative">
                                 <div>
                                     <div className="flex items-center gap-2">
                                         <p className="text-sm font-semibold text-indigo-900">{service?.title}</p>
                                         {isPendingRequest && <span className="bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold">新規依頼</span>}
                                         {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{unreadCount}</span>}
                                     </div>
                                     <p className="text-xs text-indigo-700">相手: {otherUser} | ステータス: {renderServiceStatus(order.status)}</p>
                                 </div>
                                 <button onClick={() => handleOpenChat({ id: order.id, providerId: order.providerId, buyerId: order.buyerId, title: service?.title || 'サービス' })} className="text-indigo-600 hover:text-indigo-800 relative">
                                     <ChatBubbleIcon className="w-6 h-6" />
                                     {unreadCount > 0 && <span className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-red-500" />}
                                 </button>
                             </div>
                         )
                    })}
                     {/* My Bookings */}
                     {myBookingsAsBuyer.map(booking => {
                         const event = events.find(e => e.id === booking.eventId);
                         const provider = providers.find(p => p.id === booking.providerId);
                         const registration = eventRegistrations.find(r => r.eventId === booking.eventId && r.providerId === booking.providerId);
                         const timeSlot = registration?.timeSlots.find(ts => ts.id === booking.timeSlotId) || {startTime: '?', endTime: '?'};
                         return (
                            <div key={booking.id} className="p-3 bg-teal-50 border border-teal-100 rounded flex justify-between items-center">
                                 <div>
                                     <p className="text-sm font-semibold text-teal-900">予約: {event?.name}</p>
                                     <p className="text-xs text-teal-700">{provider?.providerName} | {timeSlot.startTime}~{timeSlot.endTime}</p>
                                 </div>
                                 <button onClick={() => handleCancelTimeSlotBooking(booking.id)} className="text-xs text-red-500 hover:underline">キャンセル</button>
                             </div>
                         );
                     })}
                     {/* Provider: Received Bookings */}
                     {currentUser.role === UserRole.PROVIDER && receivedBookings.map(booking => {
                         const event = events.find(e => e.id === booking.eventId);
                         const user = users.find(u => u.id === booking.userId);
                         const registration = eventRegistrations.find(r => r.eventId === booking.eventId && r.providerId === currentUser.id);
                         const timeSlot = registration?.timeSlots.find(ts => ts.id === booking.timeSlotId);

                         return (
                            <div key={booking.id} className="p-3 bg-green-50 border border-green-100 rounded flex justify-between items-center">
                                 <div>
                                     <p className="text-sm font-semibold text-green-900">予約受付: {event?.name}</p>
                                     <p className="text-xs text-green-700">予約者: {user?.name} | {timeSlot?.startTime}~{timeSlot?.endTime}</p>
                                 </div>
                            </div>
                         );
                     })}

                     {/* Empty states */}
                     {myServiceOrdersAsBuyer.length === 0 && myReceivedServiceOrders.length === 0 && myBookingsAsBuyer.length === 0 && receivedBookings.length === 0 && (
                         <p className="text-stone-500 text-sm">現在進行中の取引やメッセージはありません。</p>
                     )}
                 </div>
            </div>

            {/* MEMBER: Tickets */}
            {currentUser.role === UserRole.MEMBER && (
                <div className="bg-white rounded shadow-sm p-6 border border-stone-200">
                    <h2 className="text-xl font-bold text-stone-800 mb-4 font-serif">参加予定のイベント (チケット)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myEventReservations.map(res => {
                            const event = events.find(e => e.id === res.eventId);
                            if (!event) return null;
                            const ticketId = `ticket-${event.id}-${currentUser.id}`;
                            return (
                                <div key={res.eventId} className="border border-stone-200 rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow bg-stone-50">
                                    <div>
                                        <h3 className="font-bold text-stone-800 mb-1">{event.name}</h3>
                                        <p className="text-sm text-stone-600 flex items-center mb-1"><CalendarIcon className="w-4 h-4 mr-1"/>{event.date} {event.startTime}</p>
                                        <p className="text-xs text-stone-500">{event.location}</p>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <button onClick={() => handleShowQR(event.name, ticketId)} className="flex-1 bg-stone-800 text-white py-2 rounded text-sm flex items-center justify-center hover:bg-stone-700 transition-colors">
                                            <QrcodeIcon className="w-4 h-4 mr-2"/>チケット表示
                                        </button>
                                        <button onClick={() => handleCancelEventReservation(event.id)} className="px-3 py-2 text-xs text-stone-500 hover:text-red-500 border border-stone-300 rounded hover:bg-white transition-colors">
                                            キャンセル
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {myEventReservations.length === 0 && <p className="text-stone-500 text-sm col-span-2">参加予定のイベントはありません。</p>}
                    </div>
                </div>
            )}
            
            {/* ORGANIZER: Hosted Events Management */}
            {(currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.PROVIDER) && myHostedEvents.length > 0 && (
                <div className="bg-white rounded shadow-sm p-6 border border-stone-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-stone-800 font-serif">主催イベント管理</h2>
                        <button onClick={() => setEventFormOpen(true)} className="text-sm text-teal-700 hover:underline flex items-center"><PlusIcon className="w-4 h-4 mr-1"/>新規作成</button>
                    </div>
                    <div className="space-y-4">
                        {myHostedEvents.map(event => {
                             const pendingCount = eventRegistrations.filter(r => r.eventId === event.id && r.status === RegistrationStatus.SUBMITTED).length;
                             return (
                                <div key={event.id} className="border border-stone-200 rounded p-4 flex justify-between items-center bg-stone-50">
                                    <div>
                                        <h3 className="font-bold text-stone-800">{event.name}</h3>
                                        <p className="text-xs text-stone-500">{event.date} | {event.location}</p>
                                        {pendingCount > 0 && (
                                            <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full mt-1 font-bold">承認待ち: {pendingCount}件</span>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => handleOpenEventApplications(event)} 
                                        className="text-sm bg-white border border-stone-300 px-3 py-1 rounded hover:bg-stone-100 text-stone-600 flex items-center"
                                    >
                                        申込管理
                                    </button>
                                </div>
                             );
                        })}
                    </div>
                </div>
            )}

            {/* PROVIDER: Registrations & Services */}
            {(currentUser.role === UserRole.PROVIDER || currentUser.role === UserRole.ADMIN) && (
                <div className="space-y-8">
                     {/* Scan Button for Providers */}
                     <div className="bg-stone-800 text-white rounded shadow-sm p-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold font-serif mb-1">QR受付</h2>
                            <p className="text-stone-300 text-sm">参加者のチケットQRコードをスキャンして受付を行います。</p>
                        </div>
                        <button onClick={() => setScanModalOpen(true)} className="bg-white text-stone-900 px-6 py-3 rounded font-bold hover:bg-stone-100 transition-colors flex items-center">
                            <QrcodeIcon className="w-5 h-5 mr-2"/> スキャン起動
                        </button>
                     </div>

                    <div className="bg-white rounded shadow-sm p-6 border border-stone-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-stone-800 font-serif">出展イベント管理</h2>
                            <button onClick={() => setView('home')} className="text-sm text-teal-700 hover:underline">イベントを探す</button>
                        </div>
                        <div className="space-y-4">
                            {myRegistrations.map(reg => {
                                const event = events.find(e => e.id === reg.eventId);
                                if (!event) return null;
                                return (
                                    <div key={reg.id} className="border border-stone-200 rounded p-4 flex justify-between items-center bg-stone-50">
                                        <div>
                                            <h3 className="font-bold text-stone-800">{event.name}</h3>
                                            <p className="text-xs text-stone-500">{event.date} | ステータス: <span className={`font-semibold ${reg.status === RegistrationStatus.APPROVED ? 'text-green-600' : 'text-yellow-600'}`}>{reg.status === RegistrationStatus.APPROVED ? '承認済み' : reg.status === RegistrationStatus.SUBMITTED ? '承認待ち' : '下書き'}</span></p>
                                        </div>
                                        <button onClick={() => handleProviderRegisterClick(event.id, reg.id)} className="text-sm bg-white border border-stone-300 px-3 py-1 rounded hover:bg-stone-100 text-stone-600">
                                            編集
                                        </button>
                                    </div>
                                );
                            })}
                             {myRegistrations.length === 0 && <p className="text-stone-500 text-sm">出展登録しているイベントはありません。</p>}
                        </div>
                    </div>
                    
                    <div className="bg-white rounded shadow-sm p-6 border border-stone-200">
                         <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-stone-800 font-serif">出品サービス管理</h2>
                            <button onClick={handleAddServiceClick} className="text-sm text-indigo-700 hover:underline flex items-center"><PlusIcon className="w-4 h-4 mr-1"/>新規出品</button>
                        </div>
                        <div className="space-y-4">
                            {myServices.map(service => (
                                <div key={service.id} className="border border-stone-200 rounded p-4 flex gap-4 bg-stone-50 items-center">
                                    <img src={service.imageUrl} alt={service.title} className="w-16 h-16 object-cover rounded bg-stone-200"/>
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-stone-800 text-sm">{service.title}</h3>
                                        <p className="text-xs text-stone-500 mt-1">{service.category} | &yen;{service.price.toLocaleString()}</p>
                                    </div>
                                    <div className="flex flex-col gap-2 shrink-0">
                                        <button onClick={() => handleSelectService(service)} className="text-xs bg-white border border-stone-300 px-3 py-1 rounded hover:bg-stone-100 text-stone-600 text-center">プレビュー</button>
                                        <button onClick={() => handleEditServiceClick(service)} className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-100 text-center flex items-center justify-center">
                                            <EditIcon className="w-3 h-3 mr-1"/>編集
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {myServices.length === 0 && <p className="text-stone-500 text-sm">出品しているサービスはありません。</p>}
                        </div>
                    </div>
                    
                    {/* Received Service Orders */}
                    {myReceivedServiceOrders.length > 0 && (
                         <div className="bg-white rounded shadow-sm p-6 border border-stone-200">
                            <h2 className="text-xl font-bold text-stone-800 font-serif mb-4">サービス依頼一覧</h2>
                            <div className="space-y-4">
                                {myReceivedServiceOrders.map(order => {
                                    const service = services.find(s => s.id === order.serviceId);
                                    const buyer = users.find(u => u.id === order.buyerId);
                                    return (
                                        <div key={order.id} className="border border-stone-200 rounded p-4 bg-stone-50">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold text-stone-800 text-sm">{service?.title}</h3>
                                                    <p className="text-xs text-stone-500">依頼者: {buyer?.name}</p>
                                                </div>
                                                {renderServiceStatus(order.status)}
                                            </div>
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button onClick={() => handleOpenChat({ id: order.id, providerId: order.providerId, buyerId: order.buyerId, title: service?.title || 'サービス' })} className="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded hover:bg-indigo-200 flex items-center">
                                                    <ChatBubbleIcon className="w-3 h-3 mr-1"/>メッセージ
                                                </button>
                                                {order.status === 'requested' && (
                                                    <button onClick={() => handleUpdateServiceOrderStatus(order.id, 'accepted')} className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">承認する</button>
                                                )}
                                                {order.status === 'accepted' && (
                                                    <button onClick={() => handleUpdateServiceOrderStatus(order.id, 'completed')} className="text-xs bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700">完了にする</button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                         </div>
                    )}
                </div>
            )}

          </div>
        </div>
      </main>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col font-serif bg-stone-50/50">
      <Header
        user={currentUser}
        onLoginClick={() => setAuthModalOpen(true)}
        onLogoutClick={handleLogout}
        onCreateEventClick={() => setEventFormOpen(true)}
        onCreateServiceClick={handleAddServiceClick}
        onDashboardClick={() => setView('dashboard')}
        onHomeClick={() => { setView('home'); setSearchType('events'); }}
        onServiceListClick={() => { setView('home'); setSearchType('services'); }}
        hasUnreadNotifications={hasUnreadNotifications}
      />
      {view === 'home' && <HomePage />}
      {view === 'dashboard' && <DashboardPage />}

      <Footer />
      {/* ... (Modals remain same) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
        onLineLogin={handleLineLogin}
        users={users}
      />
      <Modal isOpen={isEventFormOpen} onClose={() => setEventFormOpen(false)} title="新しい催しを作成">
        <EventForm onAddEvent={handleAddEvent} onClose={() => setEventFormOpen(false)} />
      </Modal>
      <Modal isOpen={isServiceFormOpen} onClose={() => setServiceFormOpen(false)} title={editingService ? "サービス編集" : "新しいサービスを出品"}>
        <ServiceForm 
            onAddService={handleAddService} 
            onUpdateService={handleUpdateService}
            initialService={editingService}
            onClose={() => setServiceFormOpen(false)} 
        />
      </Modal>
      <Modal isOpen={isRegistrationFormOpen} onClose={() => setRegistrationFormOpen(false)} title="出展申込">
        {registrationFormData && currentUser?.role === UserRole.PROVIDER && (
            <EventRegistrationForm
                event={events.find(e => e.id === registrationFormData.eventId)!}
                provider={providers.find(p => p.id === currentUser.id)!}
                currentUser={currentUser}
                existingRegistration={eventRegistrations.find(r => r.id === registrationFormData.registrationId)}
                onSave={handleSaveRegistration}
                onClose={() => setRegistrationFormOpen(false)}
                hasBookings={receivedBookings.some(b => b.eventId === registrationFormData.eventId)}
            />
        )}
      </Modal>
      {selectedProviderInfo && (
          <ProviderDetailModal
            isOpen={isProviderDetailOpen}
            onClose={() => setProviderDetailOpen(false)}
            provider={selectedProviderInfo.provider}
            registration={selectedProviderInfo.registration}
            events={events}
            registrations={eventRegistrations}
            bookings={timeSlotBookings}
            user={currentUser}
            users={users}
            onBookTimeSlot={handleBookTimeSlot}
            reviews={reviews}
            eventReservations={eventReservations}
            onAddReview={handleAddReview}
            isFavorite={currentUser ? favorites.some(f => f.userId === currentUser.id && f.providerId === selectedProviderInfo.provider.id) : false}
            onToggleFavorite={handleToggleFavorite}
          />
      )}
       {selectedEventForProviders && (
            <EventProvidersModal
                isOpen={isEventProvidersModalOpen}
                onClose={() => setEventProvidersModalOpen(false)}
                event={selectedEventForProviders}
                providers={providers}
                users={users}
                registrations={eventRegistrations}
                onProviderSelect={(provider, registration) => {
                    setEventProvidersModalOpen(false);
                    handleSelectProvider(provider, registration);
                }}
            />
        )}
       {selectedServiceInfo && (
            <ServiceDetailModal
                isOpen={isServiceDetailOpen}
                onClose={() => setServiceDetailOpen(false)}
                service={selectedServiceInfo.service}
                provider={selectedServiceInfo.provider}
                currentUser={currentUser}
                onRequestService={handleRequestService}
                reviews={serviceReviews}
                serviceOrders={serviceOrders}
                users={users}
                onAddReview={handleAddServiceReview}
            />
       )}
        <ChatModal
            isOpen={isChatModalOpen}
            onClose={() => setChatModalOpen(false)}
            session={selectedChatSession}
            currentUser={currentUser}
            messages={chatMessages.filter(m => m.orderId === selectedChatSession?.id)}
            onSendMessage={handleSendMessage}
            users={users}
            providers={providers}
      />
      {qrData && (
          <QRCodeModal 
            isOpen={isQRModalOpen} 
            onClose={() => setQRModalOpen(false)} 
            data={qrData.data} 
            title={qrData.title} 
          />
      )}
      <ScanModal
        isOpen={isScanModalOpen}
        onClose={() => setScanModalOpen(false)}
        onScan={handleScanTicket}
      />
      
      {/* Event Applications Modal (New) */}
      {selectedEventForApplications && (
        <EventApplicationsModal 
            isOpen={isEventApplicationsModalOpen}
            onClose={() => setEventApplicationsModalOpen(false)}
            event={selectedEventForApplications}
            registrations={eventRegistrations}
            providers={providers}
            onUpdateStatus={handleRegistrationStatusUpdate}
        />
      )}

      <Modal isOpen={isGenericModalOpen} onClose={() => setGenericModalOpen(false)} title={genericModalContent.title}>
        <p className="whitespace-pre-wrap">{genericModalContent.message}</p>
        <div className="text-right mt-4">
          <button onClick={() => setGenericModalOpen(false)} className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800 transition-colors">閉じる</button>
        </div>
      </Modal>
    </div>
  );
};

export default App;
