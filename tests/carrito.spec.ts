
import { test, expect } from '@playwright/test';

test.describe('Carrito de compras', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalogo.html');
  });

  
test('muestra los 4 productos del catálogo', async ({ page }) => {
  // Esperar a que la API cargue los productos.
  await expect(page.getByTestId('producto')).toHaveCount(4, {
    timeout: 15000,
  });
});


  test('agregar dos productos actualiza el contador', async ({ page }) => {
    await test.step('Agregar el teclado', async () => {
      await page.getByTestId('producto')
        .filter({ hasText: 'Teclado mecánico' })
        .getByRole('button', { name: 'Agregar al carrito' })
        .click();
    });

    await test.step('Agregar el mouse', async () => {
      await page.getByTestId('producto')
        .filter({ hasText: 'Mouse inalámbrico' })
        .getByRole('button', { name: 'Agregar al carrito' })
        .click();
    });

    await expect(page.getByTestId('contador-carrito')).toHaveText('2');
  });

  test('el buscador filtra los productos', async ({ page }) => {
    await page.getByPlaceholder('Buscar producto').fill('monitor');

    const productos = page.getByTestId('producto');
    await expect(productos).toHaveCount(1);
    await expect(productos.first()).toContainText('Monitor 24 pulgadas');
  });

  test('vaciar carrito deja el contador en 0 sin errores de JavaScript', async ({ page }) => {
    const errores: string[] = [];

    page.on('pageerror', (error) => {
      errores.push(error.message);
    });

    page.on('console', (mensaje) => {
      if (mensaje.type() === 'error') {
        errores.push(mensaje.text());
      }
    });

    // Esperar a que los productos estén disponibles.
    await expect(page.getByTestId('producto')).toHaveCount(4, {
  timeout: 15000,
});

    // Agregar un producto al carrito.
    await page.getByTestId('producto')
      .first()
      .getByRole('button', { name: 'Agregar al carrito' })
      .click();

    await expect(page.getByTestId('contador-carrito')).toHaveText('1');

    // Vaciar el carrito y comprobar el contador.
    await page.getByRole('button', { name: 'Vaciar carrito' }).click();

    await expect(page.getByTestId('contador-carrito')).toHaveText('0');

    // Verificar que no ocurrieron errores de JavaScript.
    expect(errores).toEqual([]);
  });
});
