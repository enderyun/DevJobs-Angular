import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  readonly currentPage = input(1);
  readonly totalPages = input(5);
  readonly baseQueryParams = input<Record<string, string | number>>({});

  readonly onPageChange = output<number>();

  readonly pages = computed(() => {
    const totalPages = this.totalPages();
    const safeTotalPages = totalPages < 1 ? 1 : totalPages;
    return Array.from({ length: safeTotalPages }, (_, index) => index + 1);
  });

  readonly isFirstPage = computed(() => this.currentPage() <= 1);
  readonly isLastPage = computed(() => this.currentPage() >= this.totalPages());

  handlePrevClick(event: MouseEvent) {
    event.preventDefault();

    if (this.isFirstPage()) {
      return;
    }

    this.onPageChange.emit(this.currentPage() - 1);
  }

  handleNextClick(event: MouseEvent) {
    event.preventDefault();

    if (this.isLastPage()) {
      return;
    }

    this.onPageChange.emit(this.currentPage() + 1);
  }

  handleChangePage(event: MouseEvent, page: number) {
    event.preventDefault();

    if (page === this.currentPage()) {
      return;
    }

    this.onPageChange.emit(page);
  }

  buildQueryParams(page: number) {
    return {
      ...this.baseQueryParams(),
      page,
    };
  }
}
