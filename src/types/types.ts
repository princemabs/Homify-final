// types.ts

export interface PropertyAddress {
  id: number;
  street_address: string;
  city: string;
  postal_code: string;
  district: string;
  latitude: number;
  longitude: number;
  full_address: string;
}

export interface PropertyPhoto {
  id: number;
  url: string;
  thumbnail_url: string;
  is_primary: boolean;
}

export interface Property {
  id: number;
  title: string;
  type: 'HOUSE' | 'APARTMENT' | 'STUDIO' | 'ROOM';
  monthly_rent: string; // L'API renvoie une string "450000.00"
  surface: number;
  number_of_rooms: number;
  number_of_bedrooms?: number;
  address: PropertyAddress;
  primary_photo: PropertyPhoto | null;
  furnished: boolean;
  published_at: string;
  is_favorite: boolean;
}

export interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Property[];
}

// Les filtres disponibles basés sur tes paramètres API
export interface SearchFilters {
  page: number;
  search?: string;
  city?: string;
  type?: string;
  min_price?: string;
  max_price?: string;
  furnished?: boolean;
  ordering?: string;
}


export interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
}

export interface Conversation {
  id: number;
  partnerName: string;
  partnerAvatar?: string;
  lastMessage: string;
  lastMessageTime: string; 
  unreadCount: number;
  propertyTitle?: string;
}


// Structure brute de l'API
export interface ApiUser {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
}

export interface ApiPropertyDetail {
  id: number;
  title: string;
  primary_photo?: { url: string; thumbnail_url: string };
}

export interface ApiMessage {
  id: number;
  property: number; // ID du logement
  property_detail: ApiPropertyDetail;
  sender: ApiUser;
  recipient: ApiUser;
  subject: string;
  content: string;
  is_read: boolean;
  sent_at: string; 
}

// Structure transformée pour l'affichage (UI)
export interface UIConversation {
  propertyId: number;
  partnerId: number;
  partnerName: string;
  propertyTitle: string;
  propertyImage?: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
  messages: ApiMessage[]; // On garde l'historique complet ici
}