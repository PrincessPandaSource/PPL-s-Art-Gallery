// Pagefind manager
const manager = window.PagefindComponents.getInstanceManager();
const instance = manager.getInstance('default');

// Search page's search bar
const searchPageBar = document.getElementById("search-page-bar")

// Read URL for parameters
const urlParams = new URLSearchParams(window.location.search);

// Trigger search if there's a query
if (urlParams.has('q')) {
    let query = urlParams.get('q');
    searchPageBar.value = query;
    instance.triggerSearch(query);
}