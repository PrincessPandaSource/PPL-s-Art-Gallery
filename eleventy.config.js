import lodash from "lodash";
import path from "node:path";
import { DateTime } from "luxon";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import pluginRss from "@11ty/eleventy-plugin-rss";
import { execSync } from 'child_process';

export default function(eleventyConfig) {
    // Copies the following to the build, for that they are
    // not transferred by default
    eleventyConfig.addPassthroughCopy("styles");
    eleventyConfig.addPassthroughCopy("img");
    eleventyConfig.addPassthroughCopy("scripts");
    eleventyConfig.addPassthroughCopy("robots.txt");

    // Remove trailing slashes from dead-end pages
	/*eleventyConfig.addGlobalData("permalink", () => {
		return (data) =>
			`${data.page.filePathStem}.${data.page.outputFileExtension}`;
	});*/

    // Filter for processing date into full format with full month name
    // and all
    eleventyConfig.addFilter("artDate", (dateString) => {
        const dateObj = new Date(dateString);
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toLocaleString(DateTime.DATE_FULL);
    });

    // Filter for stripping file extension
    eleventyConfig.addFilter("stripExtension", (filename) => {
        return filename.replace(/\.[^/.]+$/, "")
    });

    // SET ART CATEGORIES HERE
    const artCategories = [
        {
            name: "Original art",
            id: 0
        },
        {
            name: "Sonic the Hedgehog fan art",
            id: 1
        },
        {
            name: "Other fan art",
            id: 2
        },
        {
            name: "Sketches",
            id: 5
        },
        {
            name: "Inktober 2019",
            id: 3
        },
        {
            name: "Silver Scripts",
            id: 4
        }
    ]
    // You can reorder the categories by reordering their entries in the array

    // Allows other files to access the artCategories array
    eleventyConfig.addGlobalData("artCategories", artCategories);

    // Creates double pagination for art categories
    // Code source: https://www.codeflood.net/blog/2024/04/17/11ty-nested-pagination/
    eleventyConfig.addCollection("artByCategories", function(collectionApi) {
        const artworks = collectionApi.getFilteredByTag("artGallery");

        // Get art by categories
        let artByCategories = new Array();

        artworks.forEach(artwork => {
            const artsCate = artwork.data.categories;
            artsCate.forEach(cateId => {
                let category = "test";

                for (const i in artCategories) {
                    if (artCategories[i].id == cateId) {
                        category = artCategories[i].name;
                        break;
                    }
                }

                if (!artByCategories[category]) artByCategories[category] = [];
                artByCategories[category].push(artwork);
            });
        });

        // Categories pagination
        let artByCategoriesPaged = [];
        const pageSize = 24;
        for (const category in artByCategories) {
            // Reverse pages
            artByCategories[category].sort((a, b) => a.date > b.date).reverse();

            const totalPages = Math.ceil(artByCategories[category].length / pageSize);
            
            lodash.chunk(artByCategories[category], pageSize).forEach((artworks, index) => {
                artByCategoriesPaged.push({
                    category: category,
                    artworks: artworks,
                    pageNumber: index + 1,
                    totalPages: totalPages
                });
            })
        }

        return artByCategoriesPaged;
    })

    // Obtains and creates double pagination for art tags
    eleventyConfig.addCollection("artByTags", function(collectionApi) {
        const artworks = collectionApi.getFilteredByTag("artGallery");

        // Get tags
        let artByTags = new Array();

        artworks.forEach(artwork => {
            const artsTags= artwork.data.artTags;
            artsTags.forEach(tag => {
                if (!artByTags[tag]) artByTags[tag] = [];
                artByTags[tag].push(artwork);
            });
        });

        // Art tags pagination
        let artByTagsPaged = [];
        const pageSize = 24;
        for (const tag in artByTags) {
            // Reverse pages
            artByTags[tag].sort((a, b) => a.date > b.date).reverse();

            const totalPages = Math.ceil(artByTags[tag].length / pageSize);
            
            lodash.chunk(artByTags[tag], pageSize).forEach((artworks, index) => {
                artByTagsPaged.push({
                    tag: tag,
                    artworks: artworks,
                    pageNumber: index + 1,
                    totalPages: totalPages
                });
            })
        }

        return artByTagsPaged;
    })

    // Image HTML transform
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		formats: ["webp", "auto"],
		widths: [768, 1280, 1920, "auto"],
        filenameFormat: function (id, src, width, format, options) {
            const extension = path.extname(src);
            const name = path.basename(src, extension);
            const dir = path.dirname(src);

            return `${dir}/${name}-${width}.${format}`;
        },
		htmlOptions: {
			imgAttributes: {
				loading: "lazy",
				decoding: "async",
                sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 100vw, (max-width: 1920px) 100vw, 100vw"
			},
            fallback: "largest"
		}
	});

    // Run Pagefind index after building site
	eleventyConfig.on('eleventy.after', () => {
		execSync(`npx -y pagefind --site _site --glob art/*.html`, { encoding: 'utf-8' })
	})

    // For RSS feed
    eleventyConfig.addPlugin(pluginRss);

    // Transforms date for RSS feed
    eleventyConfig.addFilter("RSSDate", (dateObj) => {
        const date = new Date(dateObj);
        date.setUTCHours(12, 0, 0, 0);
        return date.toUTCString();
    });
}

// Set all HTML files to use Nunjunks
export const config = {
    htmlTemplateEngine: "njk",
};