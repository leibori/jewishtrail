import React, { Component } from 'react'
import {findFromDB} from './SearchUtils'
import SiteComponent from '../sites/siteComponent'
import { PaginatedList } from 'react-paginated-list'
import RoadComponent from 'components/road/RoadComponent';


const style = {backgroundColor: 'white',
    backgroundImage: "url(" + "https://image0.flaticon.com/icons/png/128/49/49116.png" + ")",
    backgroundPosition: '2px 3px',
    backgroundRepeat: 'no-repeat',
    paddingLeft: '25px',
    borderRadius: '8px',
    backgroundSize: '20px 20px',
    width: '100%'
}


/**
 * This component is holds the all of th elements of a search page and calls functions that execute searches.
 */
class GeneralSearch extends Component {

    // A constructor that sets the values of this component's state.
    constructor(props) {
        super(props);

        // Extracting the props that the constructor recieves.
        const { buttonName, onRoadClickMethod, onSiteClickMethod, canRenderButtonSite, canRenderButtonRoad, searchVal, returnTo, classes } = props;

        this.state = {
            // Is true if a search value is sent, and false otherwise.
            haveSearched: false,

            // The search value as array of strings.
            searchVal: searchVal,

            // The array of search results.
            searchResult: [],

            // Button content next to each entry
            buttonName,

            // The beginning of the address that is set after the search button is pressed.
            returnTo: returnTo,

            siteFilter: true,

            roadFilter: true,

            classes
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
        var searchValues = this.state.searchVal.split(" ")
        console.log(searchValues)
        const result = await findFromDB(searchValues, ['sites', 'roads'])
        // console.log(result)
        this.setState({searchResult: result,
                        haveSearched: true})
    }


    // Updates the value of "searchVal" based on the content of the input box.
    updateSearchValue(e) {
        // console.log(e.target.value)
        this.setState({searchVal: e.target.value})
    }

    // Execute the search if the componenet recieved a search value.
    async componentWillMount() {
        if(this.state.searchVal.length >= 1) {
            await this.executeSearch()
        }
    }


    /**
     * This function executes when the user clicks on the site filter button, and it sets boolean values in order to filter the results.
     */
    siteFilterClicked = () => {
        if (!this.state.roadFilter) {
            this.setState({roadFilter: true})
        } else {
            this.setState({siteFilter: true, roadFilter: false})
        }
    }


    /**
     * This function executes when the user clicks on the road filter button, and it sets boolean values in order to filter the results.
     */
    roadFilterClicked = () => {
        if (!this.state.siteFilter) {
            this.setState({siteFilter: true})
        } else {
            this.setState({siteFilter: false, roadFilter: true}) 
        }
    }


    /**
     * This function is used to filter (by site or by road) the results based on boolean values.
     */
    resultsFilter = (result) => {
        return (this.state.siteFilter && result.type == 'sites') ||
            (this.state.roadFilter && result.type == 'roads')
    }


    // Renders the component.
    render() {

        const classes = this.state.classes

        // Predicate that decides the color of the button of the site filter.
        const siteColorPredicate = !this.state.roadFilter ? 'rgba(230,223,0,0.4)' : 'rgba(255,255,255,0.4)'

        // Predicate that decides the color of the button of the road filter.
        const roadColorPredicate = !this.state.siteFilter ? 'rgba(230,223,0,0.4)' : 'rgba(255,255,255,0.4)'

        // Extract "buttonName" and "searchResult" variable for ease of use.
        const { buttonName, searchResult } = this.state;

        // Creates a variable that holds the mapping of "SiteComponent" for paging later on.
        const mapping = (list) => list.map((site, i) => {
            return  (
                        <div key={i}>
                        {site.type === 'sites' && this.state.siteFilter ?
                            (<div>  
                                <SiteComponent props={{site: site,
                                                    buttonName: buttonName,
                                                    condition: this.onSiteClickMethod && buttonName && this.canRenderButtonSite(site.id),
                                                    buttonFunction: this.onSiteClickMethod}}/>
                            </div>)
                            : site.type === 'roads' && this.state.roadFilter ?
                            (<div>  
                                <RoadComponent props={{road: site,
                                                    buttonName: buttonName,
                                                    condition: this.onRoadClickMethod && buttonName && this.canRenderButtonRoad(site.id),
                                                    buttonFunction: this.onRoadClickMethod}}/>
                            </div>) : ''
                        }
                        </div>

                    );
        });      

        return (
            <div>
                <div className="search-field">
                    <form style={{ margin: '0px'}}>
                        <h4 style={{ color: 'rgba(225,202,159,1)' }}>Find a trail</h4>

                        <input
                            style={style}
                            value={this.state.searchVal}
                            // value={this.state.searchVal.join(" ")}
                            ref={this.searchVal}
                            onChange={this.updateSearchValue}
                            type="text"
                            placeholder='Search by trail name or location'
                            required />

                        <button
                            onClick={this.onSearchButtonClicked}
                            type="submit"
                            style={{backgroundColor: 'rgba(255,255,255,0.4)', border: '1px solid black', borderRadius: '4px', display: 'none'}}>Search</button>
                    
                        <p className="error pink-text center-align"></p>
                    </form>
                </div>

                <div>
                    <button
                        onClick={this.siteFilterClicked}
                        style={{backgroundColor: siteColorPredicate, borderRadius: '4px', marginLeft: '5%'}}>Sites</button>
                    <button
                        onClick={this.roadFilterClicked}
                        style={{backgroundColor: roadColorPredicate, borderRadius: '4px', marginLeft: '10px' }}>Roads</button>
                </div>
                
                {/* Results */}
                <div className="container">
                    {searchResult.length !== 0 && <PaginatedList
                        list={searchResult.filter(this.resultsFilter)}
                        itemsPerPage={3}
                        renderList={mapping}/>}
                </div>

                {
                    this.state.searchVal.length != 0 && this.state.searchResult.length == 0 && this.state.haveSearched ?
                        (<h5 style={{ marginLeft: '5%' , color: 'rgba(223,30,38,0.9)'}}><b>No matches found!</b></h5>) : ''
                }
            </div>
        )    
    }
}

export default GeneralSearch