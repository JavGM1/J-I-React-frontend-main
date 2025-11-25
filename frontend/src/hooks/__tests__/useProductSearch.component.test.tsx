// Import de React no requerido aquí (JSX gestionado por tsconfig)
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { useProductSearch } from '../useProductSearch';
import { db } from '../../data/db';

function TestSearch({ products }: { products: any[] }) {
  const { query, filtered } = useProductSearch(products);
  return (
    <div>
      <div data-testid="query">{query}</div>
      <div data-testid="count">{filtered.length}</div>
    </div>
  );
}

describe('useProductSearch (component pattern)', () => {
  it('se actualiza cuando se despacha el evento app:search en window', () => {
    render(<TestSearch products={db} />);
    // inicialmente debe mostrar todos los productos
    expect(screen.getByTestId('count').textContent).toBe(String(db.length));

    // despachar un evento de búsqueda envuelto en act para que React procese la actualización
    act(() => {
      window.dispatchEvent(new CustomEvent('app:search', { detail: 'sofá' }));
    });
    // después del dispatch, el hook debe actualizar query/filtered
    expect(screen.getByTestId('query').textContent?.toLowerCase()).toContain('sofá');
  });
});
