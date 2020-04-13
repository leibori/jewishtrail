import React, { Component } from 'react'
import {findFromDB} from './SearchUtils'
import SiteComponent from '../sites/siteComponent'
import { PaginatedList } from 'react-paginated-list'
import RoadComponent from 'components/road/RoadComponent';


/**
 * This component is holds the all of th elements of a search page and calls functions that execute searches.
 */
class GeneralSearch extends Component {

    // A constructor that sets the values of this component's state.
    constructor(props) {
        super(props);

        // Extracting the props that the constructor recieves.
        const { buttonName, onRoadClickMethod, onSiteClickMethod, canRenderButtonSite, canRenderButtonRoad, searchVal, returnTo } = props;

        this.state = {
            // Is true if a search value is sent, and false otherwise.
            haveSearched: false,

            // The search value as array of strings.
            searchVal: searchVal ? searchVal.split(' ') : [],

            // The array of search results.
            searchResult: [],

            // Button content next to each entry
            buttonName,

            // The beginning of the address that is set after the search button is pressed.
            returnTo: returnTo
        }

        // onClick event handler for an entry button.
        this.onSiteClickMethod = onSiteClickMethod ? onSiteClickMethod.bind(this) : null;

        // onClick event handler for an entry button.
        this.onRoadClickMethod = onRoadClickMethod ? onRoadClickMethod.bind(this) : null;

        // Boolean function for conditional button rendering.
        this.canRenderButtonSite = canRenderButtonSite ? canRenderButtonSite.bind(this) : null;

        this.canRenderButtonRoad = canRenderButtonRoad ? canRenderButtonRoad.bind(this) : null;

        this.onSearchButtonClicked = this.onSearchButtonClicked.bind(this);

        this.updateSearchValue = this.updateSearchValue.bind(this);
    };

    // transition to a new page based on the "returnTo" and the search value.
    onSearchButtonClicked(e) {
        e.preventDefault();

        console.log(this.state.searchVal)

        window.location.href = '/' + this.state.returnTo + '/' + this.state.searchVal
    }


    // The search function that calls for searches in the database.
    async executeSearch() {
        const result = await findFromDB(this.state.searchVal, ['sites', 'roads'])
        // console.log(result)
        this.setState({searchResult: result,
                        haveSearched: true})
    }


    // Updates the value of "searchVal" based on the content of the input box.
    updateSearchValue(e) {
        // console.log(e.target.value)
        this.setState({searchVal: e.target.value})
    }

    async componentWillMount() {
        // Execute the search if the componenet recieved a search value.
        if(this.state.searchVal.length >= 1) {
            await this.executeSearch()
        }
    }


    // Renders the component.
    render() {

        // Extract "buttonName" and "searchResult" variable for ease of use.
        const { buttonName, searchResult } = this.state;


        // Creates a variable that holds the mapping of "SiteComponent" for paging later on.
        const mapping = (list) => list.map((site, i) => {
            return  (
                        <div key={i}>
                        {site.type === 'sites' ? 
                            (<div>  
                                <SiteComponent key={i} props={site}/>
                                {this.onSiteClickMethod && buttonName && this.canRenderButtonSite(site.id) &&
                                    <button onClick={(e) => this.onSiteClickMethod(e, site.id)}>{buttonName}</button>}
                            </div>) :
                            (<div>  
                                <RoadComponent key={i} props={site}/>
                                {this.onRoadClickMethod && buttonName && this.canRenderButtonRoad(site.id) &&
                                    <button onClick={(e) => this.onRoadClickMethod(e, site.id)}>{buttonName}</button>}
                            </div>)
                        }
                        </div>

                    );
        });      

        return (
            <div>
                {/* Search site form */}
                <form ref={this.form} id="search-form">
                    <div className="search-field">
                        <input value={this.state.searchVal.join(" ")} ref={this.searchVal} onChange={this.updateSearchValue} type="text" required />
                    </div>
                    <div>
                        <button onClick={this.onSearchButtonClicked} type="submit">Search</button>
                    </div>
                    <p className="error pink-text center-align"></p>
                </form>
                
                {/* Results */}
                <div className="container">
                    {searchResult.length !== 0 && <PaginatedList
                        list={searchResult}
                        itemsPerPage={3}
                        renderList={mapping}/>}
                </div>

                {
                    this.state.searchVal.length != 0 && this.state.searchResult.length == 0 && this.state.haveSearched ?
                        (<h5>No matches found.</h5>) : ''
                }
            </div>
        )    
    }
}

export default GeneralSearch