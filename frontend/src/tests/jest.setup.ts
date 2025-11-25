// Configuración de Jest: extender expect o añadir globals si es necesario
import '@testing-library/jest-dom';

// Silenciar console.log durante los tests salvo que se necesite explícitamente
if (typeof jest !== 'undefined') {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });
}
