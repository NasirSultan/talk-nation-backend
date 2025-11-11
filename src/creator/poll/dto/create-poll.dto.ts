export class CreatePollDto {
  question: string;
  options: string[];
  categories?: string[];
  view?: 'PUBLIC' | 'PRIVATE' | 'FOLLOWERS';
  allowAnonymous?: boolean;
  showResults?: boolean;
  allowComments?: boolean;
  allowReactions?: boolean;
  allowShare?: boolean;
  sendNotification?: boolean;
  featured?: boolean;
  scheduledAt?: Date | string;
    authorId: string;
}
