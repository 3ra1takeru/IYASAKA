
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
      return <p className="text-sm text-stone-500 mt-4">ログインすると予約・出展登録ができます。</p>;
    }

    switch (user.role) {
      case UserRole.PROVIDER:
        if (event.eventType !== EventType.MARCHE) {
            return <div className="bg-stone-100 text-stone-600 text-sm font-medium mt-4 px-4 py-2 rounded-md text-center">このイベントは出展者を募集していません。</div>;
        }
        if (userProviderRegistration) {
            if(userProviderRegistration.status === RegistrationStatus.DRAFT) {
                 return (
                    <button
                        onClick={() => onProviderRegister(event.id, userProviderRegistration.id)}
                        className="w-full mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                    >
                        下書きを編集
                    </button>
                );
            }
             return <div className="bg-blue-100 text-blue-800 text-sm font-medium mt-4 px-4 py-2 rounded-md text-center capitalize">{userProviderRegistration.status}</div>;
        }
        return (
            <button
                onClick={() => onProviderRegister(event.id)}
                className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
                出展を申し込む
            </button>
        );
      case UserRole.MEMBER:
        return isReserved ? (
          <div className="bg-green-100 text-green-800 text-sm font-medium mt-4 px-4 py-2 rounded-md text-center">予約済み</div>
        ) : (
          <button
            onClick={() => onMemberReserve(event.id)}
            className="w-full mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
          >
            参加予約する
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
      <img src={event.imageUrl} alt={event.name} className="w-full h-48 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-green-800 mb-2">{event.name}</h3>
        <div className="flex items-center text-stone-600 mb-2">
          <CalendarIcon className="w-5 h-5 mr-2 text-green-600" />
          <span>{event.date} ({event.startTime} - {event.endTime})</span>
        </div>
        <div className="flex items-center text-stone-600 mb-4">
          <LocationMarkerIcon className="w-5 h-5 mr-2 text-green-600" />
          <span>{event.location}</span>
        </div>
        <p className="text-stone-700 leading-relaxed mb-4 flex-grow">{event.description}</p>

        {event.eventType === EventType.MARCHE && (
          <div>
            <h4 className="font-semibold text-stone-800 mb-2">出展者 ({eventProviders.length}店):</h4>
            {eventProviders.length > 0 ? (
              <div className="flex flex-col space-y-2">
                {eventProviders.slice(0, 3).map(({provider, registration}) => (
                  <button key={provider.id} onClick={() => onProviderSelect(provider, registration)} className="flex items-center text-left p-2 rounded-md hover:bg-stone-100 transition-colors">
                      {provider.profileImageUrl ? (
                          <img src={provider.profileImageUrl} alt={provider.providerName} className="w-8 h-8 rounded-full object-cover mr-3" />
                      ) : (
                          <StoreIcon className="w-5 h-5 mr-2 text-stone-500" />
                      )}
                      <span className="text-stone-700 font-medium">{provider.providerName}</span>
                  </button>
                ))}
                <button onClick={() => onShowAllProviders(event.id)} className="flex items-center text-sm p-2 text-green-700 hover:text-green-900 font-semibold w-full justify-center rounded-md hover:bg-green-50 transition-colors">
                    <UsersIcon className="w-4 h-4 mr-2" />
                    出展者一覧を見る
                </button>
              </div>
            ) : (
               <p className="text-sm text-stone-500">まだ出展者がいません。</p>
            )}
          </div>
        )}
        
        <div className="mt-auto pt-4 border-t border-stone-200">
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
