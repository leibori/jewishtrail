import React, { Component } from 'react'
import {findFromDB} from '../SearchUtils'
import SiteComponent from 'components/sites/siteComponent'
import { PaginatedList } from 'react-paginated-list'
import TrailComponent from 'components/trail/TrailComponent';
import ReactLoading from "react-loading";
import { saveSearchResults } from '../../../actions'
import { connect } from 'react-redux'
import SelectStyle from '../../favorites/selectStyle'
import './index.css';         
import noResultsIcon from '../../../assets/img/SearchNoResults.png'
import SearchStart from '../../../assets/img/SearchStart.png'
import _ from 'underscore'
import no_image_available from '../../../assets/img/no-image-available.png'


// Header style properties.
const headerStyle = {
    color: 'white',
    fontWeight: '800',
    fontSize: '22px',
    fontFamily: "Cambay, sans-serif",
    textShadow: "2px 2px black",
}

let sortOptions = ["Sort by","Relevance","Rates"]


/**
 * This component is holds the all of th elements of a search page and calls functions that execute searches.
 */
class GeneralSearch extends Component {

    // A constructor that sets the values of this component's state.
    constructor(props) {

        super(props);

        // Extracting the props that the constructor recieves.
        const { siteButtonsProps, trailButtonsProps ,searchVal, returnTo } = props;

        this.state = {
            // Is true if a search value is sent, and false otherwise.
            startedSearch: false,

            // Is true if the search function has finished.
            finishedSearch: false,

            // The search value as array of strings.
            searchVal: searchVal,

            // The array of search results.
            searchResult: [],
            
            // Button content next to each site entry.
            siteButtonsProps,

            // Button content next to each site entry.
            trailButtonsProps,

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
            this.props.saveSearchResults({
                searchVal: '',
                results: [],
                siteFilter: false,
                trailFilter: false,
            })

            window.location.href = '/' + this.state.returnTo + '/' + this.state.searchVal
        }
    }

    // The search function that calls for searches in the database.
    async executeSearch() {
        this.setState({ startedSearch: true })
        var searchValues = this.state.searchVal.split(" ")
        const result = await findFromDB(searchValues, ['sites', 'roads'])

        this.props.saveSearchResults({
            searchVal: this.state.searchVal,
            results: result,
            siteFilter: this.state.siteFilter,
            trailFilter: this.state.trailFilter,
        })
        this.setState({searchResult: result,
                        finishedSearch: true})
    }


    // Updates the value of "searchVal" based on the content of the input box.
    updateSearchValue(e) {
        this.setState({searchVal: e.target.value})
    }


    // Execute the search if the componenet recieved a search value.
    async componentWillMount() {
        if(this.state.searchVal.length >= 1) {
            const savedResults = this.props.searchResults

            if (savedResults.results.length >= 1 && savedResults.searchVal === this.state.searchVal) {
                this.setState({
                    searchResult: savedResults.results,
                    finishedSearch: true,
                    siteFilter: savedResults.siteFilter,
                    trailFilter: savedResults.trailFilter,
                })
            } else {
                await this.executeSearch()
            }
        }
    }


    /**
     * This function executes when the user clicks on the site filter button, and it sets boolean values in order to filter the results.
     */
    onlySitesClicked = () => {
        if (this.state.trailFilter) {
            this.props.saveSearchResults({
                searchVal: this.state.searchVal,
                results: this.state.searchResult,
                siteFilter: this.state.siteFilter,
                trailFilter: false,
            })
            this.setState({trailFilter: false})
        } else {
            this.props.saveSearchResults({
                searchVal: this.state.searchVal,
                results: this.state.searchResult,
                siteFilter: false,
                trailFilter: true,
            })
            this.setState({siteFilter: false, trailFilter: true})
        }
    }


    /**
     * This function executes when the user clicks on the trail filter button, and it sets boolean values in order to filter the results.
     */
    onlyTrailsClicked = () => {
        if (this.state.siteFilter) {
            this.props.saveSearchResults({
                searchVal: this.state.searchVal,
                results: this.state.searchResult,
                siteFilter: false,
                trailFilter: this.state.trailFilter,
            })
            this.setState({siteFilter: false})
        } else {
            this.props.saveSearchResults({
                searchVal: this.state.searchVal,
                results: this.state.searchResult,
                siteFilter: true,
                trailFilter: false,
            })
            this.setState({siteFilter: true, trailFilter: false}) 
        }
    }


    /**
     * This function is used to filter (by site or by trail) the results based on boolean values.
     */
    resultsFilter = (result) => {
        return (!this.state.siteFilter && result.type === 'sites') ||
            (!this.state.trailFilter && result.type === 'roads')
    }


