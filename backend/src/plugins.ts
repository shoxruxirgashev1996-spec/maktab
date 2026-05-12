/**
 * Plugin/Feature Module Architecture
 * 
 * This file demonstrates how to structure features as plugins
 * for easy addition of new functionality without modifying core code.
 */

// Example plugin interface for future features
export interface Plugin {
  name: string;
  version: string;
  init(app: any): Promise<void>;
  getRoutes?(): any[];
  getMiddleware?(): any[];
  onShutdown?(): Promise<void>;
}

// Example: Events/Calendar Plugin
export const EventsPlugin: Plugin = {
  name: 'events',
  version: '1.0.0',
  async init(app) {
    console.log('Initializing Events Plugin');
    // Initialize db collections, etc.
  },
  getRoutes() {
    return [
      // { path: '/api/public/events', method: 'GET', handler: getEvents },
      // { path: '/api/admin/events', method: 'POST', handler: createEvent }
    ];
  }
};

// Example: Email Notifications Plugin
export const EmailPlugin: Plugin = {
  name: 'email',
  version: '1.0.0',
  async init(app) {
    console.log('Initializing Email Plugin');
  }
};

// Example: File Upload Plugin
export const FileUploadPlugin: Plugin = {
  name: 'file-upload',
  version: '1.0.0',
  async init(app) {
    console.log('Initializing File Upload Plugin');
  }
};

// Example: Analytics Plugin
export const AnalyticsPlugin: Plugin = {
  name: 'analytics',
  version: '1.0.0',
  async init(app) {
    console.log('Initializing Analytics Plugin');
  },
  getMiddleware() {
    return [
      // (req, res, next) => { track analytics }
    ];
  }
};

// Plugin Manager
export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();

  register(plugin: Plugin) {
    this.plugins.set(plugin.name, plugin);
    console.log(`Plugin registered: ${plugin.name}@${plugin.version}`);
  }

  async initializeAll(app: any) {
    for (const [name, plugin] of this.plugins) {
      try {
        await plugin.init(app);
      } catch (error) {
        console.error(`Failed to initialize plugin: ${name}`, error);
      }
    }
  }

  get(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  getAll(): Plugin[] {
    return Array.from(this.plugins.values());
  }
}

export default PluginManager;
