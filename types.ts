export enum AppTab {
  VIDEO_GENERATION = 'VIDEO_GENERATION',
  IMAGE_EDITING = 'IMAGE_EDITING',
  STORYBOARD = 'STORYBOARD',
}

export enum AspectRatio {
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
}

export interface GeneratedVideo {
  uri: string;
  mimeType: string;
}

export type GenerationStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';

export interface StoryboardShot {
  id: string;
  prompt: string;
  videoUri?: string;
  duration: number;
  transition?: 'fade' | 'cut' | 'dissolve';
  status: GenerationStatus;
  error?: string;
}

export interface Storyboard {
  id: string;
  title: string;
  shots: StoryboardShot[];
  createdAt: Date;
}

// Augment the global AIStudio interface.
// window.aistudio is already declared with type AIStudio in the environment.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  var gifshot: any;
}