# PPL's Art Gallery
Do you want a place for showcasing your art? Do you want to fully customize the place? Do you want complete control of the place? Can't code? PPL's Art Gallery is for you!

PPL's Art Gallery is a website template for showcasing your artwork, based on 2000s-era art sharing sites such as DeviantArt. It is designed to be used easily by non-coders, being built with [Eleventy](https://www.11ty.dev/), the simpler static site generator. You don't need to edit fancy schmancy code, just some HTML/Markdown and CSS files and a little bit of JavaScript!

<img width="396" height="188" alt="image" src="https://github.com/user-attachments/assets/b74fc612-567a-44b6-b885-8c6af4bc7e72" />
<img width="396" height="188" alt="image" src="https://github.com/user-attachments/assets/dcdb9659-c2e2-4050-8dda-89abcc32245f" />
<img width="396" height="188" alt="image" src="https://github.com/user-attachments/assets/bc7bab66-f335-421c-ae51-a1db960448e0" />
<img width="396" height="188" alt="image" src="https://github.com/user-attachments/assets/8da4a707-a15c-4f18-ab80-7a2bd8c51fc7" />

* Load image files for your artwork, make their filenames URL-friendly with a custom command, and whip up their entries with titles, dates, alt text, and descriptions (Markdown is supported!).
* Sort your artwork into custom categories and with tags.
* Search your art gallery.
* Customize your gallery's look with HTML layout pages and a single CSS file.
* Add regular pages such as "About".
* Art can be zoomed in by clicking on its image on its page.
* Website is responsive and looks just as good on mobile screens.
* Images are automatically optimized for better website performance.
* Sitemap is automatically generated for indexing on search engines.
* Social media card metadata is automatically generated for convenient sharing on social media.
* RSS feed is automatically generated, so viewers can receive automatic updates.
* `robots.txt` file is provided for blocking AI crawlers, courtesy of the [ai.robots.txt repository](https://github.com/ai-robots-txt/ai.robots.txt). (Keep in mind this may not be enough regarding some sneakier crawlers, so please consult methods based on your host.)

With a free site host, such as [GitHub Pages](https://docs.github.com/en/pages), you can take this template, load it with your own artwork, and launch your art gallery online for the world to see.

Check out the [live demo](https://ppls-art-gallery.netlify.app/), featuring my artwork!

## How to use
### Local setup
Node.js and NPM are required. Please refer to the [installation guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) if you do not have them.

The preferred method of obtaining this template is cloning the repository via [Git](https://git-scm.com/). To do so, in the terminal, run the command `git clone https://github.com/PrincessPandaSource/PPL-s-Art-Gallery.git`. That way, you'll have your own Git repository where you can track and manage changes, and some site hosts allow automatic publishing via the repository. If you would not like to use Git, you can [download the ZIP](https://github.com/PrincessPandaSource/PPL-s-Art-Gallery/archive/refs/heads/main.zip).

In the terminal, set the current directory to the template's (this can be done with the `cd` command). Install dependencies, including Eleventy, by running `npm i`.

To run a local instance of the website, run `npm start`. To fully build the website, run `npm run build`. *(This is important if you are going to publish by manually uploading files, rather than having the host build from them.)*

Eleventy does not automatically delete files from the build. To wipe the `_site` folder, which contains the build, run `npm run clean`.

### Adding artwork
Artwork pages are generated from files in the `art` folder, and they use images stored in the `img/art` folder.

(You are free to delete all the pre-existing art pages and images!)

To add an artwork, first add an image to the `img/art` folder. (You may want it to named in a way that looks proper in URL, "like-this". To batch rename all images in the `img` folder, run `npm run slugify-image-names`.)

Then, create either an HTML or Markdown file in the `art` folder. It can be named anything. At the top, paste and fill in the following Eleventy front matter data:

```
---
title: "artwork's title here"
date: 2026-06-23
fileName: "artwork-image.png"
categories: [0, 1]
artTags: ["tag", "subject"]
altText: "description of the artwork for low-vision users and search"
---
```

(Categories are identified by numeral IDs. Go to the ["Categories"](#categories) section to learn about this.)

After the front matter data, you can write the description, marking it up according to your language.

To add images, put an image in the `img` folder. Add this Nunjucks import directly below the front matter data:
```
{%- import "components/plainPage.njk" as c %}
```

Then, add and fill this Nunjucks macro call at where you'd want the image to be:
```
{{ c.plainImg("path/to/src", "descriptive alt text", width in pixels without "px", "left or right") }}
```

And that's it! Once you build the site, the artwork shows up in the gallery, and you can go to its page. Not only that, but its categories and tags get their own pages featuring the artwork.

### Categories
Categories are defined in the `eleventy.config.js` file within the following code:

```
const artCategories = [
    {
        name: "Original art",
        id: 0
    },
    {
        name: "Sonic the Hedgehog fan art",
        id: 1
    },
    ...
    {
        name: "Silver Scripts",
        id: 4
    }
]
```

(Once again, you can clear all categories to make room for your own.)

To add a category, copy and paste a category entry and specify its name and numeral ID. Reordering the category, as in the "View by category" section on the front page, can be done by reordering the entry within the array. (Just make sure all entries before the last one each have a comma after it.)

### Customizing look
Layout files, located in the `_includes/layouts` folder, provide layouts for pages to reuse, so they don't have to be copied and pasted. If you want to add or change an HTML element or so on every page, such as within the header or footer, go to `main.html`. If you want to change the artwork pages in a similar manner, go to `art-page.html`, which uses `main.html` as its layout.

The look of the page, such as colors, fonts, and sizes and positions of HTML elements, is defined by the CSS file `main.css` in the `styles` folder. To figure how to change something, you can search online with something such as "css change background color".

Custom fonts are stored in the `fonts` folder. A good site for getting WOFF2 fonts, as such fonts are optimized for the web, from Google Fonts is [google webfonts helper](https://gwfh.mranftl.com/fonts).

To change how many gallery entries are on each page, for the main gallery, you can alter the pagination size in the `index.html` file's front matter data, and for categories and tags, you can alter the `pageSize` variable in either the `eleventyConfig.addCollection("artByCategories", function(collectionApi)` or `eleventyConfig.addCollection("artByTags", function(collectionApi)` functions in the `eleventy.config.js` file.

### Adding regular pages
First, create an HTML or Markdown file. Then, add and fill the following front matter data at the top. You are free to model after `about.html` as an example.

```
---
layout: layouts/main.html
title: "page's title here"
permalink: /optional-directory/page-title-in-url.html
description: "description of the page, which will be displayed in social media cards"
ogImage: "filename-of-image-to-show-on-social-media-card.png"
ogImageAlt: "descriptive alt text of image to show on social media card"
summaryLargeImage: true
---
```

(`ogImage` and `ogImageAlt` are optional, as they are already set in the `layouts/main.html` layout. It is recommended to set them to the first image in the page if there is one. `summaryLargeImage` should only be set if you want the social media card to display the image as large. While set in the layout file already, a specific `description` is recommended. Read ["Site configuration"](#site-configuration) to learn more about social media card settings.)

After that, you can fill in whatever HTML content you want on the page. Refer to ["Adding artwork"](#adding-artwork) for how to add images properly.

### Site configuration
The site's title and URL are set in the `siteSettings.json` file in the `_data` folder. (You must set them manually in `feed.njk`, the RSS feed file.)

Social media cards rely on the [Open Graph](https://ogp.me/) and [Twitter Card](https://web.archive.org/web/20230726041100/https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards) protocols, in which such metadata must be provided in the webpage code for the cards to render correctly. The default metadata is provided in the `_includes/layouts/main.html` file, where you can change the `author` and `twitter:site` metadata. The `description`, `ogImage`, and `ogImageAlt` fields can be set in the front matter data to change their respective metadata.

You are welcome to tweak and modify the website beyond the scope of what's covered here, but it is recommended that you have knowledge of Eleventy, JavaScript, and Nunjucks (the templating language used). You can get started with the [Eleventy docs](https://www.11ty.dev/docs/).

### Publishing
Once you're happy with your website, it's now ready to be published online via the web host of your choice.

The files in the `_site` folder are to be uploaded to the host, *if a full build is generated by running the `npm run build` command in the terminal*.

Some web hosts, such as [GitHub Pages](https://docs.github.com/en/pages), [Netlify](https://www.netlify.com/), [Vercel](https://vercel.com/), and [Cloudflare Pages](https://pages.cloudflare.com/), allow you to connect your online Git repository and auto-publish new versions when you push. Consult their guides to learn how to, as well as the Eleventy doc ["Deployment"](https://www.11ty.dev/docs/deployment/) for how to speed up buildtime (and not waste the free time given) and the special workflow needed for GitHub Pages.

(Here are some "magical" links for instant publishing: [On Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/PrincessPandaSource/PPL-s-Art-Gallery), [on Vercel](https://vercel.com/import/project?template=PrincessPandaSource%2FPPL-s-Art-Gallery))

## Giving feedback
If you would like to give a suggestion or report a bug or issue, the recommended method is to open an issue in the ["Issues"](https://github.com/PrincessPandaSource/PPL-s-Art-Gallery/issues) tab. If you would not like a GitHub account, you are free to contact me with a method [listed on my personal website](https://princesspandalover.com/#contact).

If you are experienced in coding and would like to contribute, you can make a pull request that I can look at. *(Please do not vibe code, as that is not real coding!)*

If you are using this template and would like your website to be showcased here, either open up an issue here or contact me personally. *Your website must be free of adult/NSFW/18+ or AI-generated content.*