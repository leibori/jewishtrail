import React, { Component } from 'react'
import {findFromDB} from './SearchUtils'
import RoadComponent from '../road/RoadComponent'
import { PaginatedList } from 'react-paginated-list'


class RoadSearch extends Component {

    constructor(props) {
        super(props);

        const { roadButtonsProps, searchVal, returnTo } = props;
        this.state = {
            searchVal: searchVal ? searchVal.split(' ') : [],
            roadList: [],
            favoriteList: [],
            // Button content next to each entry
            roadButtonsProps,
            returnTo: returnTo
        }
        // onClick event handler for an entry button.
        // this.onClickMethod = onClickMethod ? onClickMethod.bind(this) : null;
        // // Boolean function for conditional button rendering.
        // this.canRenderButton = canRenderButton ? canRenderButton.bind(this) : null;
        this.onSearchButtonClicked = this.onSearchButtonClicked.bind(this);
        this.updateSearchValue = this.updateSearchValue.bind(this);

        console.log(this.state.searchVal)

        if(this.state.searchVal.length >= 1) {
            this.executeSearch()
        }
    };

    onSearchButtonClicked(e) {
        e.preventDefault();
        window.location.href = '/' + this.state.returnTo + '/' + this.state.searchVal

    }
    // search for roads
    async executeSearch() {
        console.log("searching road")
        const result = await findFromDB(this.state.searchVal,['roads'])
        this.setState({roadList: result})
    }

    updateSearchValue(e) {
        this.setState({searchVal: e.target.value})
    }

    render() {
        const { roadList, roadButtonsProps } = this.state;
        const mapping = (list) => list.map((road, i) => {
            return  <div key={i} >
                        <RoadComponent key={i} road={road} {...{roadButtonsProps}}/>
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
                    {roadList.length !== 0 && <PaginatedList
                        list={roadList}
                        itemsPerPage={3}
                        renderList={mapping}/>}
                </div>
            </div>
        )    
    }
}

export default RoadSearch