// Import de React no requerido aquí (JSX gestionado por tsconfig)
import { render, screen, fireEvent } from '@testing-library/react';
import { useCart } from '../useCart';

function CartTestComponent() {
  const { cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, itemCount, cartTotal } = useCart();
  return (
    <div>
      <div data-testid="count">{cart.length}</div>
      <div data-testid="items">{itemCount}</div>
      <div data-testid="total">{cartTotal}</div>
      <button onClick={() => addToCart({ id: 999, name: 'Prueba', price: 100 } as any)}>add</button>
      <button onClick={() => increaseQuantity(999)}>inc</button>
      <button onClick={() => decreaseQuantity(999)}>dec</button>
      <button onClick={() => removeFromCart(999)}>remove</button>
      <button onClick={() => clearCart()}>clear</button>
    </div>
  );
}

describe('useCart (component pattern)', () => {
  beforeEach(() => {
    // asegurar que localStorage comienza vacío
    localStorage.clear();
  });

  it('agrega un ítem y actualiza conteos y total', () => {
    render(<CartTestComponent />);

    expect(screen.getByTestId('count').textContent).toBe('0');
    fireEvent.click(screen.getByText('add'));
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('items').textContent).toBe('1');
    expect(screen.getByTestId('total').textContent).toBe('100');

  // incrementar cantidad
    fireEvent.click(screen.getByText('inc'));
    expect(screen.getByTestId('items').textContent).toBe('2');
    expect(screen.getByTestId('total').textContent).toBe('200');

  // decrementar cantidad
    fireEvent.click(screen.getByText('dec'));
    expect(screen.getByTestId('items').textContent).toBe('1');

  // eliminar
    fireEvent.click(screen.getByText('remove'));
    expect(screen.getByTestId('count').textContent).toBe('0');
  });
});
