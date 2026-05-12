/**
 * API Versioning and Backwards Compatibility
 * 
 * Enables adding new API versions without breaking existing clients
 */

import { Router, Request, Response } from 'express';

export interface VersionedRoute {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  versions: string[]; // e.g., ['1.0', '2.0']
  handler: (req: Request, res: Response) => void;
}

export class APIVersionManager {
  private versions: Map<string, Router> = new Map();

  /**
   * Register an API version
   */
  registerVersion(version: string): Router {
    if (!this.versions.has(version)) {
      this.versions.set(version, Router());
    }
    return this.versions.get(version)!;
  }

  /**
   * Get all registered versions
   */
  getVersions(): string[] {
    return Array.from(this.versions.keys());
  }

  /**
   * Get specific version router
   */
  getVersion(version: string): Router | undefined {
    return this.versions.get(version);
  }

  /**
   * Mount all versions with proper routing
   * Usage: app.use('/api', versionManager.mount())
   */
  mount(): Router {
    const router = Router();

    for (const [version, versionRouter] of this.versions) {
      router.use(`/v${version}`, versionRouter);
    }

    // Default to latest version if no version specified
    const latest = this.getLatestVersion();
    if (latest) {
      const latestRouter = this.versions.get(latest);
      if (latestRouter) {
        router.use('/', latestRouter);
      }
    }

    return router;
  }

  private getLatestVersion(): string | undefined {
    const sorted = this.getVersions().sort((a, b) => {
      const aParts = a.split('.').map(Number);
      const bParts = b.split('.').map(Number);
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const diff = (aParts[i] || 0) - (bParts[i] || 0);
        if (diff !== 0) return diff;
      }
      return 0;
    });
    return sorted[sorted.length - 1];
  }
}

/**
 * Example usage:
 * 
 * const versionManager = new APIVersionManager();
 * 
 * // V1 API
 * const v1 = versionManager.registerVersion('1.0');
 * v1.get('/news', (req, res) => { ... });
 * 
 * // V2 API (with new features)
 * const v2 = versionManager.registerVersion('2.0');
 * v2.get('/news', (req, res) => { ... with new fields ... });
 * v2.get('/news/:id/comments', (req, res) => { ... new endpoint ... });
 * 
 * app.use('/api', versionManager.mount());
 * 
 * This creates:
 * - /api/v1.0/news
 * - /api/v2.0/news
 * - /api/v2.0/news/:id/comments
 * - /api/news (latest version = v2.0)
 */

export default APIVersionManager;
