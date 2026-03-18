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
import type { Job, SearchFilters } from '../../models/job.model';
import { HttpParams, httpResource } from '@angular/common/http';

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

  readonly filters = signal<SearchFilters>({
    technology: this.route.snapshot.queryParamMap.get('technology') ?? '',
    location: this.route.snapshot.queryParamMap.get('type') ?? '',
    experienceLevel: this.route.snapshot.queryParamMap.get('level') ?? '',
  });

  readonly textToFilter = signal(this.route.snapshot.queryParamMap.get('text') ?? '');

  readonly currentPage = signal((() => {
    const page = Number(this.route.snapshot.queryParamMap.get('page'));
    return !page || page < 1 ? 1 : page;
  })());


  // ─── FETCH A LA API ───────────────────────────────────────────────────────
  // Funciona con interceptores.
  // La función () => ({ url, params }) es reactiva. Angular detecta
  // automáticamente cuales signals se leen dentro y re-lanza el fetch
  // cuando alguno cambia.
  readonly jobsResource = httpResource<{ data: Job[]; total: number; limit: number; offset: number }>(() => {
    const filters = this.filters()
    const text = this.textToFilter()

    let params = new HttpParams()
      .set('offset', (this.currentPage() - 1) * RESULTS_PER_PAGE)
      .set('limit', RESULTS_PER_PAGE)

      if (filters.technology) params = params.set('technology', filters.technology)
      if (filters.location) params = params.set('type', filters.location)
      if (filters.experienceLevel) params = params.set('level', filters.experienceLevel)
      if (text) params = params.set('text', text)

      return {
        url: 'http://localhost:3000/jobs',
        params,
      }
  });


  // ─── ACTUALIZAR LA URL ────────────────────────────────────────────────────
  // El motivo de no usar httpParams es porque el effect usa Router.navigate, no 
  // httpClient. Router.navigate espera un {} y no parametros.
  
  readonly paginationBaseQueryParams = computed(() => {
    const filters = this.filters();
    const textToFilter = this.textToFilter();
    const queryParams: Record<string, string | number> = {};

    if (filters.technology) queryParams['technology'] = filters.technology;
    if (filters.location) queryParams['type'] = filters.location;
    if (filters.experienceLevel) queryParams['level'] = filters.experienceLevel;
    if (textToFilter) queryParams['text'] = textToFilter;

    return queryParams;
  });

  readonly searchQueryParams = computed(() => {
    const currentPage = this.currentPage();
    const queryParams = { ...this.paginationBaseQueryParams() };

    if (currentPage > 1) queryParams['page'] = currentPage;

    return queryParams;
  });

  constructor() {
    effect(() => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: this.searchQueryParams(),
        replaceUrl: true,
      });
    });
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

  handleSearch(filters: SearchFilters) {
    this.filters.set(filters);
    this.currentPage.set(1);
  }

  handleTextFilter(text: string) {
    this.textToFilter.set(text);
    this.currentPage.set(1);
  }

  handlePageChange(page: number) {
    this.currentPage.set(page);
  }

}