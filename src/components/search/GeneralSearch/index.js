import React, { Component } from 'react'
import {findFromDB} from '../SearchUtils'
import SiteComponent from 'components/sites/siteComponent'
import { PaginatedList } from 'react-paginated-list'
import RoadComponent from 'components/road/RoadComponent';
import ReactLoading from "react-loading";
// import Select from 'react-select'
import './index.css';         

// Header style properties.
const headerStyle = {
    color: 'white',
    fontWeight: '800',
    fontSize: '32px',
    fontFamily: "Cambay, sans-serif",
    textShadow: "2px 2px black",
}


// const options = [
//     { label: "Relevance", value: 'relevance' },
//     { label: "distance", value: 'distance' }
// ]


/**
 * This component is holds the all of th elements of a search page and calls functions that execute searches.
 */
class GeneralSearch extends Component {

    // A constructor that sets the values of this component's state.
    constructor(props) {

        super(props);

        // Extracting the props that the constructor recieves.
        const { siteButtonsProps, roadButtonsProps ,searchVal, returnTo } = props;
        // const { siteButtonsProps, roadButtonsProps, voteButtonsProps ,searchVal, returnTo } = props;


        this.state = {
            // Is true if a search value is sent, and false otherwise.
            startedSearch: false,

            // Is true if the search function has finished.
            finishedSearch: false,

            // The search value as array of strings.
            searchVal: searchVal,

            // The array of search results.
            searchResult: [],

            // Button content for voting.
            // voteButtonsProps,
            
            // Button content next to each site entry.
            siteButtonsProps,

            // Button content next to each site entry.
            roadButtonsProps,

            // The beginning of the address that is set after the search button is pressed.
            returnTo: returnTo,

            // Is true if the search result are to filter out sites.
            siteFilter: false,

            // Is true if the search result are to filter out trails.
            trailFilter: false,

        }
        
        // A bind to the search "button" function
        this.onSearchButtonClicked = this.onSearchButtonClicked.bind(this);

        // A bind to the function the updates the search value.
        this.updateSearchValue = this.updateSearchValue.bind(this);
    };

    // Transition to a new page based on the "returnTo" and the search value.
    onSearchButtonClicked(e) {
        e.preventDefault();

        if (this.state.searchVal !== '') {
            window.location.href = '/' + this.state.returnTo + '/' + this.state.searchVal
        }
    }

    // The search function that calls for searches in the database.
    async executeSearch() {
        this.setState({ startedSearch: true })
        var searchValues = this.state.searchVal.split(" ")
        // console.log(searchValues)
        const result = await findFromDB(searchValues, ['sites', 'roads'])
        // console.log(result)
        this.setState({searchResult: result,
                        finishedSearch: true})
    }


    // Updates the value of "searchVal" based on the content of the input box.
    updateSearchValue(e) {
        // console.log(e.target.value)
        this.setState({searchVal: e.target.value})
    }


    // sortResults(e) {
    //     console.log(e.label)
    // }


    // Execute the search if the componenet recieved a search value.
    async componentWillMount() {
        if(this.state.searchVal.length >= 1) {
            await this.executeSearch()
        }
    }


    /**
     * This function executes when the user clicks on the site filter button, and it sets boolean values in order to filter the results.
     */
    onlySitesClicked = () => {
        if (this.state.trailFilter) {
            this.setState({trailFilter: false})
        } else {
            this.setState({siteFilter: false, trailFilter: true})
        }
    }


    /**
     * This function executes when the user clicks on the road filter button, and it sets boolean values in order to filter the results.
     */
    onlyTrailsClicked = () => {
        if (this.state.siteFilter) {
            this.setState({siteFilter: false})
        } else {
            this.setState({siteFilter: true, trailFilter: false}) 
        }
    }


    /**
     * This function is used to filter (by site or by road) the results based on boolean values.
     */
    resultsFilter = (result) => {
        return (!this.state.siteFilter && result.type === 'sites') ||
            (!this.state.trailFilter && result.type === 'roads')
    }


