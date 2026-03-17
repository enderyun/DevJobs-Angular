import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchFormSection } from '../../components/search-form-section/search-form-section';
import { JobListings } from '../../components/job-listings/job-listings';
import { Pagination } from '../../components/pagination/pagination';
import { type Job } from '../../models/job.model';
import { httpResource } from '@angular/common/http';

const RESULTS_PER_PAGE = 4;

@Component({
  selector: 'app-search',
  imports: [SearchFormSection, JobListings, Pagination],
  templateUrl: './search.html',
  styleUrl: './search.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Search {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly filters = signal({
    technology: this.route.snapshot.queryParamMap.get('technology') ?? '',
    location: this.route.snapshot.queryParamMap.get('location') ?? '',
    experienceLevel: this.route.snapshot.queryParamMap.get('experienceLevel') ?? '',
  });

  readonly textToFilter = signal(this.route.snapshot.queryParamMap.get('text') ?? '');

  readonly currentPage = signal(() => {
    const page = Number(this.route.snapshot.queryParamMap.get('page'));
    return !page || page < 1 ? 1 : page;
  })();


  // ─── FETCH A LA API ───────────────────────────────────────────────────────
  // Funciona con interceptores.
  // La función () => ({ url, params }) es reactiva. Angular detecta
  // automáticamente cuales signals se leen dentro y re-lanza el fetch
  // cuando alguno cambia.
  readonly jobsResource = httpResource<{ data: Job[]; total: number; limit: number; offset: number }>(() => ({
    url: 'http://localhost:3000/api/jobs',
    params: {
      technology: this.filters().technology,
      location: this.filters().location,
      experienceLevel: this.filters().experienceLevel,
      text: this.textToFilter(),
      offset: (this.currentPage() - 1) * RESULTS_PER_PAGE,
      limit: RESULTS_PER_PAGE,
    },
    method: 'GET',
  }));


  // ─── ACTUALIZAR LA URL ────────────────────────────────────────────────────
  constructor() {
    effect(() => {
      const filters = this.filters()
      const textToFilter = this.textToFilter()
      const currentPage = this.currentPage()

      const queryParams: Record<string, string | number> = {}

      if (filters.technology) queryParams['technology'] = filters.technology
      if (filters.location) queryParams['type'] = filters.location
      if (filters.experienceLevel) queryParams['level'] = filters.experienceLevel
      if (textToFilter) queryParams['text'] = textToFilter
      if (currentPage > 1) queryParams['page'] = currentPage

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        replaceUrl: true,
      })

    })
  }


  readonly jobs = computed(() =>{
    if (this.jobsResource.hasValue()) {
      return this.jobsResource.value()?.data ?? [];
    }
    return [];
  });

  readonly total = computed(() => {
    if (this.jobsResource.hasValue()) {
      return this.jobsResource.value()?.total ?? 0;
    }
    return 0;
  });

  readonly totalPages = computed(() => Math.ceil(this.total() / RESULTS_PER_PAGE));

}