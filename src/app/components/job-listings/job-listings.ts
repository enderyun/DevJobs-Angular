import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-job-listings',
  imports: [],
  templateUrl: './job-listings.html',
  styleUrl: './job-listings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobListings {}
