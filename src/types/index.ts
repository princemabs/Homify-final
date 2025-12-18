export interface Hotel {
  id: number;
  name: string;
  location: string;
  price: number;
  displayPrice?: string;
  rating: number;
  imageUrl: string;
  description?: string;
  discount?: string;
  amenities?: { 
    beds?: number; 
    baths?: number; 
    sqft?: number; 
    kitchen?: number 
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  isFavorite: boolean;
}

export interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Property[];
}

// export interface Property {
//   id: number;
//   title: string;
//   description: string;
//   price: number;
//   displayPrice?: string;
//   address: string;
//   city: string;
//   type: 'APARTMENT' | 'HOUSE' | 'STUDIO' | 'VILLA';
//   bedrooms: number;
//   bathrooms: number;
//   area: number; // in sqft
//   imageUrl: string;
//   coordinates: {
//     lat: number;
//     lng: number;
//   };
//   created_at: string;
//   updated_at: string;
// }

export interface SearchFilters {
  page: number;
  ordering?: string;
  search?: string;
  type?: string;
  city?: string;
  min_price?: number;
  max_price?: number;
}