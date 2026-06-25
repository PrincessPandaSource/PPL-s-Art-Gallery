// Get search index
const fetchResponse = await fetch('./search-index.json');
const searchIndexJSON = await fetchResponse.json();
const searchIndex = searchIndexJSON.searchIndex;

// Get HTML elements
const searchBar = document.getElementById("search-page-bar");
const searchResultsCounter = document.getElementById("search-results-counter");
const searchResultsDiv = document.getElementById("search-results");
const resultEntryTemplate = document.getElementById("result-entry-template");

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Search function
function search(query) {
    if (query == "") {
        return;
    }

    // Filter search index based on if a specified property includes the query
    // All in lowercase
    const queryLowerCase = query.toLowerCase();
    const searchResults = searchIndex.filter(item =>
        item.title.toLowerCase().includes(queryLowerCase) ||
        item.date.toLowerCase().includes(queryLowerCase) ||
        item.categories.toLowerCase().includes(queryLowerCase) ||
        item.artTags.toLowerCase().includes(queryLowerCase) ||
        item.altText.toLowerCase().includes(queryLowerCase) ||
        item.content.toLowerCase().includes(queryLowerCase)
    );

    const searchResultsAmount = searchResults.length;

    // Display search results
    searchResultsCounter.textContent = `${searchResultsAmount} result${ searchResultsAmount  === 1 ? "" : "s" } for "${query}"`;

    searchResults.forEach(result => {
        // Get search result template (same gallery item)
        const resultEntry = resultEntryTemplate.content.cloneNode(true);

        // Set link that encapsulates gallery item
        const resultLink = resultEntry.querySelector(".gallery-link");
        resultLink.href = result.url.replace(/\.[^/.]+$/, ""); // strips file extension

        // Set gallery item's image
        const resultImg = resultEntry.querySelector(".gallery-item-art");
        // Get filename for image's thumbnail
        const imgFileName = result.fileName.replace(/\.[^/.]+$/, "").concat("-500.webp");
        // IF YOU CHANGED SITE DIRECTORY, ADD IT TO SRC
        resultImg.src = `/img/art/${imgFileName}`;
        resultImg.alt = result.altText;

        // Set gallery item's title
        resultEntry.querySelector(".gallery-item-title").children[0].textContent = result.title;
        // Set gallery item's date
        resultEntry.querySelector(".gallery-item-date").textContent = result.date;

        // Add to #search-results div
        searchResultsDiv.append(resultEntry);
    });
}

// Perform search if there's a query
if (urlParams.has('q')) {
    let query = urlParams.get('q');
    searchBar.value = query;
    search(query);
}