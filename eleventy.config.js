/* This is file is used to configure Eleventy with JavaScript, such as adding
Nunjucks filters, creating and fine-tuning page collections, and running
terminal commands. This is where you specify artwork categories and how many
gallery entries should be on each category or tag page.

Other modifications are only recommended if you have some prior experience
with Eleventy and JavaScript. */

import lodash from "lodash";
import path from "node:path";
import { DateTime } from "luxon";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import pluginRss from "@11ty/eleventy-plugin-rss";
import { execSync } from 'child_process';
import { match } from "node:assert";

export default function(eleventyConfig) {
    // Copies the following directories and files to the build,
    // for that they are not transferred by default

    // This copies all original images to the build
    // This is REQUIRED for images in social media cards to work
    eleventyConfig.addPassthroughCopy("img");

    eleventyConfig.addPassthroughCopy("styles");
    eleventyConfig.addPassthroughCopy("fonts");
    eleventyConfig.addPassthroughCopy("scripts");

    // Processes date into full format with full month name
    // and all (with Luxon)
    function artDate(dateString) {
        const dateObj = new Date(dateString);
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toLocaleString(DateTime.DATE_FULL);
        // UTC time must be used so that date doesn't rely on local time zone
        // and thus goes off
    };

    // Filter for above
    eleventyConfig.addFilter("artDate", (dateString) => {
        return artDate(dateString);
    });

    // Filter for stripping file extension, relying on Regex
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

    // Match ID with category
    function matchCategoryID(id) {
        for (const i in artCategories) {
            if (artCategories[i].id == id) {
                return artCategories[i].name;
            }
        }
    }

    // Creates double pagination for the art categories set above
    // (You can set amount of artwork per page here)
    // Code source: https://www.codeflood.net/blog/2024/04/17/11ty-nested-pagination/
    eleventyConfig.addCollection("artByCategories", function(collectionApi) {
        // Get all artworks
        const artworks = collectionApi.getFilteredByTag("artGallery");

        // Create array of categories with their artworks
        let artByCategories = new Array();

        // For each artwork
        artworks.forEach(artwork => {
            // Gets its category IDs
            const artsCate = artwork.data.categories;
            // For each of the category IDs
            artsCate.forEach(cateId => {
                const category = matchCategoryID(cateId);

                // If category is not in array, put it in
                if (!artByCategories[category]) artByCategories[category] = [];
                // Category gets the artwork
                artByCategories[category].push(artwork);
            });
        });

        // Create array of paged sets of artworks per category
        let artByCategoriesPaged = [];
        const pageSize = 24; // SET NUMBER OF ARTWORK PER PAGE
        // For each used category
        for (const category in artByCategories) {
            // Reverse order of artworks per category
            artByCategories[category].sort((a, b) => a.date > b.date).reverse();

            // Calculate total number of pages needed
            const totalPages = Math.ceil(artByCategories[category].length / pageSize);
            
            // Use Lodash plugin to separate category items into paged sets
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

    // Obtains art tags from the artworks and creates double pagination for them
    // (You can set amount of artwork per page here)
    eleventyConfig.addCollection("artByTags", function(collectionApi) {
        // Get all artworks
        const artworks = collectionApi.getFilteredByTag("artGallery");

        // Create array of art tags with their artworks
        let artByTags = new Array();

        // For each of the category IDs
        artworks.forEach(artwork => {
            // Get its tags
            const artsTags= artwork.data.artTags;
            // For each tag
            artsTags.forEach(tag => {
                // If tag is not in array, put it in
                if (!artByTags[tag]) artByTags[tag] = [];
                // Tag gets artwork
                artByTags[tag].push(artwork);
            });
        });

        // Create array of paged sets of artworks per tag
        let artByTagsPaged = [];
        const pageSize = 24; // SET NUMBER OF ARTWORK PER PAGE
        for (const tag in artByTags) {
            // Reverse order of artworks per tag
            artByTags[tag].sort((a, b) => a.date > b.date).reverse();

            // Calculate total number of pages needed
            const totalPages = Math.ceil(artByTags[tag].length / pageSize);
            
            // Use Lodash plugin to separate category items into paged sets
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
		formats: ["svg", "webp"],
		widths: [768, 1280, 1920, "auto"],
        // The first three widths are screen resolutions, last width is the original
        outputDir: "_site/", // Put images in "_site" folder
        urlPath: "/",
        // Image src paths are set to exactly as they were in the source code
        // Courtesy of being able to configure filenameFormat
        filenameFormat: function (id, src, width, format, options) {
            const extension = path.extname(src);
            const name = path.basename(src, extension);
            const dir = path.dirname(src);

            return `${dir}/${name}-${width}.${format}`;
        },
		htmlOptions: {
			imgAttributes: {
				loading: "lazy", // Lazy loading is preferred for optimal performance
				decoding: "async", // So is async decoding
                sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 100vw, (max-width: 1920px) 100vw, 100vw"
                // Output image size based on mobile, tablet, or desktop
			},
            fallback: "largest" // Always go to maximum image size for screen resolution
		},
        svgShortCircuit: "size", // So SVG file of vector graphic is only used if WEBP file would be larger,
        transformOnRequest: false // So images are fully converted into new image files when Eleventy is served
	});

    // Filter for building search index; takes collection and returns data processed from
    // each item
    // Credit: https://arielsalminen.com/2025/building-search-index-with-eleventy/
	eleventyConfig.addFilter("searchIndex", function(collection) {
		const searchIndex = collection
			.map(({ templateContent, url, data }) => {
                // Get title, filename, and alt text from the front matter data itself
				const { title = "", fileName = "", altText = "" } = data;

                // Get data from front matter data and process it
                const date = artDate(data.date);

                // For each category ID, match with name and add it to string
                // Separated by space
                let categories = "";
                data.categories.forEach(category => {
                    categories = categories.concat(matchCategoryID(category), " ");
                })
                categories = categories.trim();

                // Art tags are turned to string, with each tag separated by a space
                const artTags = data.artTags.join(' ');

                // Content (underneath data) itself is taken and converted to plaintext
				const content = searchPlainify(templateContent);

				return {
					url,
					title,
                    date,
					fileName,
                    categories,
					artTags,
                    altText,
					content
				};
			});

		return { searchIndex };
	});

    // Processes content to be plain text for search index
	function searchPlainify(text) {
		if (!text) return "";

		// Remove HTML elements
		const plain = text.replace(/<.*?>/gis, "");

		// Remove other unnecessary characters from the text
		return plain
            .replace(/"|/g, "") // remove quotes
			.replace(/\n|\r/g, " ") // remove newlines
			.replace(/&(\S*)/g, "") // remove HTML entities
			.replace(/[ ]{2,}/g, " ") // remove repeated spaces
			.replace(/[\\|]/g, "") // remove special characters
            .trim()
	}

    // Filter for processing date to "YYYY-MM-DD" format
    // Such as in the sitemap (with Luxon)
    eleventyConfig.addFilter("numDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-MM-dd');
        // UTC time must be used so that date doesn't rely on local time zone
        // and thus goes off
    });

    // For RSS feed
    eleventyConfig.addPlugin(pluginRss);

    // Transforms date for RSS feed
    // Sets time in UTC to noon so date isn't a day off in the feed
    eleventyConfig.addFilter("RSSDate", (dateObj) => {
        const date = new Date(dateObj);
        date.setUTCHours(12, 0, 0, 0);
        return date.toUTCString();
    });
}

// Set HTML and Markdown files to use Nunjunks
export const config = {
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
};