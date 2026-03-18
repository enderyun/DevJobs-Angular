import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { SearchFilters } from '../../models/job.model';

@Component({
  selector: 'app-search-form-section',
  imports: [],
  templateUrl: './search-form-section.html',
  styleUrl: './search-form-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFormSection {
  readonly initialText = input<string>('');
  readonly initialFilters = input<SearchFilters>({});
  
  readonly onSearch = output<SearchFilters>();
  readonly onTextFilter = output<string>();

  readonly nameText = 'text';
  readonly nameTechnology = 'technology';
  readonly nameLocation = 'location';
  readonly nameExperienceLevel = 'experienceLevel';

  private timeoutId: number | null = null;
  
  // el evento es compartido entre el input del usuario en el formulario, como los select
  // (technology, location, experienceLevel). 
  // Se podria implementar con rxJS para mejorar el manejo de errores y que sea mas escalable,
  // pero se puede hacer despues.
  handleSubmit(event: Event) {
    const target = event.target as HTMLInputElement | HTMLSelectElement;

    if (target.name === this.nameText) {
      const text = target.value;

      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      this.timeoutId = setTimeout(() => {
        this.onTextFilter.emit(text);
      }, 500);
      
      return;
    }

    // Puede causar problemas si se tiene el preventDefault antes de los input del form.
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const filters: SearchFilters = {
      technology: formData.get(this.nameTechnology) as string ?? '',
      location: formData.get(this.nameLocation) as string ?? '',
      experienceLevel: formData.get(this.nameExperienceLevel) as string ?? ''
    };

    this.onSearch.emit(filters);
  }

}
