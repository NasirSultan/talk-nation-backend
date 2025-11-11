import { LobbySettings } from '@prisma/client';

export class LobbySettingsEntity implements LobbySettings {
  id: string;
  livestreamId: string;
  enablePreShow: boolean;
  allowEarlyChat: boolean;
  showViewCount: boolean;
}
