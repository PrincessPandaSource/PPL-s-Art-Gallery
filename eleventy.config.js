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
}

// Set all HTML files to use Nunjunks
export const config = {
    htmlTemplateEngine: "njk",
};