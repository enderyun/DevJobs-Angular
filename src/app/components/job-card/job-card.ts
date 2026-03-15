import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Job } from '../../models/job.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-job-card',
  imports: [RouterLink],
  templateUrl: './job-card.html',
  styleUrl: './job-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobCard {}
