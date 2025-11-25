import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';

describe('Barra de búsqueda (SearchBar)', () => {
  it('llama a onSearch al cambiar y al enviar', () => {
  const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} placeholder="Buscar..." />);

    const input = screen.getByPlaceholderText('Buscar...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'mesa' } });
    expect(onSearch).toHaveBeenCalledWith('mesa');

  // Enviar el formulario
  fireEvent.submit(input.closest('form')!);
  // Debió haberse llamado al menos dos veces (change + submit)
  expect(onSearch).toHaveBeenCalledTimes(2);
  });
});
