import { DateTime } from "luxon";

export default function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("styles");
    eleventyConfig.addPassthroughCopy("img");

    // Remove trailing slashes from dead-end pages
	/*eleventyConfig.addGlobalData("permalink", () => {
		return (data) =>
			`${data.page.filePathStem}.${data.page.outputFileExtension}`;
	});*/

    eleventyConfig.addFilter("artDate", (dateString) => {
        const dateObj = new Date(dateString);
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toLocaleString(DateTime.DATE_FULL);
    });

    eleventyConfig.addFilter("listTags", (array) => {
        let html = ``;

        array.forEach((tag) => {
            html += (`<span class="art-tag">${tag}</span>`);
        })

        return html;
    });

    eleventyConfig.addCollection("artCategories", function(collectionApi) {
        let artCategories = new Array();
        const artworks = collectionApi.getFilteredByTag("artGallery");

        artworks.forEach(artwork => {
            const artsCate = artwork.data.categories;
            artsCate.forEach(category => {
                if (!(artCategories.includes(category))) artCategories.push(category);
            });
        });

        return artCategories;
    })

    eleventyConfig.addFilter("filterByArtTag", function(artworks, type, tag) {
        // Lowercase is used for consistency
        tag = tag.toLowerCase();

        const filteredArts = artworks.filter(artwork => {
            let array;

            switch (type) {
                case "category":
                    array = artwork.data.categories.map(c => c.toLowerCase());
                    break;
                case "tag":
                    array = artwork.data.artTags.map(t => t.toLowerCase());
                    break;
            }

            return array.includes(tag);
        })

        return filteredArts;
    })
}

// Set all HTML files to use Nunjunks
export const config = {
    htmlTemplateEngine: "njk",
};