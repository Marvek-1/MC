export type ConnectionStatus = 'connected' | 'disconnected' | 'error';

export interface SourceConnector {
  id: string;
  name: string;
  type: 'firebase' | 'postgres' | 'supabase' | 'neo4j' | 'file' | 'api';
  status: ConnectionStatus;
  lastIntrospected?: string;
}

export interface FieldProfile {
  name: string;
  type: string;
  isSensitive: boolean;
  isKey: boolean;
  semanticTag?: string;
  confidence?: number;
}

export interface SchemaProfile {
  entityName: string;
  fields: FieldProfile[];
  relationships: {
    target: string;
    type: string;
    field: string;
  }[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export type StudioMode = 'fabricate' | 'simulate' | 'train' | 'test';
