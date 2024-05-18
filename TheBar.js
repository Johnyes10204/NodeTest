const puppeteer = require('puppeteer');

async function scrapingServiceTheBar(url) {
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
    Size: '',
    Marca: '',
    URL: url,
    Canal: 'TheBar'
  };

  try {
    // Extraer el precio del producto
    productItem.Precio = await page.$eval('span.vtex-store-components-3-x-currencyContainer', el => el.textContent.trim());

    // Extraer el título del producto
    const title = await page.$eval('.vtex-store-components-3-x-productBrand--pdp', el => el.textContent.trim());
    productItem.Producto = title;

    // Extraer la imagen del producto
    const imgSrc = await page.$eval('img.vtex-store-components-3-x-productImageTag', el => el.getAttribute('src'));
    productItem.Presentacion = imgSrc ? imgSrc : '';

    // Extraer el tamaño del producto utilizando expresiones regulares
    const sizeMatch = title.match(/(\d+)\s*(ml|gr|m\.)/i);
    if (sizeMatch) {
      productItem.Size = `${sizeMatch[1]} ${sizeMatch[2]}`;
    }

    // Extraer la marca del producto
    const brand = await page.$eval('.vtex-store-components-3-x-productBrandName--pdp', el => `${el.textContent.trim()}-PLU`);
    productItem.Marca = brand;

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
scrapingServiceTheBar('https://co.thebar.com/whisky-buchanans-18anos-special-reserve-x-750ml-bolsa-con-mono-y-tarjeta/p')
  .then(product => console.log(product))
  .catch(err => console.error(err));
