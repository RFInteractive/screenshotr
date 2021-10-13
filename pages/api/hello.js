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
    createSiteDirectories(websites);
    await screenshotSites(websites);
    res.status(200).end('complete')
  } catch(error) {
    res.status(500).end(error.toString());
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

const createSiteDirectories = (sites) => {
  sites.forEach( site => 
    fs.mkdirSync(path.join(process.cwd(), `./public/static/screenshots/${site.directoryName}`), { recursive: true })
  );
  return;
}

const screenshotSites = async (sites) => {

  return await Promise.all(sites.map( async(site) => {
    await screenshotUrls(site.urls, site.directoryName);
  }))

}

const screenshotUrls = async (urls, directory) => { // [promise, promise, promise] => Promise({resolved, err, resolved, resolved, err})
    return await Promise.all(urls.map( url => {
      return captureWebsite.file(
        url.url, path.join(process.cwd(), 
        `./public/static/screenshots/${directory}/${url.name}.png`), 
        { delay: 2 }
        )
    }))
}