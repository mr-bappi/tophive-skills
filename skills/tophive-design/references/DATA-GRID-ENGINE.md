# Data Grid Engine — scalable, honest, accessible tables

Load when datasets, column counts or user task complexity warrant it. Not every list needs virtualization or a data grid dependency.

## Inventory the data contract
Record entity ID, schema, row count, expected fetch/page size, server/client sort/filter boundaries, nullable values, permissions, update frequency, selection scope and persistence. Distinguish current page selection vs **all matching server-side rows** explicitly. Stable row IDs are mandatory.

## Recommended responsibilities
- Table state (columns, sorting, filters, selection, expanded rows): existing grid/Table library, e.g. TanStack Table when appropriate. Headless library does not provide visual accessibility automatically.
- Rendering large visible windows: TanStack Virtual or host equivalent; profile before adding it.
- Remote data: stable query keys, request cancellation, debounced search where justified, server-side pagination/filter/sort when dataset large.
- Layout: measured widths, min/max resize constraints, sticky pin offsets, owned z-index layers, overflow containers and scroll boundaries.
- Charts: accessible legend, truthful axes, useful tooltips and an equivalent text/table summary.

## Non-negotiable edge cases
1. Pinned columns don't overlap, drift or obscure row actions when horizontal scrolling. Test resize, RTL when supported and zoom.
2. Virtual rows preserve correct key/identity and scroll-to-record; dynamic heights and expanded rows must update measurements, not jump or flicker.
3. Keyboard nav follows visible logical rows; announce selection/sort/record updates; never implement ARIA grid semantics half-way. Prefer semantic table if full grid keyboard model isn't implemented.
4. Skeleton/loading rows must not imply data. Empty vs no-filter-match vs backend error vs no permission must be distinct.
5. Sorting/filtering/pagination reflect server truth. Never sort just the current page while labeling results global.
6. Charts and bulk edits share query state with the grid or explicitly explain differing scope.
7. Export and select-all respect permitted fields and server auth; never imply front-end visibility restriction is security.

## Example of stable row identity
```ts
const table = useReactTable({
  data: rows,
  columns,
  getRowId: (row) => row.id,
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true, // only when server pages
  manualSorting: true,    // only when server sorting
});
```
Example assumes the named imports and TanStack version are actually installed; verify APIs against local dependency. Virtualization is a separate concern, not an implicit feature of this snippet.

## QA matrix
10, 1k and 100k-row **representative fixtures** where feasible; 1, 5 and 20+ columns as task demands; page/search/sort/filter/select/resize/pin/scroll/drawer; 390/768/1440, keyboard, 200% zoom, performance traces and network failure. Specify sizes tested; avoid a fabricated FPS or 100k-pass claim.
