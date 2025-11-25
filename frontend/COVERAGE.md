# Informe de cobertura de pruebas — frontend

Fecha: 2025-10-20

Resumen ejecutivo (actualizado)
- Statements: 72.77% (139/191)
- Branches: 53.48% (46/86)
- Functions: 65.21% (45/69)
- Lines: 74.39% (122/164)

Delta (qué cambió desde el último informe)
- Se añadieron tests para hooks (`useCart`, `useProductSearch`) y tests para los modales de autenticación (`Navbar` login/register). Estas adiciones incrementaron la cobertura en aproximadamente +12.04 puntos (statements) y +12.79 puntos (branches).

Qué se probó (actual)
- Componentes: `SearchBar`, `ProductCard`, `Navbar` — tests que cubren renderizado, interacciones DOM básicas (clics, envíos), y validaciones básicas en `Navbar`.
- Hooks: `useCart` (operaciones añadir/incrementar/decrementar/eliminar/clear y cálculo de totales) y `useProductSearch` (escucha de evento global `app:search` y filtrado).

Qué no está suficientemente cubierto (prioridad alta)
- Lógica interna de componentes más complejos y ramas condicionales (por ejemplo, modales de login/registro y flujos de error/éxito completos).
- Rutas de error y ramas en hooks y utilidades (p. ej. manejo de `localStorage` corrupto en `useCart`, límites MAX_ITEMS en todas las combinaciones).
- Validaciones detalladas y flujos asíncronos (si se añaden fetch/requests en el futuro).

Archivos/áreas recomendadas para agregar tests
1. `src/hooks/useCart.ts`
   - Añadir tests para carga inicial desde `localStorage` con datos inválidos y con cantidades fuera de rango.
   - Confirmar que `localStorage.setItem` se llama al actualizar el carrito (mock/spyon).
   - Tests para el comportamiento cuando se alcanza `MAX_ITEMS`.

2. `src/components/Navbar.tsx`
   - Flujos de login y registro: enviar formularios con inputs válidos e inválidos y verificar `onSuccess`/cierres de modal.
   - Verificar rendering/funcionalidad del `NavDropdown` y llamadas a `setCategory`.

3. `src/components/ProductCard.tsx`
   - Casos de imagen faltante o `specs` vacío (ramas fallback).

Cómo reproducir el reporte localmente
1. Abrir PowerShell en la carpeta `frontend`.
2. Ejecutar:
```powershell
npm install
npx jest --coverage --coverageReporters=text-summary --coverageDirectory=coverage
```
3. Verás un resumen en consola (text-summary) y el reporte HTML en `frontend/coverage/lcov-report/index.html`.

Pasos rápidos para mejorar cobertura (prioridad sugerida)
- Añadir tests unitarios para `useLoginForm` y `useRegisterForm` (validaciones) — fáciles de escribir con Test Component pattern.
- Añadir tests que simulen condiciones de `localStorage` corrupto/ya poblado para `useCart`.
- Escribir tests que abarquen flujos de error en `Navbar` (inputs invalidos) y pruebas E2E ligeras para modal show/hide con `@testing-library/react`.

Conclusión
La base de tests existe y las pruebas actuales pasan. El coverage está en ~60% de statements y ~40% de branches; con 6–10 tests adicionales enfocados en ramas críticas y validaciones se puede llegar a >80% de statements y mejorar branches sensiblemente.
