const puppeteer = require('puppeteer');

async function scrapingService(url) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const productItem = await page.evaluate(() => {
    const productItem = {};

    // Obtener la imagen del producto
    const imgElement = document.querySelector('.ImgZoom_ContainerImage__0r4y9 img');
    productItem.Presentacion = imgElement ? imgElement.src : '';

    // Obtener el título del producto
    const titleElement = document.querySelector('h1.product-title_product-title__heading___mpLA');
    const title = titleElement ? titleElement.innerText.trim() : '';
    productItem.Producto = title;

    // Extraer el tamaño del título
    const mlMatch = title.match(/(\d+)\s*ml/i);
    const grMatch = title.match(/(\d+)\s*gr/i);
    const mMatch = title.match(/(\d+)\s*m\./i);
    
    if (mlMatch) {
      productItem.Size = mlMatch[1];
    } else if (grMatch) {
      productItem.Size = grMatch[1];
    } else if (mMatch) {
      productItem.Size = mMatch[1];
    } else {
      productItem.Size = '';
    }

    // Obtener el precio del producto
    const priceElement = document.querySelector('p.ProductPrice_container__price__LS1Td') || 
                         document.querySelector('p.ProductPrice_container__price__XmMWA');
    productItem.Precio = priceElement ? priceElement.innerText.trim() : '';

    // Obtener la marca del producto
    const brandElement = document.querySelector('span.product-title_product-title__specification__UTjNc');
    const category = brandElement ? brandElement.innerText.split(':') : [''];
    productItem.Marca = category[0].trim();

    return productItem;
  });

  productItem.URL = url;
  productItem.Canal = "Exito";

  await browser.close();
  return productItem;
}

// Ejemplo de uso
scrapingService('https://www.exito.com/whisky-fines-grouse-8a-the-famous-grouse-700-ml-615959/p')
  .then(product => console.log(product))
  .catch(err => console.error(err));
