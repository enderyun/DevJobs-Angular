import { 
  ChangeDetectionStrategy, 
  Component, 
  inject,
  signal,
  effect
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchFormSection } from '../../components/search-form-section/search-form-section';
import { JobListings } from '../../components/job-listings/job-listings';
import { Pagination } from '../../components/pagination/pagination';
import { Job } from '../../models/job.model';

@Component({
  selector: 'app-search',
  imports: [SearchFormSection, JobListings, Pagination],
  templateUrl: './search.html',
  styleUrl: './search.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Search {
  // Leer la ruta 
  private readonly route = inject(ActivatedRoute);

  readonly filters = signal({
    technology: this.route.snapshot.queryParamMap.get('technology') ?? '',
    location: this.route.snapshot.queryParamMap.get('location') ?? '',
    experienceLevel: this.route.snapshot.queryParamMap.get('experienceLevel') ?? '',
  });

  readonly textToFilter = signal(this.route.snapshot.queryParamMap.get('text') ?? '');

  readonly jobs = signal<Job[]>([]);

  readonly currentPage = signal(() => {
    const page = Number(this.route.snapshot.queryParamMap.get('page'))
    return !page || page < 1 ? 1 : page;
  })();

  readonly total = signal(0);
}