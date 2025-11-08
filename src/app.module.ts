import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module'
import { PostModule } from './creator/post/post.module';
import { ChapterModule } from './creator/chapter/chapter.module'
import { PodcastModule } from './creator/podcast/podcast.module'
import { LongvideoModule } from './creator/longvideo/longvideo.module';
@Module({
  imports: [UserModule, AuthModule, PostModule, ChapterModule, PodcastModule, LongvideoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
