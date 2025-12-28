
import React from 'react';
import { Service, Provider } from '../types';
import { LocationMarkerIcon } from './icons';

interface ServiceCardProps {
  service: Service;
  provider: Provider;
  onSelect: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, provider, onSelect }) => {
  return (
    <button onClick={() => onSelect(service)} className="bg-white border border-stone-200 rounded shadow-sm hover:shadow-md overflow-hidden transform hover:-translate-y-0.5 transition-all duration-300 flex flex-col text-left w-full group">
      <div className="relative w-full h-48 overflow-hidden">
        <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <span className="absolute top-2 left-2 text-xs font-medium tracking-wider text-white bg-stone-800/80 px-3 py-1 rounded-sm backdrop-blur-sm border border-white/20">
            {service.category}
        </span>
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-xs text-stone-600 flex items-center shadow-sm z-10">
            <LocationMarkerIcon className="w-3 h-3 mr-1 text-teal-600"/>
            {service.googleMapUrl ? (
                <a href={service.googleMapUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="hover:text-teal-800 hover:underline">
                    {service.location}
                </a>
            ) : (
                service.location
            )}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-stone-800 mb-3 flex-grow font-serif tracking-wide leading-snug group-hover:text-teal-800 transition-colors">{service.title}</h3>
        <p className="text-stone-600 text-sm leading-relaxed mb-4 line-clamp-2 font-light">{service.description}</p>
        
        <div className="flex items-center text-sm text-stone-600 mt-auto pt-4 border-t border-stone-100 w-full">
          <img src={provider.profileImageUrl} alt={provider.providerName} className="w-8 h-8 rounded-full object-cover mr-3 border border-stone-200" />
          <span className="font-medium text-xs text-stone-500 truncate max-w-[100px]">{provider.providerName}</span>
          <span className="ml-auto text-lg font-bold text-teal-800 font-serif">&yen;{service.price.toLocaleString()}</span>
        </div>
      </div>
    </button>
  );
};

export default ServiceCard;
