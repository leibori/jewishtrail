import React, { Component } from 'react'
import {myFirebase} from '../firebase/firebase'
import {getUserClaims, updateUserFavorites, getFavoritesIDs} from '../firebase/FirebaseUtilities'
import SiteSearch from './SiteSearch'


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

            // In case a user is registered this hold the site id's of it's favorites.
            favoriteList: [],

            // Pulls a string in the address' parameters into "searchVal", otherwise sets empty string.
            searchVal: props.match.params.searchVal ? props.match.params.searchVal : ''
        }
        // console.log(this.state.searchVal)
        this.canRenderButton = this.canRenderButton.bind(this);
    }


    /**
     * This function returns true if the user is not a guest and the site id (sid) is not in the user's favorites list.
     * Otherwise, it returns false.
     * This function is used to decide whether or not to show the "add to favorites" button.
     */
    canRenderButton = (sid) => {
        if(this.state.claim !== "guest") {
            // console.log(`tis not a guest`);
            if(!this.state.favoriteList.includes(sid)) {
                return true
            }
        }
        return false
    }


    /**
     * This function recieves an id and adds it to the user's favorites list in the database and in this component.
     */
    addSiteToFavorites = async(e, sid) => {
        var favorites = this.state.favoriteList
        favorites.push(sid)
        updateUserFavorites(this.state.userid, favorites)
        
        this.setState({favoriteList: favorites})
    }


    /**
     * This function is used in case the user has changed to get it's current claim, favorites and id.
     */
    async componentDidMount(){
        //console.log(await getUserClaims())
        //this.setState({claim: await getUserClaims()});
        myFirebase.auth().onAuthStateChanged(async (user) => {
            if(user) {
                this.setState({ userid: user.uid,
                                claim: await getUserClaims(user),
                                favoriteList: await getFavoritesIDs(user.uid) });
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
             * The function "canRenderButton" is used to decide whether or not to show button for each search result.
             * The string "Add to favorites" is placed inside the button.
             * The function "addSiteToFavorites" for execution in case the button was pressed.
             * The string "searchSite" is used as to transition to this component's address when the search button is pressed.
             */ 
            <SiteSearch
                onClickMethod={this.addSiteToFavorites}
                buttonName={`Add to favorites`}
                canRenderButton={this.canRenderButton}
                searchVal={this.state.searchVal}
                returnTo='searchSite'/>
        );
    }
}

export default SearchMenu