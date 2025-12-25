
export enum UserRole {
  ADMIN = 'admin',
  PROVIDER = 'provider', // VENDORからPROVIDERに変更
  MEMBER = 'member',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  instagramId?: string;
  isLineLinked?: boolean;
  lineNotificationSettings?: {
    eventReservations: boolean;
    favoriteProviderUpdates: boolean; // favoriteVendorUpdatesから変更
    serviceBookings: boolean;
  };
}

export interface Provider { // VendorからProviderにリネーム
  id: string;
  name: string;
  providerName: string; // stallNameからproviderNameに変更
  description: string;
  profileImageUrl: string;
}

export enum EventType {
  MARCHE = 'marche',
  SEMINAR_MEETUP = 'seminar_meetup',
}

export interface Event {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  imageUrl: string;
  isApprovalRequiredForVendors: boolean;
  eventType: EventType;
}

export enum RegistrationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
}

export enum OfferingType {
  GOODS = 'goods',
  SERVICE = 'service',
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

export interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
}

export interface EventRegistration {
    id: string;
    eventId: string;
    providerId: string; // vendorIdからproviderIdに変更
    status: RegistrationStatus;
    offeringType: OfferingType;
    products: Product[];
    timeSlots: TimeSlot[];
    notes?: string;
    isOnlineBookingEnabled?: boolean;
}

export interface EventReservation {
  userId: string;
  eventId: string;
}

export interface TimeSlotBooking {
    id: string;
    userId: string;
    eventId: string;
    providerId: string; // vendorIdからproviderIdに変更
    timeSlotId: string;
    bookingType: 'online' | '現地';
}

export interface Review {
  id: string;
  eventId: string;
  providerId: string; // vendorIdからproviderIdに変更
  userId: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string; // YYYY-MM-DD
}

export interface Favorite {
  userId: string;
  providerId: string; // vendorIdからproviderIdに変更
}

// 新しく追加
export enum ServiceCategory {
    FORTUNE = '占い',
    DESIGN = 'デザイン',
    CONSULTING = '悩み相談',
    WRITING = 'ライティング',
    OTHER = 'その他',
}

export interface Service {
    id: string;
    providerId: string;
    title: string;
    description: string;
    category: ServiceCategory;
    price: number;
    imageUrl: string;
    deliveryMethod: 'online' | 'offline' | 'both';
    status: 'open' | 'closed';
}

export interface ServiceOrder {
    id: string;
    serviceId: string;
    buyerId: string;
    providerId: string;
    status: 'requested' | 'accepted' | 'completed' | 'cancelled';
    createdAt: string;
}

export interface ServiceReview {
    id: string;
    serviceId: string;
    userId: string;
    rating: number; // 1 to 5
    comment: string;
    createdAt: string; // YYYY-MM-DD
}

export interface ChatMessage {
    id: string;
    orderId: string;
    senderId: string; // Will be a userId
    receiverId: string; // Will be a userId
    message: string;
    createdAt: string; // ISO string
}