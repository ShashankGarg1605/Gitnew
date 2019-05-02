export default class Algolia {
  constructor() {
    this.APPLICATION_ID = "SH7KZR99FS";
    this.SEARCH_ONLY_API_KEY = "6d417d8cb41aac7bf903bea0c735e8b4";
    this.INDEX_NAME = window._pz && window._pz.algoliaBooksIndex;
    this.client = window.algoliasearch(
      this.APPLICATION_ID,
      this.SEARCH_ONLY_API_KEY
    );
    this.index = this.client.initIndex(this.INDEX_NAME);
  }

  fetch(keyword, page, filters) {
    // this.index.clearCache();

    const options = {
      page: page || 0,
      filters: filters || "",
      hitsPerPage: 20,
      maxValuesPerFacet: keyword && keyword.length > 0 ? 1000 : 100, // limit facets to 100 for blank search
      facets: ["publisher_name", "category_name", "author"]
    };
    return this.index.search(keyword, options);
  }
}
