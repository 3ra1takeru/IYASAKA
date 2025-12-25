
import React, { useState } from 'react';
// Fix: Renamed Vendor to Provider to match types.ts
import { Provider, EventRegistration, OfferingType, TimeSlotBooking, User, UserRole, Review, EventReservation, Event, RegistrationStatus } from '../types';
import Modal from './Modal';
import { StoreIcon, InstagramIcon, GlobeAltIcon, StarIcon, UserCircleIcon, CalendarIcon } from './icons';

// Fix: Renamed interface to align with component name change.
interface ProviderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    // Fix: Changed vendor prop to provider with Provider type.
    provider: Provider;
    registration: EventRegistration;
    events: Event[];
    registrations: EventRegistration[];
    bookings: TimeSlotBooking[];
    user: User | null;
    users: User[];
    // Fix: Changed vendorId to providerId.
    onBookTimeSlot: (eventId: string, providerId: string, timeSlotId: string, bookingType: 'online' | '現地') => void;
    reviews: Review[];
    eventReservations: EventReservation[];
    onAddReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
    isFavorite: boolean;
    // Fix: Changed vendorId to providerId.
    onToggleFavorite: (providerId: string) => void;
}

const StarRatingDisplay = ({ rating, className = "w-5 h-5" }: { rating: number, className?: string }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <StarIcon key={i} className={`${className} ${i < rating ? 'text-yellow-400' : 'text-stone-300'}`} filled={i < rating} />
    ))}
  </div>
);

