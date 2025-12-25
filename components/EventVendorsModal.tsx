
import React from 'react';
// Fix: Renamed Vendor to Provider to match types.ts
import { Event, Provider, EventRegistration, RegistrationStatus, User } from '../types';
import Modal from './Modal';
import { StoreIcon, InstagramIcon } from './icons';

// Fix: Renamed interface to align with component name change.
interface EventProvidersModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  // Fix: Changed vendors prop to providers with Provider[] type.
  providers: Provider[];
  users: User[];
  registrations: EventRegistration[];
  // Fix: Changed onVendorSelect to onProviderSelect with Provider type.
  onProviderSelect: (provider: Provider, registration: EventRegistration) => void;
}

// Fix: Renamed component from EventVendorsModal to EventProvidersModal and updated props.
const EventProvidersModal: React.FC<EventProvidersModalProps> = ({ isOpen, onClose, event, providers, users, registrations, onProviderSelect }) => {
  if (!event) return null;

  const approvedRegistrations = registrations.filter(r => r.eventId === event.id && r.status === RegistrationStatus.APPROVED);
  // Fix: Renamed eventVendors to eventProviders and updated logic to use providerId.
  const eventProviders = approvedRegistrations.map(reg => {
    // Fix: Changed vendorId to providerId and vendors to providers.
    const provider = providers.find(v => v.id === reg.providerId);
    // Fix: Changed vendorId to providerId.
    const user = users.find(u => u.id === reg.providerId);
    // Fix: Changed vendor to provider.
    return { provider, registration: reg, user };
  }).filter(item => item.provider);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${event.name} - 出展者一覧`}>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {eventProviders.length > 0 ? (
          eventProviders.map(({ provider, registration, user }) => (
            provider && (
                <button
                    key={provider.id}
                    onClick={() => onProviderSelect(provider, registration)}
                    className="w-full text-left p-4 rounded-lg border border-stone-200 hover:bg-stone-100 hover:border-green-500 transition-all duration-200 flex items-start space-x-4"
                >
                    {provider.profileImageUrl ? (
                        // Fix: Changed stallName to providerName.
                        <img src={provider.profileImageUrl} alt={provider.providerName} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                        <div className="w-16 h-16 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0">
                            <StoreIcon className="w-8 h-8 text-stone-400"/>
                        </div>
                    )}
                    <div className="flex-grow">
                        {/* Fix: Changed stallName to providerName. */}
                        <h4 className="font-bold text-lg text-stone-800">{provider.providerName}</h4>
                        <p className="text-sm text-stone-600 mb-1">{provider.description}</p>
                        {user?.instagramId && (
                            <div className="inline-flex items-center text-xs text-stone-500 mt-1">
                                <InstagramIcon className="w-3 h-3 mr-1" />
                                {user.instagramId}
                            </div>
                        )}
                    </div>
                </button>
            )
          ))
        ) : (
          <p className="text-stone-500 text-center py-4">このイベントにはまだ承認された出展者がいません。</p>
        )}
      </div>
    </Modal>
  );
};

// Fix: Renamed component export.
export default EventProvidersModal;
