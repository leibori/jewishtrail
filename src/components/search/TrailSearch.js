import React, { Component } from 'react'
import {findFromDB} from './SearchUtils'
import TrailComponent from '../trail/TrailComponent'
import { PaginatedList } from 'react-paginated-list'


class TrailSearch extends Component {

    constructor(props) {
        super(props);

        const { trailButtonsProps, searchVal, returnTo } = props;
        this.state = {
            searchVal: searchVal ? searchVal.split(' ') : [],
            trailList: [],
            favoriteList: [],
            // Button content next to each entry
            trailButtonsProps,
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
    // search for trails.
    async executeSearch() {
        console.log("searching trail")
        const result = await findFromDB(this.state.searchVal,['roads'])
        this.setState({trailList: result})
    }

    updateSearchValue(e) {
        this.setState({searchVal: e.target.value})
    }

    render() {
        const { trailList, trailButtonsProps } = this.state;
        const mapping = (list) => list.map((trail, i) => {
            return  <div key={i} style={{paddingLeft:'0px',paddingRight:'0px'}}>
                        <TrailComponent key={i} trail={trail} {...{trailButtonsProps}}/>
                    </div>
        });
        //if site-id is not in favoritesList show button to add to favorites
      

        return (
            <div>
                {/* Search site form */}
                <form style={{marginTop:'0px',padding:'0px'}} ref={this.form} id="search-form">
                    <div className="container">
                         <div className='field'>
                            <span><i className="fas fa-search" style={{marginLeft: '12px'}}></i></span>
                            <input style={{fontSize: '16px'}} placeholder='Search Trail...' type="text" onChange={this.updateSearchValue} ref={this.searchVal} required />
                        </div> 
                        {/* //<input ref={this.searchVal} onChange={this.updateSearchValue} type="text" required /> */}
                    </div>
                    <div>
                        <button style={{display:'none'}} onClick={this.onSearchButtonClicked}></button>
                    </div>
                    <p className="error pink-text center-align"></p>
                </form>
                
                {/* Results */}
                <div className="container" style={{padding:'10px', paddingLeft:'0px',paddingRight:'0px'}}>
                    {trailList.length > 30 ? <PaginatedList
                        list={trailList}
                        itemsPerPage={31}
                        renderList={mapping}/> : mapping(trailList)}
                </div>
            </div>
        )    
    }
}

export default TrailSearch