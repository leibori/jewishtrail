import React, { Component } from 'react'
import {getFavorites} from '../firebase/FirebaseUtilities'
import {getUserClaims, updateUserFavorites, getFavoritesIDs, getRoadFavoritesIDs, updateUserRoadsFavorites} from '../firebase/FirebaseUtilities'
import GeneralSearch from './GeneralSearch/';
import {myFirebase, myDatabase} from 'components/firebase/firebase'

/**
 * This component is the search menu.
 */
class SearchMenu extends Component {

    // A constructor that sets the values of this component's state.
    constructor(props) {
        super(props);
        console.log(props.location);
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
            searchVal: props.match.params.searchVal ? props.match.params.searchVal : '',

        }
        // console.log(this.state.searchVal)
        this.canRenderAddSite = this.canRenderAddSite.bind(this);
        this.canRenderAddRoad = this.canRenderAddRoad.bind(this);
        this.canRenderDeleteSite = this.canRenderDeleteSite.bind(this);
        this.canRenderDeleteRoad = this.canRenderDeleteRoad.bind(this);
        this.deleteFromFirebase = this.deleteFromFirebase.bind(this);
    }


    /**
     * This function returns true if the user is not a guest and the site id (sid) is not in the user's favorites list.
     * Otherwise, it returns false.
     * This function is used to decide whether or not to show the "add to favorites" button.
     */
    canRenderAddSite = (sid) => {
        if(this.state.claim !== "guest") {
            // console.log(`tis not a guest`);
            if(!this.state.siteFavoriteList.find(s=> s.uid==sid)) {
                return true
            }
        }
        return false
    }

    canRenderDeleteSite = (sid) => {
        console.log(sid);
        console.log(this.state.siteFavoriteList)
        if(this.state.claim !== "guest") {
            if (this.state.siteFavoriteList.find(s=> s.uid===sid)){
                return true;
            }
        }
        return false;
    }

    deleteFromFirebase = async(e, site) => {
        const sid = site.id;
        let { siteFavoriteList, userid } = this.state;
        var uidList = siteFavoriteList.filter(s => s.uid != site.id).map(s=>s.uid);
        console.log(uidList);
        await myDatabase.collection('accounts').doc(userid).update({'favorites': uidList})
        .catch(function(error) {
            console.error("Error removing document: ", error);
        console.log(siteFavoriteList)
        });
        siteFavoriteList = siteFavoriteList.filter(s => s.uid != site.id);
        console.log(siteFavoriteList)
        this.setState({siteFavoriteList});
    }
   
    canRenderAddRoad = (sid) => {
        if(this.state.claim !== "guest") {
            // console.log(`user is not a guest`);
            if(!this.state.roadFavoriteList.includes(sid)) {
                return true
            }
        }
        return false
    }

    canRenderDeleteRoad = (rid) => {
        if(this.state.claim !== "guest") {
            // console.log(`user is not a guest`);
            return (this.state.roadFavoriteList.includes(rid));
        }
        return false
    }

    /**
     * This function recieves an id and adds it to the user's favorite sites list in the database and in this component.
     */
    addSiteToFavorites = async(e, site) => {
        const newFavorites = this.state.siteFavoriteList;
        site.uid = site.id;
        newFavorites.push(site);
        const newFavoritesUID = newFavorites.map(s=>s.uid);
        console.log(newFavoritesUID);        
        console.log(newFavorites);        
        updateUserFavorites(this.state.userid, newFavoritesUID);
        this.setState({siteFavoriteList: newFavorites})
    }


    /**
     * This function recieves an id and adds it to the user's favorite roads list in the database and in this component.
     */
    addRoadToFavorites = async(e, road) => {
        const rid = road.id;
        var favorites = this.state.roadFavoriteList
        favorites.push(rid)
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
                                siteFavoriteList: await getFavorites(user.uid),
                                roadFavoriteList: await getRoadFavoritesIDs(user.uid) });
            }
       })

    }


    /**
     * This function renders the components by calling the "SiteSearch" component.
     */
    render() {
        const buttonName1 = <img style={{width: '40px', height:'40px', maxHeight: '40px', maxWidth: '40px'}} src="http://icons.iconarchive.com/icons/dryicons/aesthetica-2/64/favorite-add-icon.png"/>
        const buttonName2 = <img style={{width: '40px', height:'40px', maxHeight: '40px', maxWidth: '40px'}} src="http://icons.iconarchive.com/icons/dryicons/aesthetica-2/64/favorite-remove-icon.png"/>
        const siteButtonsProps = [{buttonFunction: this.addSiteToFavorites, buttonName: buttonName1, canRender: this.canRenderAddSite}, 
            {buttonFunction: this.deleteFromFirebase, buttonName: buttonName2, canRender: this.canRenderDeleteSite}];
        const roadButtonsProps = [{buttonFunction: this.addRoadToFavorites, buttonName: buttonName1, canRender: this.canRenderAddRoad}];
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
            <GeneralSearch style={{width: '100%'}}
                // onSiteClickMethod={this.addSiteToFavorites}
                // onRoadClickMethod={this.addRoadToFavorites}
                // buttonName={`Add to favorites`}
                // canRenderButtonSite={this.canRenderButtonSite}
                // canRenderButtonRoad={this.canRenderButtonRoad}
                {...{siteButtonsProps, roadButtonsProps}}
                searchVal={this.state.searchVal}
                returnTo='search'/>
        );
    }
}

export default SearchMenu