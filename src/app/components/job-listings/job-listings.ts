import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Job } from '../../models/job.model';
import { JobCard } from '../job-card/job-card';

@Component({
  selector: 'app-job-listings',
  imports: [JobCard],
  templateUrl: './job-listings.html',
  styleUrl: './job-listings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobListings {
  @Input() jobs!: Job[];
}
