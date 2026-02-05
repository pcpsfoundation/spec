import { v4 as uuidv4 } from 'uuid';

export interface Platform {
  id: string;
  name: string;
  endpoint: string;
  enabled: boolean;
}

// Well-known suggestions for easy setup — users can edit or remove these
export const SUGGESTED_PLATFORMS: Platform[] = [
  { id: uuidv4(), name: 'Apple Screen Time', endpoint: 'https://pcps-adapter.apple.example/v1/family', enabled: false },
  { id: uuidv4(), name: 'Google Family Link', endpoint: 'https://pcps-adapter.google.example/v1/family', enabled: false },
  { id: uuidv4(), name: 'Microsoft Family Safety', endpoint: 'https://pcps-adapter.microsoft.example/v1/family', enabled: false },
  { id: uuidv4(), name: 'Nintendo Parental Controls', endpoint: 'https://pcps-adapter.nintendo.example/v1/family', enabled: false },
  { id: uuidv4(), name: 'Amazon Kids+', endpoint: 'https://pcps-adapter.amazon.example/v1/family', enabled: false },
];

export function createPlatform(): Platform {
  return { id: uuidv4(), name: '', endpoint: '', enabled: true };
}
