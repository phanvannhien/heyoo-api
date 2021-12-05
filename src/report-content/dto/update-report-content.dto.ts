import { PartialType } from '@nestjs/mapped-types';
import { CreateReportContentDto } from './create-report-content.dto';

export class UpdateReportContentDto extends PartialType(CreateReportContentDto) {}
