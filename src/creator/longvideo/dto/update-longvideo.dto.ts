import { PartialType } from '@nestjs/mapped-types';
import { CreateLongvideoDto } from './create-longvideo.dto';

export class UpdateLongvideoDto extends PartialType(CreateLongvideoDto) {}
