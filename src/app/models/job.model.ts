export interface Job {
  id: string;
  titulo: string;
  empresa: string;
  ubicacion: string;
  descripcion: string;
  data: {
    technology: string | string[];
    modalidad: string;
    nivel: string;
  };
  content: {
    descripcion: string;
    responsibilities: string;
    requirements: string;
    about: string;
  };
}

export interface SearchFilters {
  technology?: string
  location?: string 
  experienceLevel?: string 
}