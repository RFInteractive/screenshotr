// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import nc from 'next-connect';
import path from 'path';
import captureWebsite from 'capture-website';
import fs from 'fs';

const handler = nc().get(async (req, res) => {

  // delete child directories in /screenshots
  // loop through array of websites
  // create directory in screenshots for each website
  // screenshot each site with proper path
  // respond with ok

    await screenshotSites(ourSites);
    res.json({ status: 'all donezo!'});
});

export default handler;

const ourSites = [
  {
    directoryName: "rank-fuse",
    domain: "rankfuse.com",
    urls: [ {
      name: 'home',
      url:'https://rankfuse.com',
    },
    {
      name: 'seo',
      url:'https://rankfuse.com/services/search-engine-marketing-sem/',
    },
    {
      name: 'contact',
      url:'https://rankfuse.com/contact-us/',
    },
    {
      name: 'quote',
      url:'https://rankfuse.com/request-quote/',
    },]
  }
]

const screenshotSites = async (sites) => {

  fs.rmdirSync(path.join(process.cwd(), './public/screenshots'), { recursive: true });

  try {
    return await Promise.all(sites.map( async(site) => {
        createDirectory(site.directoryName);
        await screenshotSiteUrls(site.urls, site.directoryName);
      }))
  } catch(outerError) {
    console.log('screenshotSites error: '+ outerError)
  }

}

const createDirectory = (directory) => {
    fs.mkdirSync(path.join(process.cwd(), `./public/screenshots/${directory}`), { recursive: true });
    return;
}

const screenshotSiteUrls = async (urls, directory) => {
  try {
    return await Promise.all(urls.map( url => {
      return captureWebsite.file(url.url, path.join(process.cwd(), `./public/screenshots/${directory}/${url.name}.png`), { delay: 2 })
    }))
  } catch(err) {
    console.log('screenshotSiteUrls error: ' + err);
  }
}