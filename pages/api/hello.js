// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import nc from 'next-connect';
import path from 'path';
import captureWebsite from 'capture-website';
import fs from 'fs';

import websites from '../../lib/websites';

const handler = nc().get(async (_, res) => {
  try {
    checkForScreenshotDirectory();
    clearScreenshotDirectory();
    await screenshotSites(websites);
    res.status(200).end('complete')
  } catch(error) {
    res.status(500).end(err.toString());
  }

});

export default handler;

const checkForScreenshotDirectory = () => {
  if(!fs.existsSync(path.join(process.cwd(), `./public/static/screenshots`))) {
    fs.mkdirSync(path.join(process.cwd(), `./public/static/screenshots`));
    return;
  }
  return;
}

const clearScreenshotDirectory = () => {
  fs.rmdirSync(path.join(process.cwd(), './public/static/screenshots/'), { recursive: true });
}

const screenshotSites = async (sites) => {

  return await Promise.all(sites.map( async(site) => {
    createSiteDirectory(site.directoryName);
    await screenshotUrls(site.urls, site.directoryName);
  }))

}

const createSiteDirectory = (directory) => {
    fs.mkdirSync(path.join(
      process.cwd(), 
      `./public/static/screenshots/${directory}`), 
      { recursive: true }
    );
    return;
}

const screenshotUrls = async (urls, directory) => {
    return await Promise.all(urls.map( url => {
      return captureWebsite.file(
        url.url, path.join(process.cwd(), 
        `./public/static/screenshots/${directory}/${url.name}.png`), 
        { delay: 2 }
        )
    }))
}