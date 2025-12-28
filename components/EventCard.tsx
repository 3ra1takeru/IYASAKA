
import React from 'react';
import { Event, User, UserRole, EventReservation, Provider, EventRegistration, RegistrationStatus, EventType } from '../types';
import { CalendarIcon, LocationMarkerIcon, StoreIcon, UsersIcon } from './icons';

interface EventCardProps {
  event: Event;
  user: User | null;
  reservations: EventReservation[];
  providers: Provider[];
  registrations: EventRegistration[];
  onProviderRegister: (eventId: string, registrationId?: string) => void;
  onMemberReserve: (eventId: string) => void;
  onProviderSelect: (provider: Provider, registration: EventRegistration) => void;
  onShowAllProviders: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, user, reservations, providers, registrations, onProviderRegister, onMemberReserve, onProviderSelect, onShowAllProviders }) => {
  const isReserved = user && reservations.some(r => r.eventId === event.id && r.userId === user.id);
  const userProviderRegistration = user ? registrations.find(r => r.eventId === event.id && r.providerId === user.id) : null;
  
  const approvedRegistrations = registrations.filter(r => r.eventId === event.id && r.status === RegistrationStatus.APPROVED);
  const eventProviders = approvedRegistrations.map(reg => ({
      provider: providers.find(v => v.id === reg.providerId)!,
      registration: reg
  })).filter(item => item.provider);


  const renderActionButtons = () => {
    if (!user) {
      return <p className="text-sm text-stone-500 mt-4 text-center">※ ログインすると予約・出展登録ができます</p>;
    }

    switch (user.role) {
      case UserRole.PROVIDER:
        if (event.eventType !== EventType.MARCHE) {
            return <div className="bg-stone-100 text-stone-600 text-sm font-medium mt-4 px-4 py-3 rounded text-center">このイベントは出展者を募集していません</div>;
        }
        if (userProviderRegistration) {
            if(userProviderRegistration.status === RegistrationStatus.DRAFT) {
                 return (
                    <button
                        onClick={() => onProviderRegister(event.id, userProviderRegistration.id)}
                        className="w-full mt-4 bg-yellow-600 text-white px-4 py-3 rounded hover:bg-yellow-700 transition-colors duration-200 tracking-wide"
                    >
                        下書きを編集
                    </button>
                );
            }
             return <div className="bg-indigo-50 text-indigo-800 border border-indigo-100 text-sm font-medium mt-4 px-4 py-3 rounded text-center capitalize">{userProviderRegistration.status}</div>;
        }
        return (
            <button
                onClick={() => onProviderRegister(event.id)}
                className="w-full mt-4 bg-indigo-700 text-white px-4 py-3 rounded hover:bg-indigo-800 transition-colors duration-200 tracking-wide"
            >
                出展を申し込む
            </button>
        );
      case UserRole.MEMBER:
        return isReserved ? (
          <div className="bg-teal-50 text-teal-800 border border-teal-100 text-sm font-medium mt-4 px-4 py-3 rounded text-center tracking-wide">ご予約済み</div>
        ) : (
          <button
            onClick={() => onMemberReserve(event.id)}
            className="w-full mt-4 bg-teal-700 text-white px-4 py-3 rounded hover:bg-teal-800 transition-colors duration-200 tracking-wide font-medium"
          >
            参加予約する
          </button>
        );
      default:
        return null;
    }
  };

  const getFormatLabel = () => {
      if (event.format === 'online') return 'オンライン';
      // Extract the first part of the location (e.g., "京都府" from "京都府 梅小路公園")
      const placeName = event.location.split(/[\s　]+/)[0];
      
      if (event.format === 'ondemand') {
          return `${placeName} & オンライン`;
      }
      return placeName;
  };

  return (
    <div className="bg-white border border-stone-200 rounded shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden">
      <div className="relative">
        <img src={event.imageUrl} alt={event.name} className="w-full h-52 object-cover" />
        <div className="absolute top-0 right-0 bg-white/90 backdrop-blur px-3 py-1 m-2 text-xs font-serif tracking-widest border border-stone-200 shadow-sm">
            <span className="font-medium text-stone-600">{event.eventType === EventType.MARCHE ? 'マルシェ' : '交流会・講座'}</span>
            <span className="ml-2 font-bold text-stone-800">
                {getFormatLabel()}
            </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl sm:text-2xl font-bold text-stone-800 mb-3 font-serif tracking-wide border-b border-stone-100 pb-2">{event.name}</h3>
        <div className="space-y-2 mb-4">
            <div className="flex items-center text-stone-600 text-sm">
                <CalendarIcon className="w-4 h-4 mr-2 text-teal-700" />
                <span className="tracking-wide">{event.date} ({event.startTime} - {event.endTime})</span>
            </div>
            <div className="flex items-center text-stone-600 text-sm">
                <LocationMarkerIcon className="w-4 h-4 mr-2 text-teal-700" />
                {event.googleMapUrl ? (
                    <a href={event.googleMapUrl} target="_blank" rel="noopener noreferrer" className="tracking-wide hover:text-teal-700 hover:underline">
                        {event.location}
                    </a>
                ) : (
                    <span className="tracking-wide">{event.location}</span>
                )}
            </div>
        </div>
        <p className="text-stone-600 leading-relaxed mb-6 text-sm flex-grow font-light">{event.description}</p>

        {event.eventType === EventType.MARCHE && (
          <div className="bg-stone-50 p-4 rounded border border-stone-100">
            <h4 className="font-semibold text-stone-700 mb-3 text-sm flex items-center">
                <StoreIcon className="w-4 h-4 mr-2 text-stone-400"/>
                出展者 ({eventProviders.length}店)
            </h4>
            {eventProviders.length > 0 ? (
              <div className="flex flex-col space-y-2">
                {eventProviders.slice(0, 3).map(({provider, registration}) => (
                  <button key={provider.id} onClick={() => onProviderSelect(provider, registration)} className="flex items-center text-left p-2 rounded hover:bg-stone-100 transition-colors bg-white border border-stone-100">
                      {provider.profileImageUrl ? (
                          <img src={provider.profileImageUrl} alt={provider.providerName} className="w-8 h-8 rounded-full object-cover mr-3 border border-stone-200" />
                      ) : (
                          <StoreIcon className="w-5 h-5 mr-2 text-stone-400" />
                      )}
                      <span className="text-stone-700 text-sm font-medium truncate">{provider.providerName}</span>
                  </button>
                ))}
                <button onClick={() => onShowAllProviders(event.id)} className="flex items-center text-xs p-2 text-teal-700 hover:text-teal-900 font-medium w-full justify-center rounded transition-colors mt-1">
                    <UsersIcon className="w-4 h-4 mr-1.5" />
                    すべての出展者を見る
                </button>
              </div>
            ) : (
               <p className="text-xs text-stone-400 text-center py-2">出展者はまだおりません</p>
            )}
          </div>
        )}
        
        <div className="mt-auto">
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
