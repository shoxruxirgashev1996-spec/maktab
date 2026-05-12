/**
 * Advanced Query Service for Scalable Data Retrieval
 * 
 * Provides pagination, filtering, sorting, and caching
 * for optimized database queries at scale.
 */

import { collection, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { AppError } from '../middleware/errorHandler.js';

export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
  search?: string;
  cacheTime?: number; // seconds
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Simple in-memory cache
const queryCache = new Map<string, { data: any; timestamp: number }>();

export class QueryService {
  /**
   * Generate cache key from query parameters
   */
  static getCacheKey(collection: string, options: QueryOptions): string {
    return `${collection}:${JSON.stringify(options)}`;
  }

  /**
   * Check if cache is still valid
   */
  static isCacheValid(cacheTime: number = 300): boolean {
    return Date.now() - cacheTime * 1000 < Date.now();
  }

  /**
   * Execute advanced query with pagination and filtering
   */
  static async find<T>(
    db: any,
    collectionName: string,
    options: QueryOptions = {}
  ): Promise<PaginatedResponse<T>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
      filters = {},
      cacheTime = 0
    } = options;

    // Check cache
    if (cacheTime > 0) {
      const cacheKey = this.getCacheKey(collectionName, options);
      const cached = queryCache.get(cacheKey);

      if (cached && this.isCacheValid(cacheTime)) {
        return cached.data;
      }
    }

    try {
      // Build constraints
      const constraints = [];

      // Add filters
      for (const [field, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            constraints.push(where(field, 'in', value));
          } else if (typeof value === 'object' && value.operator) {
            constraints.push(where(field, value.operator, value.value));
          } else {
            constraints.push(where(field, '==', value));
          }
        }
      }

      // Add sorting
      if (sortBy) {
        constraints.push(orderBy(sortBy, sortOrder));
      }

      // Add pagination
      const pageLimit = Math.min(limit, 100); // Max 100 per page
      constraints.push(limit(pageLimit + 1)); // +1 to check if hasNextPage

      // Execute query
      const q = query(collection(db, collectionName), ...constraints);
      const snapshot = await getDocs(q);

      // Extract data
      let items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as T[];

      // Determine if there's a next page
      const hasNextPage = items.length > pageLimit;
      if (hasNextPage) {
        items = items.slice(0, pageLimit);
      }

      // Build response
      const response: PaginatedResponse<T> = {
        data: items,
        pagination: {
          page,
          limit: pageLimit,
          total: snapshot.size,
          pages: Math.ceil(snapshot.size / pageLimit),
          hasNextPage,
          hasPreviousPage: page > 1
        }
      };

      // Cache if requested
      if (cacheTime > 0) {
        const cacheKey = this.getCacheKey(collectionName, options);
        queryCache.set(cacheKey, {
          data: response,
          timestamp: Date.now()
        });
      }

      return response;
    } catch (error) {
      console.error(`Error executing query on ${collectionName}:`, error);
      throw new AppError(`Failed to query ${collectionName}`, 500);
    }
  }

  /**
   * Search across multiple fields
   */
  static async search<T>(
    db: any,
    collectionName: string,
    searchTerm: string,
    searchFields: string[],
    options: QueryOptions = {}
  ): Promise<PaginatedResponse<T>> {
    // Firestore doesn't have full-text search
    // This is a simple implementation - consider using Algolia for production
    const allDocuments = await this.find<T>(db, collectionName, {
      ...options,
      limit: 1000 // Fetch more for client-side filtering
    });

    const filtered = allDocuments.data.filter((doc: any) => {
      const lowerSearch = searchTerm.toLowerCase();
      return searchFields.some((field) => {
        const value = doc[field];
        return value && String(value).toLowerCase().includes(lowerSearch);
      });
    });

    return {
      data: filtered,
      pagination: allDocuments.pagination
    };
  }

  /**
   * Aggregate data (count, sum, avg)
   */
  static async aggregate(
    db: any,
    collectionName: string,
    operation: 'count' | 'sum' | 'avg',
    field?: string,
    filters?: Record<string, any>
  ): Promise<number> {
    try {
      const result = await this.find(db, collectionName, {
        limit: 1000,
        filters
      });

      if (operation === 'count') {
        return result.pagination.total;
      }

      if (!field) {
        throw new AppError('Field required for sum/avg operations', 400);
      }

      const values = result.data
        .map((item: any) => parseFloat(item[field]))
        .filter((v: any) => !isNaN(v));

      if (operation === 'sum') {
        return values.reduce((a, b) => a + b, 0);
      }

      if (operation === 'avg') {
        return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      }

      return 0;
    } catch (error) {
      console.error(`Error aggregating ${collectionName}:`, error);
      throw new AppError(`Failed to aggregate ${collectionName}`, 500);
    }
  }

  /**
   * Clear cache
   */
  static clearCache(collectionName?: string) {
    if (collectionName) {
      for (const [key] of queryCache) {
        if (key.startsWith(collectionName)) {
          queryCache.delete(key);
        }
      }
    } else {
      queryCache.clear();
    }
  }
}

export default QueryService;
