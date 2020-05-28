import React, { Component } from 'react'
import {findFromDB} from './SearchUtils'
import SiteComponent from '../sites/siteComponent'
import { PaginatedList } from 'react-paginated-list'
import { Link } from 'react-router-dom';

const buttonStyle = {
    marginLeft:"30px",
    padding:"10px 24px",
    borderRadius:'8px', 
    backgroundColor:'#5dbb63',
    opacity:'0.8',
    marginTop:'20px'
  }
  

/**
 * This component is holds the all of th elements of a search page and calls functions that execute searches.
 */
export default class SiteSearch extends Component {

    // A constructor that sets the values of this component's state.
    constructor(props) {
        super(props);

        // Extracting the props that the constructor recieves.
        const { siteButtonsProps, searchVal, returnTo, getParentState } = props;
        console.log(props)
        

        this.state = {
            // Is true if a search value is sent, and false otherwise.
            haveSearched: false,

            // The search value as array of strings.
            searchVal: searchVal ? searchVal.split(' ') : [],

            // The array of search results.
            siteList: [],

            // Button content next to each entry
            siteButtonsProps,

            // The beginning of the address that is set after the search button is pressed.
            returnTo: returnTo,

            getParentState : getParentState ? getParentState : ()=>{},

        }

        // onClick event handler for an entry button.
        // this.onClickMethod = onClickMethod ? onClickMethod.bind(this) : null;

        // Boolean function for conditional button rendering.
        // this.canRenderButton = canRenderButton ? canRenderButton.bind(this) : null;

        this.onSearchButtonClicked = this.onSearchButtonClicked.bind(this);
        this.updateSearchValue = this.updateSearchValue.bind(this);

        // console.log(this.state.searchVal)

        // // Execute the search if the componenet recieved a search value.
        // if(this.state.searchVal.length >= 1) {
        //     this.executeSearch()
        // }
    };
    
    // transition to a new page based on the "returnTo" and the search value.
    onSearchButtonClicked(e) {
        e.preventDefault();

        window.location.href = '/' + this.state.returnTo + '/' + this.state.searchVal
    }


    // The search function that calls for searches in the database.
    async executeSearch() {
        const result = await findFromDB(this.state.searchVal, ['sites'])
        // console.log(result)
        this.setState({siteList: result,
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
        const url = '/' + this.state.returnTo + '/' + this.state.searchVal;

        // console.log(url);
        // Extract "buttonName" and "siteList" variable for ease of use.
        const { siteList, siteButtonsProps } = this.state;
        // Creates a variable that holds the mapping of "SiteComponent" for paging later on.
        const mapping = (list) => list.map((site, i) => {
            return (siteButtonsProps.find((buttonProps) => buttonProps.canRender(site.id)) && <div key={i} style={{paddingRight:'0px',paddingLeft:'0px'}}>
                        <SiteComponent site={site} {...{siteButtonsProps}}/>
                    </div>)
        });      

        return (
            <div>
                {/* Search site form */}
                <form style={{marginTop:'0px',padding:'0px'}} onSubmit={e=>e.preventDefault()} id="search-form">
                    <div className="container">
                         <div className='field'>
                            <span><i className="fas fa-search" style={{marginLeft: '12px'}}></i></span>
                            <input style={{fontSize: '16px'}} placeholder='Search by location...' type="text" onChange={this.updateSearchValue} ref={this.searchVal} required />
                        </div> 
                        {/* //<input ref={this.searchVal} onChange={this.updateSearchValue} type="text" required /> */}
                    </div>
                    <div>
                        { <button style={buttonStyle}  type="button">
                            <Link className="white-text" to={{
                                pathname: url,
                                state: this.state.getParentState(),
                            }}>Search</Link>
                        </button>}
                        {/* <button onClick={this.onSearchButtonClicked} type="submit">Search</button> */}
                    </div>
                    <p className="error pink-text center-align"></p>
                </form>
                
                {/* Results */}
                <div className="results container" style={{padding:'10px', paddingLeft:'0px',paddingRight:'0px'}}>
                    {siteList.length > 30 ?
                    siteList.length !== 0 && <PaginatedList
                        list={siteList}
                        itemsPerPage={30}
                        renderList={mapping}/> : mapping(siteList)}
                </div>
                {
                    this.state.searchVal.length !== 0 && this.state.siteList.length === 0 && this.state.haveSearched ?
                        (<h5>No matches found.</h5>) : ''
                }
            </div>
        )    
    }
}