export class CreateCommentDto {
  userId: string;
  targetId: string;
  text: string;
  parentId?: string;
}