    // Renders the component.
    render() {

        // Extract "siteButtonsProps", "roadButtonsProps", "voteButtonsProps", "startedSearch", "finishedSearch" and "searchResult" values from "this.state" for ease of use.
        // const { siteButtonsProps, roadButtonsProps, voteButtonsProps, startedSearch, finishedSearch, searchResult } = this.state;
        
        // Extract "siteButtonsProps", "roadButtonsProps", "startedSearch", "finishedSearch" and "searchResult" values from "this.state" for ease of use.
        const { siteButtonsProps, roadButtonsProps, startedSearch, finishedSearch, searchResult } = this.state;
        
        // Predicate that decides the color of the button of the site filter.
        const siteColorPredicate = this.state.trailFilter ? 'rgba(230,223,0,1)' : 'rgba(255,255,255,1)'

        // Predicate that decides the color of the button of the road filter.
        const roadColorPredicate = this.state.siteFilter ? 'rgba(230,223,0,1)' : 'rgba(255,255,255,1)'

        // Creates a variable that holds the mapping of "SiteComponent" for paging later on.
        const mapping = (list) => list.map((site, i) => {
            return  (
                        <div style={{width: '100%'}} key={i}>
                        {site.type === 'sites' && !this.state.siteFilter ?
                            (<div>  
                                {/* <SiteComponent {...{siteButtonsProps,voteButtonsProps}} site={site} /> */}
                                <SiteComponent {...{siteButtonsProps}} site={site} />
                            </div>)
                            : site.type === 'roads' && !this.state.trailFilter ?
                            (<div style={{width: '100%'}}>
                                 {/* <RoadComponent {...{roadButtonsProps,voteButtonsProps}} road={site}/> */}
                                 <RoadComponent {...{roadButtonsProps}} road={site}/>
                            </div>) : ''
                        }
                        </div>

                    );
        });     

        return (
            <div style={{height: '100%', width: '100%'}}>
                <div className="searchbar">
                    <form onSubmit={this.onSearchButtonClicked} style={{paddingBottom: '0%', marginTop: '0%', width: '100%'}}>
                        <header style={headerStyle}>Find a trail</header>
                        <div className='field'>
                            <span><i className="fas fa-search" style={{marginLeft: '12px'}}></i></span>
                            <input style={{fontSize: '16px'}} placeholder='Search by trail name or location...' type="text" onChange={this.updateSearchValue} ref={this.searchVal} value={this.state.searchVal} required />
                        </div>                        
                        <button
                            type="submit"
                            style={{backgroundColor: 'rgba(255,255,255,0.4)', border: '1px solid black', borderRadius: '4px', display: 'none'}}>Search</button>
                    
                        <p className="error pink-text center-align"></p>
                    </form>
                    {finishedSearch && searchResult.length !== 0 && 
                        <div>
                                <button
                                    onClick={this.onlySitesClicked}
                                    style={{backgroundColor: siteColorPredicate, borderRadius: '4px', marginLeft: '5%'}}>Only sites</button>
                                <button
                                    onClick={this.onlyTrailsClicked}
                                    style={{backgroundColor: roadColorPredicate, borderRadius: '4px', marginLeft: '10px' }}>Only trails</button>
                            </div>}
                </div>
                <div className="results" style={{zIndex:'0'}}>
                { startedSearch && ! finishedSearch ? (
                    <div style={{top: '50%', left:'50%',position:'fixed',transform: 'translate(-50%, -50%)'}}>
                        <ReactLoading type={"bars"} color={"white"} />
                    </div>
                    ) : finishedSearch && searchResult.length !== 0 ? (
                    <div style={{width: '100%'}}>
                        <div className="container" style={{ width: '100%', paddingLeft: '0px', paddingRight: '0px' }}>
                            {
                                searchResult.filter(this.resultsFilter).length == 0 ?
                                <img src="https://premieregyptonline.com/images/no-results.png"/> :
                                searchResult.filter(this.resultsFilter).length > 9 ?
                                < PaginatedList style={{width:'100%'}}
                                list={searchResult.filter(this.resultsFilter)}
                                itemsPerPage={9}
                                renderList={mapping}/> : mapping(searchResult.filter(this.resultsFilter))}
                        </div>
                    </div>
                    ) : finishedSearch && searchResult.length === 0 ? (
                        <img src="https://premieregyptonline.com/images/no-results.png"/>
                        // <h4 style={{ fontWeight: '650', marginLeft: '5%' , color: 'rgba(223,30,38,0.9)'}}>No matches found!</h4>
                    ) : ''
                }
                </div>

            </div>
        )    
    }
}

export default GeneralSearch