# PPL's Art Gallery
Do you want a place for showcasing your art? Do you want to fully customize the place? Do you want complete control of the place? Can't code? PPL's Art Gallery is for you!

PPL's Art Gallery is a website template for showcasing your artwork, based on 2000s-era art sharing sites such as DeviantArt. It is designed to be used easily by non-coders, being built with [Eleventy](https://www.11ty.dev/), the simpler static site generator.

* Load image files for your artwork, make their filenames URL-friendly with a custom command, and whip up their entries with titles, dates, alt text, and descriptions (Markdown is supported!).
* Sort your artwork into custom categories and with tags.
* Search your art gallery, courtesy of [Pagefind](https://pagefind.app/).
* Customize your gallery's look with HTML layout pages and a single CSS file.
* Add regular pages such as "About".
* Art can be zoomed in by clicking on its image on its page.
* Images are automatically optimized for better website performance.
* Sitemap is automatically generated for indexing on search engines.
* Social media card metadata is automatically generated for convenient sharing on social media.
* RSS feed is automatically generated, so viewers can receive automatic updates.
* `robots.txt` file is provided for blocking AI crawlers, courtesy of the [ai.robots.txt repository](https://github.com/ai-robots-txt/ai.robots.txt). (Keep in mind this may not be enough regarding some sneakier crawlers, so please consult methods based on your host.)

With a free site host, such as [Neocities](https://neocities.org/) and [GitHub Pages](https://docs.github.com/en/pages), you can take this template, load it with your own artwork, and launch your art gallery online for the world to see.

Check out the [live demo](https://ppls-art-gallery.netlify.app/), featuring my artwork!

## How to use
### Local setup
Node.js and NPM are required. Please refer to the [installation guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) if you do not have them.

The preferred method of obtaining this template is cloning the repository via [Git](https://git-scm.com/). To do so, in the terminal, run the command `git clone https://github.com/PrincessPandaSource/PPL-s-Art-Gallery.git`. That way, you'll have your own Git repository where you can track and manage changes, and some site hosts allow automatic deploying via the repository. If you would not like to use Git, you can [download the ZIP](https://github.com/PrincessPandaSource/PPL-s-Art-Gallery/archive/refs/heads/main.zip).

In the terminal, set the current directory to the template's (this can be done with the `cd` command). Install dependencies, including Eleventy, by running `npm i`.

To run a local instance of the website, run `npm start`. To fully build the website, run `npm run build`. *(This is important if you are going to deploy by manually uploading files, rather than having the host build from them.)*

Eleventy does not automatically delete files from the build. To wipe the `_site` folder, which contains the build, run `npm run clean`.

### Adding artwork
Artwork pages are generated from files in the `art` folder, and they use images stored in the `art` subfolder in the `img` folder.

(You are free to delete all the pre-existing art pages and images!)

To add an artwork, first add an image to the `img` folder's `art` subfolder. (You may want it to named in a way that looks proper in URL, "like-this". To batch rename all images in the `img` folder, run `npm run slugifyImageNames`.)

Then, create either an HTML or Markdown file in the `art` folder. It can be named anything. At the top, paste and fill in the following front matter data:

```
---
title: "artwork's title here"
date: 2026-06-23
fileName: "artwork-image.png"
categories: [0, 1]
artTags: ["tag", "subject"]
altText: "description of the artwork for low-vision users"
---
```

(Categories are identified by numeral IDs. Go to the ["Categories"](#categories) section to learn about this.)

After the front matter data, you can write the description, marking it up according to your language.

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


### Site configuration


### Deploying


## Giving feedback
