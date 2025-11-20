import { TemplatePlugin } from './types';

const STORAGE_KEY = 'chart-playground-plugins';

export class PluginRegistry {
    private plugins: Map<string, TemplatePlugin> = new Map();
    private listeners: ((plugins: TemplatePlugin[]) => void)[] = [];

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored) as TemplatePlugin[];
                parsed.forEach(plugin => {
                    this.plugins.set(plugin.id, plugin);
                });
            }
        } catch (error) {
            console.error('Failed to load plugins from storage:', error);
        }
    }

    private saveToStorage() {
        try {
            const plugins = Array.from(this.plugins.values());
            localStorage.setItem(STORAGE_KEY, JSON.stringify(plugins));
            this.notifyListeners();
        } catch (error) {
            console.error('Failed to save plugins to storage:', error);
        }
    }

    register(plugin: TemplatePlugin): void {
        if (this.plugins.has(plugin.id)) {
            console.warn(`Overwriting existing plugin with ID: ${plugin.id}`);
        }
        this.plugins.set(plugin.id, plugin);
        this.saveToStorage();
    }

    unregister(pluginId: string): void {
        if (this.plugins.delete(pluginId)) {
            this.saveToStorage();
        }
    }

    getAll(): TemplatePlugin[] {
        return Array.from(this.plugins.values());
    }

    get(pluginId: string): TemplatePlugin | undefined {
        return this.plugins.get(pluginId);
    }

    subscribe(listener: (plugins: TemplatePlugin[]) => void): () => void {
        this.listeners.push(listener);
        listener(this.getAll());
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners() {
        const plugins = this.getAll();
        this.listeners.forEach(listener => listener(plugins));
    }
}

export const pluginRegistry = new PluginRegistry();
