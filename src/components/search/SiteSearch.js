import React, { Component } from 'react'
import {findSites} from './SearchUtils'
import SiteComponent from '../sites/siteComponent'
import { PaginatedList } from 'react-paginated-list'


class SiteSearchPrototype extends Component {

    constructor(props) {
        super(props);

        const { buttonName, onClickMethod, canRenderButton, searchVal, returnTo } = props;
        this.state = {
            searchVal: searchVal ? searchVal.split(' ') : [],
            siteList: [],
            favoriteList: [],
            // Button content next to each entry
            buttonName,
            returnTo: returnTo
        }
        // onClick event handler for an entry button.
        this.onClickMethod = onClickMethod ? onClickMethod.bind(this) : null;
        // Boolean function for conditional button rendering.
        this.canRenderButton = canRenderButton ? canRenderButton.bind(this) : null;
        this.onSearchButtonClicked = this.onSearchButtonClicked.bind(this);
        this.updateSearchValue = this.updateSearchValue.bind(this);

        console.log(this.state.searchVal)

        if(this.state.searchVal.length >= 1) {
            this.executeSearch()
        }
    };

    onSearchButtonClicked(e) {
        e.preventDefault();

        // console.log(this.state.searchVal)

        window.location.href = '/' + this.state.returnTo + '/' + this.state.searchVal

        // const result = await findSites(this.state.searchVal)
        // console.log(result)
        // this.setState({siteList: result})
    }

    async executeSearch() {
        const result = await findSites(this.state.searchVal)
        // console.log(result)
        this.setState({siteList: result})
    }

    updateSearchValue(e) {
        // console.log(e.target.value)
        this.setState({searchVal: e.target.value})
    }

    render() {
        const { buttonName, siteList } = this.state;
        // console.log(siteList);
        const mapping = (list) => list.map((site, i) => {
            return  <div key={i} >
                        <SiteComponent key={i} props={site}/>
                        {this.onClickMethod && buttonName && this.canRenderButton(site.id) && 
                            <button onClick={(e) => this.onClickMethod(e, site.id)}>{buttonName}</button>}
                    </div>
        });
        //if site-id is not in favoritesList show button to add to favorites
      

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