// Fix: Renamed component from VendorDetailModal to ProviderDetailModal and updated props.
const ProviderDetailModal: React.FC<ProviderDetailModalProps> = ({ isOpen, onClose, provider, registration, events, registrations, bookings, user, users, onBookTimeSlot, reviews, eventReservations, onAddReview, isFavorite, onToggleFavorite }) => {
    
    const isBookable = user?.role === UserRole.MEMBER;
    // Fix: Changed vendor to provider.
    const providerUser = users.find(u => u.id === provider.id);
    const [selectedSlot, setSelectedSlot] = useState<any | null>(null);

    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    // Fix: Changed vendorId to providerId and vendor to provider.
    const providerReviews = reviews.filter(r => r.providerId === provider.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const averageRating = providerReviews.length > 0 ? providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length : 0;
    
    const hasReservedEvent = user ? eventReservations.some(r => r.userId === user.id && r.eventId === registration.eventId) : false;
    const hasAlreadyReviewed = user ? providerReviews.some(r => r.userId === user.id && r.eventId === registration.eventId) : false;
    const canPostReview = user?.role === UserRole.MEMBER && hasReservedEvent && !hasAlreadyReviewed;
    
    const otherEvents = registrations
      .filter(r => 
        // Fix: Changed vendorId to providerId and vendor to provider.
        r.providerId === provider.id && 
        r.status === RegistrationStatus.APPROVED && 
        r.eventId !== registration.eventId
      )
      .map(r => events.find(e => e.id === r.eventId))
      .filter((e): e is Event => e !== undefined);


    const handleSlotClick = (slot: any) => {
        if (registration.isOnlineBookingEnabled) {
            setSelectedSlot(slot);
        } else {
            // Fix: Changed vendor to provider.
            onBookTimeSlot(registration.eventId, provider.id, slot.id, '現地');
        }
    };
    
    const confirmBooking = (bookingType: 'online' | '現地') => {
        if (selectedSlot) {
            // Fix: Changed vendor to provider.
            onBookTimeSlot(registration.eventId, provider.id, selectedSlot.id, bookingType);
            setSelectedSlot(null);
        }
    };
    
    const handleAddReview = () => {
        if (newRating > 0 && newComment.trim() && user) {
            // Fix: Changed vendorId to providerId and vendor to provider.
            onAddReview({
                providerId: provider.id,
                userId: user.id,
                eventId: registration.eventId,
                rating: newRating,
                comment: newComment,
            });
            setNewRating(0);
            setNewComment('');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
             <div className="space-y-4 relative max-h-[70vh] overflow-y-auto pr-2">
                <div className="flex justify-between items-center -mt-2 mb-2">
                    {/* Fix: Changed stallName to providerName. */}
                    <h2 className="text-2xl font-bold text-green-800">{provider.providerName}</h2>
                    {user?.role === UserRole.MEMBER && (
                        <button
                            // Fix: Changed vendor to provider.
                            onClick={() => onToggleFavorite(provider.id)}
                            className={`p-2 rounded-full transition-colors duration-200 ${isFavorite ? 'text-yellow-400 hover:bg-yellow-100' : 'text-stone-400 hover:bg-stone-100'}`}
                            aria-label={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
                        >
                            <StarIcon className="w-7 h-7" filled={isFavorite} />
                        </button>
                    )}
                </div>

                <div className="flex items-start space-x-4">
                    {/* Fix: Changed stallName to providerName and vendor to provider. */}
                    {provider.profileImageUrl ? (
                        <img src={provider.profileImageUrl} alt={provider.providerName} className="w-16 h-16 rounded-full object-cover border-2 border-stone-200" />
                    ) : (
                        <StoreIcon className="w-10 h-10 text-stone-400 mt-1"/>
                    )}
                    <div>
                        {/* Fix: Changed vendor to provider. */}
                        <h3 className="font-bold text-lg text-stone-800">{provider.name}</h3>
                        <p className="text-stone-600">{provider.description}</p>
                        {providerUser?.instagramId && (
                            <a href={`https://instagram.com/${providerUser.instagramId}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-stone-500 hover:text-pink-600 mt-1 transition-colors">
                                <InstagramIcon className="w-4 h-4 mr-1" />
                                {providerUser.instagramId}
                            </a>
                        )}
                    </div>
                </div>

                <div className="pt-4 border-t">
                    {registration.offeringType === OfferingType.GOODS && (
                        <div>
                            <h4 className="font-semibold text-stone-800 mb-2">取扱商品</h4>
                            {registration.products.length > 0 ? (
                                <div className="space-y-3">
                                    {registration.products.map(product => (
                                        <div key={product.id} className="flex items-center space-x-4">
                                            <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-md object-cover"/>
                                            <div>
                                                <p className="font-semibold">{product.name} - &yen;{product.price}</p>
                                                <p className="text-sm text-stone-600">{product.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-sm text-stone-500">商品情報は準備中です。</p>}
                        </div>
                    )}
                    {registration.offeringType === OfferingType.SERVICE && (
                        <div>
                            <div className="flex items-center mb-2">
                                <h4 className="font-semibold text-stone-800">予約可能な時間</h4>
                                {registration.isOnlineBookingEnabled && (
                                    <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full ml-2 font-medium">オンライン対応可</span>
                                )}
                            </div>
                            {!isBookable && <p className="text-sm text-stone-500 mb-2">会員としてログインすると予約ができます。</p>}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {registration.timeSlots.map(slot => {
                                    const isBooked = bookings.some(b => b.timeSlotId === slot.id);
                                    const myBooking = bookings.find(b => b.timeSlotId === slot.id && b.userId === user?.id);
                                    return (
                                        <button 
                                            key={slot.id}
                                            disabled={!isBookable || (isBooked && !myBooking)}
                                            onClick={() => handleSlotClick(slot)}
                                            className={`p-2 rounded-md text-center text-sm font-medium transition-colors 
                                            ${myBooking ? 'bg-green-600 text-white' : ''}
                                            ${isBooked && !myBooking ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : ''}
                                            ${!isBooked ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed' : ''}
                                            `}
                                        >
                                            {slot.startTime} - {slot.endTime}
                                            {myBooking && <span className="block text-xs">({myBooking.bookingType}で予約済)</span>}
                                            {isBooked && !myBooking && <span className="block text-xs">(予約不可)</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Other Events Section */}
                {otherEvents.length > 0 && (
                    <div className="pt-4 border-t">
                        <h4 className="font-semibold text-stone-800 mb-2">他の出展イベント</h4>
                        <ul className="space-y-2">
                            {otherEvents.map(event => (
                                <li key={event.id} className="bg-stone-50 p-3 rounded-md">
                                    <p className="font-semibold text-sm text-stone-700">{event.name}</p>
                                    <div className="flex items-center text-xs text-stone-500 mt-1">
                                        <CalendarIcon className="w-3 h-3 mr-1.5" />
                                        <span>{event.date} @ {event.location}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}


                {/* Reviews Section */}
                <div className="pt-4 border-t">
                    <div className="flex items-center gap-4 mb-3">
                        {/* Fix: Changed to providerReviews */}
                        <h4 className="font-semibold text-stone-800">口コミ ({providerReviews.length}件)</h4>
                        {providerReviews.length > 0 && (
                            <div className="flex items-center gap-2">
                                <StarRatingDisplay rating={averageRating} />
                                <span className="font-bold text-stone-700">{averageRating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>

                    {providerReviews.length > 0 ? (
                        <div className="space-y-4">
                            {providerReviews.map(review => {
                                const reviewer = users.find(u => u.id === review.userId);
                                return (
                                <div key={review.id} className="bg-stone-50 p-3 rounded-md">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <UserCircleIcon className="w-5 h-5 text-stone-400"/>
                                            <p className="font-semibold text-sm text-stone-700">{reviewer?.name || '匿名ユーザー'}</p>
                                        </div>
                                        <StarRatingDisplay rating={review.rating} className="w-4 h-4"/>
                                    </div>
                                    <p className="text-stone-600 text-sm">{review.comment}</p>
                                    <p className="text-right text-xs text-stone-400 mt-1">{review.createdAt}</p>
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
                    <div className="pt-4 border-t">
                         <h4 className="font-semibold text-stone-800 mb-2">この出展者の口コミを投稿する</h4>
                         <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-stone-600">評価</label>
                                <div className="flex items-center mt-1">
                                    {[...Array(5)].map((_, i) => (
                                    <button key={i} onClick={() => setNewRating(i + 1)} onMouseOver={() => setHoverRating(i+1)} onMouseOut={() => setHoverRating(0)}>
                                        <StarIcon 
                                            className={`w-7 h-7 cursor-pointer transition-colors ${(hoverRating || newRating) > i ? 'text-yellow-400' : 'text-stone-300'}`} 
                                            filled={(hoverRating || newRating) > i}
                                        />
                                    </button>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <label className="text-sm font-medium text-stone-600">コメント</label>
                                <textarea 
                                    value={newComment} 
                                    onChange={e => setNewComment(e.target.value)} 
                                    rows={3} 
                                    placeholder="サービスや商品の感想を教えてください"
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div className="text-right">
                                <button onClick={handleAddReview} disabled={!newRating || !newComment.trim()} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-stone-300">投稿する</button>
                            </div>
                         </div>
                    </div>
                )}

                {selectedSlot && (
                    <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col justify-center items-center rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-stone-800 mb-2">予約方法を選択</h4>
                        <p className="text-stone-600 mb-4">{selectedSlot.startTime} - {selectedSlot.endTime} の枠を予約します。</p>
                        <div className="flex space-x-4">
                            <button onClick={() => confirmBooking('online')} className="flex items-center bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700">
                                <GlobeAltIcon className="w-5 h-5 mr-2" />
                                オンライン
                            </button>
                            <button onClick={() => confirmBooking('現地')} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">現地</button>
                        </div>
                        <button onClick={() => setSelectedSlot(null)} className="mt-4 text-sm text-stone-500 hover:underline">キャンセル</button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

// Fix: Renamed component export.
export default ProviderDetailModal;
