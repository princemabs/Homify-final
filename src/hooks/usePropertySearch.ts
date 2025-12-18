// hooks/usePropertySearch.ts
import { useState, useEffect, useCallback } from 'react';
import { Property, PaginatedResponse, SearchFilters } from '../types';

const cleanParams = (filters: SearchFilters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });
  return params.toString();
};

export function usePropertySearch() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    page: 1,
    ordering: '-created_at', 
    search: '',
  });

  const fetchProperties = useCallback(async (isLoadMore = false) => {
    setLoading(true);
    setError(null);

    try {
      const queryString = cleanParams(filters);
      const response = await fetch(`http://localhost:8000/api/properties/?${queryString}`);
      
      if (!response.ok) throw new Error('Erreur réseau');

      const data: PaginatedResponse = await response.json();

      if (isLoadMore) {
        setProperties(prev => [...prev, ...data.results]);
      } else {
        setProperties(data.results);
      }

      setTotalCount(data.count);
      setHasNextPage(!!data.next);
    } catch (err) {
      setError("Impossible de charger les annonces");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties(false);
    }, 500); 

    return () => clearTimeout(timer);
  }, [filters.search, filters.type, filters.city, filters.min_price, filters.ordering]);

  useEffect(() => {
    if (filters.page > 1) {
      fetchProperties(true);
    }
  }, [filters.page]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 })); 
  };

  const loadMore = () => {
    if (hasNextPage && !loading) {
      setFilters(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  return {
    properties,
    loading,
    error,
    totalCount,
    filters,
    updateFilter,
    loadMore,
    hasNextPage
  };
}