    sortBy = (typeSort) => {
        console.log(typeSort)
        let sortedArray = []
        if(typeSort === 'Rates'){
          sortedArray = this.state.searchResult.sort((a, b) => parseFloat(b.vote) - parseFloat(a.vote))
        }
        else if(typeSort === 'Relevance') {
            sortedArray = _.sortBy(this.state.searchResult, 'relevance').reverse()
        } else {
            return
        }
        this.setState({
            searchResult: sortedArray
        })
      }

    // Renders the component.
    render() {

        // Extract "siteButtonsProps", "trailButtonsProps", "startedSearch", "finishedSearch" and "searchResult" values from "this.state" for ease of use.
        const { siteButtonsProps, trailButtonsProps, startedSearch, finishedSearch, searchResult } = this.state;
        
        // Predicate that decides the color of the button of the site filter.
        const siteColorPredicate = this.state.trailFilter ? 'rgba(230,223,0,1)' : 'rgba(255,255,255,1)'

        // Predicate that decides the color of the button of the trail filter.
        const trailColorPredicate = this.state.siteFilter ? 'rgba(230,223,0,1)' : 'rgba(255,255,255,1)'

        // Creates a variable that holds the mapping of "SiteComponent" for paging later on.
        const mapping = (list) => list.map((result, i) => {
            return  (
                        <div style={{width: '100%'}} key={i}>
                        {result.type === 'sites' && !this.state.siteFilter ?
                            (<div>  
                                <SiteComponent {...{siteButtonsProps}} site={result} />
                            </div>)
                            : result.type === 'roads' && !this.state.trailFilter ?
                            (<div style={{width: '100%'}}>
                                 <TrailComponent {...{trailButtonsProps}} trail={result}/>
                            </div>) : ''
                        }
                        </div>

                    );
        });     

        return (
            <div style={{width: '100%'}}>
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
                                style={{backgroundColor: trailColorPredicate, borderRadius: '4px', marginLeft: '10px' }}>Only trails</button>
                            <div className='forSearch-options'>
                                <SelectStyle passFunction={this.sortBy} type ={sortOptions}/>
                            </div>
                            
                        </div>
                    }
                </div>
                <div className="results" style={{zIndex:'0', paddingTop: '12%'}}>
                { startedSearch && ! finishedSearch ? (
                    <div style={{top: '50%', left:'50%',position:'fixed',transform: 'translate(-50%, -50%)'}}>
                        <ReactLoading type={"bars"} color={"black"} />
                    </div>
                    ) : finishedSearch && searchResult.length !== 0 ? (
                    <div style={{width: '100%'}}>
                        <div className="container" style={{ width: '100%', paddingLeft: '0px', paddingRight: '0px' }}>
                            {
                                searchResult.filter(this.resultsFilter).length === 0 ?
                                <div className="results-test" style={{ height: '100%', paddingTop: '30%' }}>
                                <span className='message' style={{ paddingLeft: '31%' }}>Looks like nothing is</span><br/>
                                <span className='message' style={{ paddingLeft: '28%' }}>going around here yet...</span>
                                <img src={noResultsIcon} alt={no_image_available} style={{ maxHeight: '33%', maxWidth: '33%', paddingTop: '25px' }}/>
                                </div> :
                                searchResult.filter(this.resultsFilter).length > 9 ?
                                < PaginatedList style={{width:'100%'}}
                                list={searchResult.filter(this.resultsFilter)}
                                itemsPerPage={9}
                                renderList={mapping}/> : mapping(searchResult.filter(this.resultsFilter))}
                        </div>
                    </div>
                    ) : finishedSearch && searchResult.length === 0 ? (
                        <div className="results-test">
                            <span className='message' style={{ paddingLeft: '31%' }}>Looks like nothing is</span><br/>
                            <span className='message' style={{ paddingLeft: '28%' }}>going around here yet...</span>
                            <img src={noResultsIcon} alt="No results found" style={{ maxHeight: '33%', maxWidth: '33%', paddingTop: '25px' }}/>
                        </div>
                    ) : (
                        <div style={{ height: '100%', paddingTop: '30%' }}>
                            <span className='message' style={{ paddingLeft: '34%' }}>Search for a trail</span><br/>
                            <span className='message' style={{ paddingLeft: '31%' }}>to find your journey</span>
                            <img src={SearchStart} alt="Please start searching" style={{ maxHeight: '33%', maxWidth: '33%', paddingTop: '25px' }}/>
                        </div>
                    )
                }
                </div>

            </div>
        )    
    }
}


const mapStateToProps = (state) => {
    return {
        searchResults: state.searchResults,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        saveSearchResults: (searchProps) => dispatch(saveSearchResults(searchProps))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneralSearch);