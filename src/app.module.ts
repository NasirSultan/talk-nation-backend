import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module'
import { PostModule } from './creator/post/post.module';
import { ChapterModule } from './creator/chapter/chapter.module'
import { PodcastModule } from './creator/podcast/podcast.module'
import { LongvideoModule } from './creator/longvideo/longvideo.module';
import { ReelModule } from './creator/reel/reel.module';
import { BlogModule } from './creator/blog/blog.module';
import { PollModule } from './creator/poll/poll.module';
import { LivestreamModule } from './creator/livestream/livestream.module';
import { AgoraModule } from './agora/agora.module';
import { ReactionModule } from './interactions/reaction/reaction.module';
import { CommentModule } from './interactions/Comment/comment.module';
import { ShareModule } from './interactions/share/share.module';
import { BookmarkModule } from './interactions/bookmark/bookmark.module';
import { AnalyticsModule } from './interactions/analytics/analytics.module';



@Module({
 imports: [
  UserModule,
  AuthModule,
  PostModule,
  AnalyticsModule,
  ChapterModule,
  PodcastModule,
  LongvideoModule,
  ReelModule,
  BlogModule,
  PollModule,
AgoraModule,
  LivestreamModule,
  ReactionModule,
  CommentModule,
  ShareModule,
  BookmarkModule,
],

 
 
 
 
 
 
 
 
 
 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
