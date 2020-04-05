import React, { Component } from 'react'
import Select from 'react-select'
import {findSites} from './SearchUtils'
import SiteComponent from '../sites/siteComponent'
import {myFirebase} from '../firebase/firebase'
import {getUserClaims, updateUserFavorites, getFavoritesIDs} from '../firebase/FirebaseUtilities'
import SiteSearch from './SiteSearch'
// import ReactPaginate from 'react-paginate'
// import { PaginatedList } from 'react-paginated-list'

class SearchMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userid: "",
            claim: "guest",
            favoriteList: [],
        }
        this.canRenderButton = this.canRenderButton.bind(this);
    }

    canRenderButton = (sid) => {
        if(this.state.claim !== "guest") {
            console.log(`tis not a guest`);
            if(!this.state.favoriteList.includes(sid)) {
                return true
            }
        }
        return false
    }

    addSiteToFavorites = async(e, sid) => {
        var favorites = this.state.favoriteList
        favorites.push(sid)
        updateUserFavorites(this.state.userid, favorites)
        
        this.setState({favoriteList: favorites})
    }

    async componentDidMount(){
        //console.log(await getUserClaims())
        //this.setState({claim: await getUserClaims()});
        myFirebase.auth().onAuthStateChanged(async (user) => {
            if(user) {
                var siteList = await getFavoritesIDs(user.uid)
                this.setState({userid: user.uid, claim: await getUserClaims(user), favoriteList: siteList});
            }
            //get favorites from user and save to this.state.favoriteList
       })
    }
    render() {
        console.log(`here!`);
        const { buttonName, siteList } = this.state;
        //if site-id is not in favoritesList show button to add to favorites
      
        return (
            <SiteSearch
                onClickMethod={this.addSiteToFavorites}
                buttonName={`Add to favorites`}
                canRenderButton={this.canRenderButton}/>
        );
            // <div>
            //     {/* Search site form */}
            //     <form ref={this.form} id="search-form">
            //         <div className="search-field">
            //             <input ref={this.searchVal} onChange={this.updateSearchValue} type="text" required />
            //         </div>
            //         <Select ref={this.dropList} defaultValue={options[0]} onChange={this.updateTopDownhValue} options={options} />
            //         <div>
            //             <button onClick={this.onSearchButtonClicked}>Search</button>
            //         </div>
            //         <p className="error pink-text center-align"></p>
            //     </form>
                
            //     {/* Results */}
            //     <div className="container">
            //         {siteList.length != 0 && <PaginatedList
            //             list={siteList}
            //             itemsPerPage={3}
            //             renderList={mapping}/>}
            //     </div>
            // </div>
        // )    
    }
}

export default SearchMenu