/**
 * Advanced Configuration System
 * 
 * Centralized configuration for different environments
 * with validation and type safety.
 */

import dotenv from 'dotenv';
dotenv.config();

export interface Config {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  security: SecurityConfig;
  cache: CacheConfig;
  logging: LoggingConfig;
  features: FeatureFlags;
}

export interface AppConfig {
  env: 'development' | 'staging' | 'production';
  port: number;
  host: string;
  frontendUrl: string;
}

export interface DatabaseConfig {
  provider: 'firebase';
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    databaseId: string;
  };
}

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiry: string;
  passwordMinLength: number;
  maxLoginAttempts: number;
  lockoutDuration: number; // minutes
}

export interface SecurityConfig {
  corsOrigins: string[];
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  useHelmet: boolean;
  useCompression: boolean;
}

export interface CacheConfig {
  enabled: boolean;
  defaultTtl: number; // seconds
  strategies: {
    news: number;
    banners: number;
    settings: number;
    public: number;
  };
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  format: 'json' | 'text';
  errorTracking: {
    enabled: boolean;
    service: string; // 'sentry' | 'bugsnag' | 'custom'
    dsn?: string;
  };
}

export interface FeatureFlags {
  enableFileUploads: boolean;
  enableEmails: boolean;
  enableAnalytics: boolean;
  enableNotifications: boolean;
  maintenanceMode: boolean;
  apiVersioning: boolean;
}

export class ConfigManager {
  private config: Config;

  constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  private loadConfig(): Config {
    const env = process.env.NODE_ENV || 'development';

    return {
      app: {
        env: env as any,
        port: parseInt(process.env.PORT || '3000', 10),
        host: process.env.HOST || 'localhost',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
      },

      database: {
        provider: 'firebase',
        firebase: {
          apiKey: process.env.FIREBASE_API_KEY || '',
          authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
          projectId: process.env.FIREBASE_PROJECT_ID || '',
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
          messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
          appId: process.env.FIREBASE_APP_ID || '',
          databaseId: process.env.FIREBASE_DATABASE_ID || ''
        }
      },

      auth: {
        jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
        jwtExpiry: process.env.JWT_EXPIRY || '7d',
        passwordMinLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '8', 10),
        maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
        lockoutDuration: parseInt(process.env.LOCKOUT_DURATION || '15', 10)
      },

      security: {
        corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(','),
        rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10),
        rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
        useHelmet: process.env.USE_HELMET !== 'false',
        useCompression: process.env.USE_COMPRESSION !== 'false'
      },

      cache: {
        enabled: process.env.CACHE_ENABLED !== 'false',
        defaultTtl: parseInt(process.env.CACHE_DEFAULT_TTL || '300', 10),
        strategies: {
          news: parseInt(process.env.CACHE_NEWS_TTL || '3600', 10),
          banners: parseInt(process.env.CACHE_BANNERS_TTL || '1800', 10),
          settings: parseInt(process.env.CACHE_SETTINGS_TTL || '3600', 10),
          public: parseInt(process.env.CACHE_PUBLIC_TTL || '1800', 10)
        }
      },

      logging: {
        level: (process.env.LOG_LEVEL || 'info') as any,
        format: (process.env.LOG_FORMAT || 'text') as any,
        errorTracking: {
          enabled: process.env.ERROR_TRACKING_ENABLED === 'true',
          service: process.env.ERROR_TRACKING_SERVICE || 'sentry',
          dsn: process.env.ERROR_TRACKING_DSN
        }
      },

      features: {
        enableFileUploads: process.env.FEATURE_FILE_UPLOADS === 'true',
        enableEmails: process.env.FEATURE_EMAILS === 'true',
        enableAnalytics: process.env.FEATURE_ANALYTICS === 'true',
        enableNotifications: process.env.FEATURE_NOTIFICATIONS === 'true',
        maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
        apiVersioning: process.env.API_VERSIONING === 'true'
      }
    };
  }

  private validateConfig(): void {
    const required = [
      'FIREBASE_PROJECT_ID',
      'JWT_SECRET',
      'FRONTEND_URL'
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0 && process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    if (process.env.NODE_ENV === 'production') {
      if (this.config.auth.jwtSecret === 'dev-secret-key-change-in-production') {
        throw new Error('JWT_SECRET must be changed in production!');
      }
    }
  }

  get(): Config {
    return this.config;
  }

  isDevelopment(): boolean {
    return this.config.app.env === 'development';
  }

  isProduction(): boolean {
    return this.config.app.env === 'production';
  }

  isStaging(): boolean {
    return this.config.app.env === 'staging';
  }
}

export const configManager = new ConfigManager();
export default configManager;
