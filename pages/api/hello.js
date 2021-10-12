// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import nc from 'next-connect';
import path from 'path';
import captureWebsite from 'capture-website';
import fs from 'fs';

import websites from '../../lib/websites';

const handler = nc().get(async (req, res) => {
    await screenshotSites(websites);
    res.json({ status: 'all donezo!'});
});

export default handler;

const screenshotSites = async (sites) => {

  fs.rmdirSync(path.join(process.cwd(), './public/static/screenshots/'), { recursive: true });

  try {
    return await Promise.all(sites.map( async(site) => {
        checkForScreenshotDirectory();
        createSiteDirectory(site.directoryName);
        await screenshotSiteUrls(site.urls, site.directoryName);
      }))
  } catch(outerError) {
    console.log('screenshotSites error: '+ outerError)
  }

}

const checkForScreenshotDirectory = () => {
  if(!fs.existsSync(path.join(process.cwd(), `./public/static/screenshots`))) {
    fs.mkdirSync(path.join(process.cwd(), `./public/static/screenshots`));
    return;
  }
  return;
}

const createSiteDirectory = (directory) => {
    fs.mkdirSync(path.join(process.cwd(), `./public/static/screenshots/${directory}`), { recursive: true });
    return;
}

const screenshotSiteUrls = async (urls, directory) => {
  try {
    return await Promise.all(urls.map( url => {
      return captureWebsite.file(url.url, path.join(process.cwd(), `./public/static/screenshots/${directory}/${url.name}.png`), { delay: 2 })
    }))
  } catch(err) {
    console.log('screenshotSiteUrls error: ' + err);
  }
}