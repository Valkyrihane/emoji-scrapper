const axios = require('axios');
const htmlParser = require('node-html-parser');

const util = require('util');
const fs = require('fs');
const writeFile = util.promisify(fs.writeFile);

const url = 'https://unicode.org/emoji/charts/full-emoji-list.html';
const dir = './emojison/';
const services = ['appl', 'goog', 'fb',
    'wind', 'twtr', 'joy', 'sams', 'gmail', 'sb', 'dcm', 'kddi'];

async function getRows() {
  let root;
  try {
    const { data: htmlData } = await axios.get(url);
    root = htmlParser.parse(htmlData);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  return root.querySelectorAll('tr');
}

function getEmoji(rows) {
  const data = {};
  const keys = ['nb', 'codes', 'browser', ...services, 'name'];

  rows.forEach((row) => {
    const rowData = { src: {} };
    let name = '';
    const cells = row.querySelectorAll('td');

    // avoid legend rows (containing th's), and new emoji rows
    if (cells.length !== keys.length) return;

    cells.forEach((cell, i) => {
      const key = keys[i];
      // if (key !== 'browser') return;
      if (['nb', 'browser'].includes(key)) rowData[key] = cell.firstChild.rawText;
      else if (key === 'codes') {
        const { rawText } = cell.querySelector('a').firstChild;
        rowData[key] = rawText.split(/\s+/);
      }
      else if (key === 'name') name = cell.firstChild.rawText;
      else {
        rowData.src[key] = '';
        // no emoji for current service
        if (cell.classNames.includes('miss')) return;
        const img = cell.querySelector('img');
        rowData.src[key] = img.getAttribute('src');
      }
    })
    if (!!name) data[name] = rowData;
  })
  return data;
}

async function writeData(data) {
  const servicesData = {};
  services.forEach((service) => {
    const serviceData = {};
    Object.keys(data).forEach((k) => {
      serviceData[k] = { ...data[k] };
      serviceData[k].src = data[k].src[service]
    })
    servicesData[service] = serviceData;
  });

  fs.mkdirSync(dir, { recursive: true });

  const servicesWriteArray = services.map((service) => {
    const toWrite = JSON.stringify(servicesData[service]);
    return writeFile(`${dir}${service}.json`, toWrite);
  });

  try {
    await Promise.all([
      writeFile(`${dir}emoji.json`, JSON.stringify(data)),
      ...servicesWriteArray,
    ]);
  } catch (e) {
    console.error(e);
  }
}

async function main() {
  const tableRows = await getRows();
  const data = getEmoji(tableRows);
  await writeData(data);
}

main();
