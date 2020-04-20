import React, { Component } from 'react'
import {findFromDB} from '../SearchUtils'
import SiteComponent from 'components/sites/siteComponent'
import { PaginatedList } from 'react-paginated-list'
import RoadComponent from 'components/road/RoadComponent';
import 'index.css';         

const headerStyle = {
    color: 'white',
    fontWeight: '800',
    fontSize: '22px',
    fontFamily: "\'Cambay\', sans-serif",
}

// const style = {backgroundColor: 'white',
//     backgroundImage: "url(" + "https://image0.flaticon.com/icons/png/128/49/49116.png" + ")",
//     backgroundPosition: '2px 3px',
//     backgroundRepeat: 'no-repeat',
//     paddingLeft: '25px',
//     borderRadius: '8px',
//     backgroundSize: '20px 20px',
//     width: '100%',
//     height: '45px'
// }


/**
 * This component is holds the all of th elements of a search page and calls functions that execute searches.
 */
class GeneralSearch extends Component {

    // A constructor that sets the values of this component's state.
    constructor(props) {
        super(props);

        // Extracting the props that the constructor recieves.
        const { siteButtonsProps, roadButtonsProps, searchVal, returnTo, classes } = props;
        // const { buttonName, onRoadClickMethod, onSiteClickMethod, canRenderButtonSite, canRenderButtonRoad, searchVal, returnTo, classes } = props;

        this.state = {
            // Is true if a search value is sent, and false otherwise.
            haveSearched: false,

            // The search value as array of strings.
            searchVal: searchVal,

            // The array of search results.
            searchResult: [],

            // Button content next to each entry
            siteButtonsProps,

            roadButtonsProps,

            // The beginning of the address that is set after the search button is pressed.
            returnTo: returnTo,

            siteFilter: true,

            roadFilter: true,

            classes
        }

        // // onClick event handler for an entry button.
        // this.onSiteClickMethod = onSiteClickMethod ? onSiteClickMethod.bind(this) : null;

        // // onClick event handler for an entry button.
        // this.onRoadClickMethod = onRoadClickMethod ? onRoadClickMethod.bind(this) : null;

        // // Boolean function for conditional button rendering.
        // this.canRenderButtonSite = canRenderButtonSite ? canRenderButtonSite.bind(this) : null;

        // this.canRenderButtonRoad = canRenderButtonRoad ? canRenderButtonRoad.bind(this) : null;

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

        const { siteButtonsProps, roadButtonsProps } = this.state;

        const classes = this.state.classes

        // Predicate that decides the color of the button of the site filter.
        const siteColorPredicate = !this.state.roadFilter ? 'rgba(230,223,0,0.4)' : 'rgba(255,255,255,0.4)'

        // Predicate that decides the color of the button of the road filter.
        const roadColorPredicate = !this.state.siteFilter ? 'rgba(230,223,0,0.4)' : 'rgba(255,255,255,0.4)'

        // Extract "buttonName" and "searchResult" variable for ease of use.
        const { searchResult } = this.state;

        // Creates a variable that holds the mapping of "SiteComponent" for paging later on.
        const mapping = (list) => list.map((site, i) => {
            return  (
                        <div key={i}>
                        {site.type === 'sites' && this.state.siteFilter ?
                            (<div>  
                                <SiteComponent {...{siteButtonsProps}} site={site} />
                                {/* <SiteComponent props={{site: site,
                                                    buttonName: buttonName,
                                                    condition: this.onSiteClickMethod && buttonName && this.canRenderButtonSite(site.id),
                                                    buttonFunction: this.onSiteClickMethod}}/> */}
                            </div>)
                            : site.type === 'roads' && this.state.roadFilter ?
                            (<div>  
                                 <RoadComponent {...{roadButtonsProps}} road={site}/>
                                {/* <RoadComponent props={{road: site,
                                                    buttonName: buttonName,
                                                    condition: this.onRoadClickMethod && buttonName && this.canRenderButtonRoad(site.id),
                                                    buttonFunction: this.onRoadClickMethod}}/> */}
                            </div>) : ''
                        }
                        </div>

                    );
        });      

        return (
            <div style={{width: '100%'}}>
                <form style={{ width: '100%'}}>
                    <header style={headerStyle}>Find a trail</header>
                    <div className='field'>
                        <span><i className="fas fa-search" style={{marginLeft: '12px'}}></i></span>
                        <input style={{fontSize: '16px'}} required  placeholder='Search by trail name or location...' type="text" onChange={this.updateSearchValue} ref={this.searchVal} value={this.state.searchVal}></input>
                    </div>                        
                    <button
                        onClick={this.onSearchButtonClicked}
                        type="submit"
                        style={{backgroundColor: 'rgba(255,255,255,0.4)', border: '1px solid black', borderRadius: '4px', display: 'none'}}>Search</button>
                
                    <p className="error pink-text center-align"></p>
                </form>
                {searchResult.length > 0 && <div style={{marginBottom: '5%'}}>
                    <button
                        onClick={this.siteFilterClicked}
                        style={{backgroundColor: siteColorPredicate, borderRadius: '4px', marginLeft: '5%'}}>Sites</button>
                    <button
                        onClick={this.roadFilterClicked}
                        style={{backgroundColor: roadColorPredicate, borderRadius: '4px', marginLeft: '10px' }}>Roads</button>
                </div>}
                
                {/* Results */}
                <div className="container">
                    {searchResult.length !== 0 && <PaginatedList
                        list={searchResult.filter(this.resultsFilter)}
                        itemsPerPage={20}
                        renderList={mapping}/>}
                </div>

                {
                    this.state.searchVal.length != 0 && this.state.searchResult.length == 0 && this.state.haveSearched ?
                        (<h4 style={{ fontWeight: '650', marginLeft: '5%' , color: 'rgba(223,30,38,0.9)'}}>No matches found!</h4>) : ''
                }
            </div>
        )    
    }
}

export default GeneralSearch