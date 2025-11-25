import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar';

describe('Navbar', () => {
  it('muestra el conteo del carrito y abre el modal de login', () => {
  const setCategory = jest.fn();
  const cart = [{ id: 1, name: 'X' }];
  render(<Navbar cart={cart as any} setCategory={setCategory} itemCount={1} /> as any);

  expect(screen.getAllByText('1').length).toBeGreaterThan(0);

  // Abrir modal de contacto haciendo click en el enlace
  const contacto = screen.getByText(/¡Contáctanos!/i);
  fireEvent.click(contacto);
  // El modal de contacto debe mostrar dirección y email
  expect(screen.getByText(/Dirección:/i)).toBeInTheDocument();
  expect(screen.getByText(/contacto@jimuebles.com/i)).toBeInTheDocument();
  });
});
