const puppeteer = require('puppeteer');

async function scrapingServiceLicorera(url) {
  console.log(url);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--disable-sync',
      '--disable-default-apps',
      '--hide-scrollbars',
      '--mute-audio'
    ],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Definir la estructura del producto
  const productItem = {
    Producto: '',
    Precio: '',
    Presentacion: '',
    URL: url,
    Canal: 'LaLicorera'
  };

  try {
    // Extraer el título del producto
    productItem.Producto = await page.$eval('.l-main-title', el => el.textContent.trim());

    // Extraer el precio del producto
    productItem.Precio = await page.$eval('.product-actions-price', el => el.textContent.trim());

    // Extraer la imagen del producto
    const imgSrc = await page.$eval('img.product-gallery-preview-image', el => el.getAttribute('src'));
    productItem.Presentacion = imgSrc ? imgSrc : '';

    // Obtener el título de la página (para verificación)
    const pageTitle = await page.title();
    console.log(`Título de la página: ${pageTitle}`);
  } catch (error) {
    console.error(`Error al extraer datos: ${error}`);
  }

  await browser.close();
  return productItem;
}

// Ejemplo de uso
scrapingServiceLicorera('https://lalicorera.com/productos/whisky/chivas-extra')
  .then(product => console.log(product))
  .catch(err => console.error(err));
