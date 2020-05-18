const searchResultsReducer = (state = { searchVal: '', results: [], sitesFilter: false, trailFilter: false }, action) => {
    switch(action.type) {
        case 'SAVE_SEARCH_RESULTS':
            return {
                searchVal: action.searchVal,
                results: action.results,
                siteFilter: action.siteFilter,
                trailFilter: action.trailFilter,
            }
        default:
            return state
    }
};

export default searchResultsReducer;