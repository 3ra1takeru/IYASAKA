import React from 'react';
import { Service, Provider } from '../types';

interface ServiceCardProps {
  service: Service;
  provider: Provider;
  onSelect: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, provider, onSelect }) => {
  return (
    <button onClick={() => onSelect(service)} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col text-left w-full">
      <img src={service.imageUrl} alt={service.title} className="w-full h-48 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-xs font-semibold uppercase text-blue-600 bg-blue-100 px-2 py-1 rounded-full self-start mb-2">{service.category}</span>
        <h3 className="text-xl font-bold text-stone-800 mb-2 flex-grow">{service.title}</h3>
        <p className="text-stone-700 text-sm leading-relaxed mb-4">{service.description.substring(0, 80)}...</p>
        
        <div className="flex items-center text-sm text-stone-600 mt-auto pt-4 border-t border-stone-200">
          <img src={provider.profileImageUrl} alt={provider.providerName} className="w-8 h-8 rounded-full object-cover mr-3" />
          <span className="font-medium">{provider.providerName}</span>
          <span className="ml-auto text-lg font-bold text-blue-800">&yen;{service.price.toLocaleString()}</span>
        </div>
      </div>
    </button>
  );
};

export default ServiceCard;