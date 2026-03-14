# DevJobs — Angular 21 Migration 🅰️

Este proyecto es una extensión de aprendizaje del repositorio original **[DevJobs](https://github.com/enderyun/DevJobs)** con el objetivo de aprender Angular 21.

El backend (Express) es exactamente el mismo y se reutiliza tal cual.

## Objetivos de este repositorio

- **Migrar componentes de React a Angular**: Entender las equivalencias entre JSX y los templates de Angular, y entre Props e `input()`.
- **Aprender Signals**: Reemplazar Zustand y `useState` con el nuevo sistema de reactividad de Angular (`signal`, `computed`).
- **Dominar el Ecosistema Core**: Usar el `@angular/router` en vez de React Router, y `HttpClient` en vez de `fetch` nativo.
- **Aplicar Mejores Prácticas**: Arquitectura feature-based, Standalone Components, nuevo control flow (`@if`, `@for`) y manejo de formularios con Reactive Forms.

## ¿Cómo ejecutarlo?

1. Instalar dependencias:
   ```bash
   pnpm install
   ```

2. Ejecutar el servidor de desarrollo:
   ```bash
   pnpm start
   ```
   o
   ```bash
   ng serve
   ```

