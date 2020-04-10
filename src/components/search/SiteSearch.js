import React, { Component } from 'react'
import {findSites} from './SearchUtils'
import SiteComponent from '../sites/siteComponent'
import { PaginatedList } from 'react-paginated-list'


/**
 * This component is holds the all of th elements of a search page and calls functions that execute searches.
 */
class SiteSearchPrototype extends Component {

    // A constructor that sets the values of this component's state.
    constructor(props) {
        super(props);

        // Extracting the props that the constructor recieves.
        const { buttonName, onClickMethod, canRenderButton, searchVal, returnTo } = props;

        this.state = {
            // The search value as array of strings.
            searchVal: searchVal ? searchVal.split(' ') : [],

            // The array of search results.
            siteList: [],

            // Button content next to each entry
            buttonName,

            // The beginning of the address that is set after the search button is pressed.
            returnTo: returnTo
        }

        // onClick event handler for an entry button.
        this.onClickMethod = onClickMethod ? onClickMethod.bind(this) : null;

        // Boolean function for conditional button rendering.
        this.canRenderButton = canRenderButton ? canRenderButton.bind(this) : null;

        this.onSearchButtonClicked = this.onSearchButtonClicked.bind(this);
        this.updateSearchValue = this.updateSearchValue.bind(this);

        // console.log(this.state.searchVal)

        // Execute the search if the componenet recieved a search value.
        if(this.state.searchVal.length >= 1) {
            this.executeSearch()
        }
    };

    // transition to a new page based on the "returnTo" and the search value.
    onSearchButtonClicked(e) {
        e.preventDefault();

        window.location.href = '/' + this.state.returnTo + '/' + this.state.searchVal
    }


    // The search function that calls for searches in the database.
    async executeSearch() {
        const result = await findSites(this.state.searchVal)
        // console.log(result)
        this.setState({siteList: result})
    }


    // Updates the value of "searchVal" based on the content of the input box.
    updateSearchValue(e) {
        // console.log(e.target.value)
        this.setState({searchVal: e.target.value})
    }


    // Renders the component.
    render() {

        // Extract "buttonName" and "siteList" variable for ease of use.
        const { buttonName, siteList } = this.state;

        // Creates a variable that holds the mapping of "SiteComponent" for paging later on.
        const mapping = (list) => list.map((site, i) => {
            return  <div key={i} >
                        <SiteComponent key={i} props={site}/>
                        {this.onClickMethod && buttonName && this.canRenderButton(site.id) && 
                            <button onClick={(e) => this.onClickMethod(e, site.id)}>{buttonName}</button>}
                    </div>
        });      

        return (
            <div>
                {/* Search site form */}
                <form ref={this.form} id="search-form">
                    <div className="search-field">
                        <input ref={this.searchVal} onChange={this.updateSearchValue} type="text" required />
                    </div>
                    <div>
                        <button onClick={this.onSearchButtonClicked}>Search</button>
                    </div>
                    <p className="error pink-text center-align"></p>
                </form>
                
                {/* Results */}
                <div className="container">
                    {siteList.length !== 0 && <PaginatedList
                        list={siteList}
                        itemsPerPage={3}
                        renderList={mapping}/>}
                </div>
            </div>
        )    
    }
}

export default SiteSearchPrototype