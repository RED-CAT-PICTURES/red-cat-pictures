import type { Page } from 'puppeteer'
import puppeteer from 'puppeteer'
import pMap from 'p-map'
import { XMLParser } from 'fast-xml-parser'

export default defineTask({
  meta: {
    name: 'sync:cache',
    description: 'Warmup Media Cache',
  },
  async run() {
    const config = useRuntimeConfig()
    const SITE_URL = config.public.siteUrl //'https://redcatpictures.com' //
    const BROWSER_ENDPOINT = import.meta.env.BROWSER_ENDPOINT
    const NODE_ENV = import.meta.env.NODE_ENV

    // 1. fetch & parse sitemap.xml to get links
    const sitemapXML = await $fetch(`/sitemap.xml`)
    const xmlParser = new XMLParser()
    const links = (xmlParser.parse(sitemapXML)?.urlset?.url?.map((u) => SITE_URL + '/' + u.loc?.split('/').slice(3).join('/')) || []) as string[]

    // 2. launch Puppeteer browser
    const browser = await puppeteer.launch(
      NODE_ENV === 'production'
        ? {
            browserWSEndpoint: BROWSER_ENDPOINT,
            args: ['--no-sandbox', '--disable-dev-shm-usage'],
          }
        : { headless: false, args: ['--no-sandbox', '--disable-dev-shm-usage'] }
    )

    const viewports = {
      desktop: { width: 1920, height: 1080 },
      mobile: { width: 375, height: 812, isMobile: true },
    }

    let vistedLinks = 0
    const totalLinks = links.length
    // 3. visit every link in parallel, both desktop & mobile
    await pMap(
      links,
      async (url) => {
        for (const mode of ['desktop', 'mobile'] as const) {
          let page: Page
          try {
            page = await browser.newPage()
            await page.setCacheEnabled(false)
            await page.setViewport(viewports[mode])

            await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 })
            //  optionally, wait a bit or trigger additional interactions
            // await page.waitForNetworkIdle({ idleTime: 10000 })
            // success: render complete!
          } catch {
            // log error if desired
            console.error(`Failed to render ${url} [${mode}]`)
          } finally {
            vistedLinks++
            console.log(`Links visited ${vistedLinks}/${totalLinks} -> ${Math.fround(vistedLinks / totalLinks) * 100}`)
            if (page) await page.close()
          }
        }
      },
      { concurrency: 20 }
    )

    await browser.close()
    return { result: 'Cache warmup completed.' }
  },
})
