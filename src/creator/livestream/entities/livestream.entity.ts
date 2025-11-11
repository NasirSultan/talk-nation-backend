import { Livestream, LobbySettings } from '@prisma/client';

export class LivestreamEntity implements Livestream {
  id: string;
  title: string;
  description: string | null;
  file: string | null;
  categories: string[];
  liveMode: 'ROMAN' | 'INTERVIEW';
  view: 'PUBLIC' | 'PRIVATE';
  allowComments: boolean;
  allowReactions: boolean;
  allowShare: boolean;
  featured: boolean;
  scheduledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  lobbySettings?: LobbySettings | null;
}
