import React, { Component } from 'react'
import {myFirebase} from '../firebase/firebase'
import {getUserClaims, updateUserFavorites, getFavoritesIDs, getRoadFavoritesIDs, updateUserRoadsFavorites} from '../firebase/FirebaseUtilities'
import GeneralSearch from './GeneralSearch';


/**
 * This component is the search menu.
 */
class SearchMenu extends Component {

    // A constructor that sets the values of this component's state.
    constructor(props) {
        super(props);

        this.state = {
            // Holds the registered user's id in order to get it's favorites list.
            userid: "",

            // Holds the user's claim (guest/registered/admin), used to decide whether a "add to favorites" button appears.
            claim: "guest",

            // In case a user is registered this hold the site id's of it's favorite sites.
            siteFavoriteList: [],

            // In case a user is registered this hold the road id's of it's favorite roads.
            roadFavoriteList: [],

            // Pulls a string in the address' parameters into "searchVal", otherwise sets empty string.
            searchVal: props.match.params.searchVal ? props.match.params.searchVal : ''
        }
        // console.log(this.state.searchVal)
        this.canRenderButtonSite = this.canRenderButtonSite.bind(this);
        this.canRenderButtonRoad = this.canRenderButtonRoad.bind(this);
    }


    /**
     * This function returns true if the user is not a guest and the site id (sid) is not in the user's favorites list.
     * Otherwise, it returns false.
     * This function is used to decide whether or not to show the "add to favorites" button.
     */
    canRenderButtonSite = (sid) => {
        if(this.state.claim !== "guest") {
            // console.log(`tis not a guest`);
            if(!this.state.siteFavoriteList.includes(sid)) {
                return true
            }
        }
        return false
    }


    /**
     * This function returns true if the user is not a guest and the road id (sid) is not in the user's favorites list.
     * Otherwise, it returns false.
     * This function is used to decide whether or not to show the "add to favorites" button.
     */
    canRenderButtonRoad = (sid) => {
        if(this.state.claim !== "guest") {
            // console.log(`user is not a guest`);
            if(!this.state.roadFavoriteList.includes(sid)) {
                return true
            }
        }
        return false
    }


    /**
     * This function recieves an id and adds it to the user's favorite sites list in the database and in this component.
     */
    addSiteToFavorites = async(e, sid) => {
        var favorites = this.state.siteFavoriteList
        favorites.push(sid)
        updateUserFavorites(this.state.userid, favorites)
        
        this.setState({siteFavoriteList: favorites})
    }


    /**
     * This function recieves an id and adds it to the user's favorite roads list in the database and in this component.
     */
    addRoadToFavorites = async(e, sid) => {
        var favorites = this.state.roadFavoriteList
        favorites.push(sid)
        updateUserRoadsFavorites(this.state.userid, favorites)
        
        this.setState({roadFavoriteList: favorites})
    }


    /**
     * This function is used in case the user has changed to get it's current claim, favorites and id.
     */
    async componentDidMount() {
        myFirebase.auth().onAuthStateChanged(async (user) => {
            if(user) {
                this.setState({ userid: user.uid,
                                claim: await getUserClaims(user),
                                siteFavoriteList: await getFavoritesIDs(user.uid),
                                roadFavoriteList: await getRoadFavoritesIDs(user.uid) });
            }
       })
    }


    /**
     * This function renders the components by calling the "SiteSearch" component.
     */
    render() {
        return (
            /**
             * The string in this component's searchVal is used has the value by which the search is executed.
             * The function "canRenderButtonSite" is used to decide whether or not to show button for each site search result.
             * The function "canRenderButtonRoad" is used to decide whether or not to show button for each road search result.
             * The string "Add to favorites" is placed inside the button.
             * The function "addSiteToFavorites" for execution in case the button was pressed for a site.
             * The function "addRoadToFavorites" for execution in case the button was pressed for a road.
             * The string "searchSite" is used as to transition to this component's address when the search button is pressed.
             */ 
            <GeneralSearch
                onSiteClickMethod={this.addSiteToFavorites}
                onRoadClickMethod={this.addRoadToFavorites}
                buttonName={`Add to favorites`}
                canRenderButtonSite={this.canRenderButtonSite}
                canRenderButtonRoad={this.canRenderButtonRoad}
                searchVal={this.state.searchVal}
                returnTo='search'/>
        );
    }
}

export default SearchMenu