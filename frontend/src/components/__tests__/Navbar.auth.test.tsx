import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import Navbar from '../Navbar';

describe('Modales de autenticación en Navbar', () => {
  it('abre el modal de login, muestra validación con datos inválidos y cierra con envío válido', async () => {
    render(<Navbar /> as any);

    // Abrir el menú de login de escritorio: buscar el item 'Iniciar sesión' en el dropdown
    const desktopToggle = screen.getAllByRole('button', { hidden: true })
      .find(b => b.getAttribute('id') === 'loginDropdown');
    // Si el toggle existe, hacer click para mostrar el menú
    if (desktopToggle) fireEvent.click(desktopToggle);

    // Hacer click en 'Iniciar sesión' para abrir el modal
    const iniciar = screen.getAllByText(/Iniciar sesión/i)[0];
    fireEvent.click(iniciar);

  // Ahora el modal debe mostrarse; acotar consultas al diálogo
  const dialog = screen.getByRole('dialog');
  const modal = within(dialog);
  expect(modal.getByText(/Dirección de correo electrónico/i)).toBeInTheDocument();

  // Enviar email inválido
  const email = modal.getByPlaceholderText(/Ingresa tu email/i);
  const password = modal.getByPlaceholderText(/Contraseña/i);
  fireEvent.change(email, { target: { value: 'bademail' } });
  fireEvent.change(password, { target: { value: '123' } });
  const enviar = modal.getByRole('button', { name: /Enviar/i });
  fireEvent.click(enviar);

  // El envío inválido debe mantener el modal abierto
  expect(screen.getByRole('dialog')).toBeInTheDocument();

  // Enviar datos válidos (email válido y contraseña >= 6) y verificar que el modal se cierra
  fireEvent.change(email, { target: { value: 'test@example.com' } });
  fireEvent.change(password, { target: { value: '123456' } });
  fireEvent.click(enviar);

  // Tras envío válido, el diálogo debe desaparecer
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('abre el modal de registro y valida los datos de entrada', async () => {
    render(<Navbar /> as any);

    const desktopToggle = screen.getAllByRole('button', { hidden: true })
      .find(b => b.getAttribute('id') === 'loginDropdown');
    if (desktopToggle) fireEvent.click(desktopToggle);

    const registrar = screen.getAllByText(/Registrar/i)[0];
    fireEvent.click(registrar);

  // Debe renderizar el modal de registro y acotar al diálogo
  const dialog2 = screen.getByRole('dialog');
  const modal2 = within(dialog2);
  expect(modal2.getByText(/Dirección de correo electrónico/i)).toBeInTheDocument();

  const email2 = modal2.getByPlaceholderText(/Ingresa tu email/i);
  const password2 = modal2.getByPlaceholderText(/Contraseña/i);
  const checkbox = modal2.getByLabelText(/Confirmo que soy mayor de 18 años/i);
  const enviar2 = modal2.getByRole('button', { name: /Enviar/i });

  // Email inválido
  fireEvent.change(email2, { target: { value: 'nope' } });
  fireEvent.change(password2, { target: { value: '123' } });
  fireEvent.click(enviar2);
  // El envío inválido mantiene el modal abierto
  expect(screen.getByRole('dialog')).toBeInTheDocument();

  // Email válido pero falta confirmar mayor de 18
  fireEvent.change(email2, { target: { value: 'reg@example.com' } });
  fireEvent.change(password2, { target: { value: '123456' } });
  fireEvent.click(enviar2);
  // Falta confirmación mantiene el modal abierto
  expect(screen.getByRole('dialog')).toBeInTheDocument();

  // Marcar el checkbox y enviar — el modal debe cerrarse
  fireEvent.click(checkbox);
  fireEvent.click(enviar2);
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
