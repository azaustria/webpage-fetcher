import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { JSDOM } from 'jsdom';

async function fetchPageFromUrl(url: string) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching page from ${url}: ${(error as Error).message}`);
  }
}

async function savePageContentAndMetadata(url: string, content: string) {
  try {
    const hostname = new URL(url).hostname;
    const filename = `${hostname}.html`;
    await fs.writeFile(filename, content);
    const dom = new JSDOM(content);

    const links = dom.window.document.querySelectorAll('a');
    const images = dom.window.document.querySelectorAll('img');

    const metadata = {
      site: hostname,
      num_links: links.length,
      images: images.length,
      last_fetch: new Date().toUTCString(),
    };

    const metadataString = `--metadata ${url}\n${Object.entries(metadata)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')}`;

    console.log(metadataString);
    console.log(`Page saved as ${filename}`);
  } catch (error) {
    console.error(`We are having error(s) saving page content and generating metadata for ${url}:`, (error as Error).message);
  }
}

async function main() {
  const urls = process.argv.slice(2);

  if (urls.length === 0) {
    process.exit(1);
  }

  try {
    for (const url of urls) {
      const pageContent = await fetchPageFromUrl(url);
      await savePageContentAndMetadata(url, pageContent);
    }
  } catch (error) {
    console.error('Error:', (error as Error).message);
  }
}

main();
