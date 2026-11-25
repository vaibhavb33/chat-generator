import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Project, Template } from '@/core/types';

interface ChatForgeDbSchema extends DBSchema {
  projects: {
    key: string;
    value: Project;
    indexes: { 'by-updated': string; 'by-platform': string };
  };
  templates: {
    key: string;
    value: Template;
    indexes: { 'by-category': string };
  };
  preferences: {
    key: string;
    value: { key: string; value: string };
  };
}

const DB_NAME = 'chatforge_local_db';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<ChatForgeDbSchema>> | null = null;

function isIndexedDbAvailable(): boolean {
  return typeof indexedDB !== 'undefined';
}

function getDb(): Promise<IDBPDatabase<ChatForgeDbSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<ChatForgeDbSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('projects')) {
          const store = db.createObjectStore('projects', { keyPath: 'id' });
          store.createIndex('by-updated', 'updatedAt');
          store.createIndex('by-platform', 'platformId');
        }
        if (!db.objectStoreNames.contains('templates')) {
          const tplStore = db.createObjectStore('templates', { keyPath: 'id' });
          tplStore.createIndex('by-category', 'category');
        }
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveProjectToIndexedDb(project: Project): Promise<void> {
  if (!isIndexedDbAvailable()) return;
  const db = await getDb();
  await db.put('projects', project);
  await db.put('preferences', {
    key: `last_project_${project.platformId}`,
    value: project.id,
  });
}

export async function loadLatestProjectForPlatform(platformId: string): Promise<Project | null> {
  if (!isIndexedDbAvailable()) return null;
  const db = await getDb();
  const pref = await db.get('preferences', `last_project_${platformId}`);
  if (pref?.value) {
    const exact = await db.get('projects', pref.value);
    if (exact && exact.platformId === platformId) {
      return exact;
    }
  }
  const allForPlatform = await db.getAllFromIndex('projects', 'by-platform', platformId);
  if (allForPlatform.length === 0) return null;
  allForPlatform.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return allForPlatform[0] ?? null;
}

export async function listSavedProjects(): Promise<Project[]> {
  if (!isIndexedDbAvailable()) return [];
  const db = await getDb();
  const projects = await db.getAll('projects');
  return projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function deleteProjectFromIndexedDb(projectId: string): Promise<void> {
  if (!isIndexedDbAvailable()) return;
  const db = await getDb();
  await db.delete('projects', projectId);
}

export async function saveCustomTemplateToIndexedDb(template: Template): Promise<void> {
  if (!isIndexedDbAvailable()) return;
  const db = await getDb();
  await db.put('templates', template);
}

export async function listCustomTemplates(): Promise<Template[]> {
  if (!isIndexedDbAvailable()) return [];
  const db = await getDb();
  return db.getAll('templates');
}

export async function deleteCustomTemplateFromIndexedDb(templateId: string): Promise<void> {
  if (!isIndexedDbAvailable()) return;
  const db = await getDb();
  await db.delete('templates', templateId);
}
