import React, { Component } from 'react'
import {getFavoritesIDs} from '../firebase/FirebaseUtilities'
import {getUserClaims, updateUserFavorites, getRoadFavoritesIDs, updateUserRoadsFavorites} from '../firebase/FirebaseUtilities'
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
        this.deleteSiteInFavorites = this.deleteSiteInFavorites.bind(this);
        this.deleteRoadInFavorites = this.deleteRoadInFavorites.bind(this);

    }


    /**
     * This function returns true if the user is not a guest and the site id (sid) is not in the user's favorites list.
     * Otherwise, it returns false.
     * This function is used to decide whether or not to show the "add to favorites" button.
     */
    canRenderAddSite = (sid) => {
        if(this.state.claim !== "guest") {
            if(!this.state.siteFavoriteList.includes(sid)) {
                return true
            }
        }
        return false
    }


    canRenderDeleteSite = (sid) => {
        if(this.state.claim !== "guest") {
            if (this.state.siteFavoriteList.includes(sid)){
                return true;
            }
        }
        return false;
    }


    deleteSiteInFavorites = async(e, sid) => {
        let { siteFavoriteList, userid } = this.state;
        var newSiteFavorites = siteFavoriteList.filter(s => s !== sid).map(s=>s);
        await myDatabase.collection('accounts').doc(userid).update({'favorites': newSiteFavorites})
        .catch(function(error) {
            console.error("Error removing document: ", error);
        });
        this.setState({siteFavoriteList: newSiteFavorites});
    }

    deleteRoadInFavorites = async(e, trailId) => {
        let { roadFavoriteList, userid } = this.state;
        var newRoadFavorites = roadFavoriteList.filter(r => r !== trailId).map(r=>r);
        await myDatabase.collection('accounts').doc(userid).update({'RoadsFavorites': newRoadFavorites})
        .catch(function(error) {
            console.error("Error removing document: ", error);
        });
        this.setState({roadFavoriteList: newRoadFavorites});
    }
   
    canRenderAddRoad = (sid) => {
        if(this.state.claim !== "guest") {
            if(!this.state.roadFavoriteList.includes(sid)) {
                return true
            }
        }
        return false
    }

    canRenderDeleteRoad = (rid) => {
        if(this.state.claim !== "guest") {
            return (this.state.roadFavoriteList.includes(rid));
        }
        return false
    }

    /**
     * This function recieves an id and adds it to the user's favorite sites list in the database and in this component.
     */
    addSiteToFavorites = async(e, sid) => {
        const favorites = this.state.siteFavoriteList;
        favorites.push(sid);
        updateUserFavorites(this.state.userid, favorites);
        this.setState({siteFavoriteList: favorites})
        console.log(favorites)
    }


    /**
     * This function recieves an id and adds it to the user's favorite roads list in the database and in this component.
     */
    addRoadToFavorites = async(e, trailId) => {
        var favorites = this.state.roadFavoriteList
        favorites.push(trailId)
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
        const buttonName1 = <img style={{width: '40px', height:'40px', maxHeight: '40px', maxWidth: '40px'}} src="http://icons.iconarchive.com/icons/dryicons/aesthetica-2/64/favorite-add-icon.png"/>
        const buttonName2 = <img style={{width: '40px', height:'40px', maxHeight: '40px', maxWidth: '40px'}} src="http://icons.iconarchive.com/icons/dryicons/aesthetica-2/64/favorite-remove-icon.png"/>
        const siteButtonsProps = [{buttonFunction: this.addSiteToFavorites, buttonName: buttonName1, canRender: this.canRenderAddSite}, 
            {buttonFunction: this.deleteSiteInFavorites, buttonName: buttonName2, canRender: this.canRenderDeleteSite}];
        const roadButtonsProps = [{buttonFunction: this.addRoadToFavorites, buttonName: buttonName1, canRender: this.canRenderAddRoad},
            {buttonFunction: this.deleteRoadInFavorites, buttonName: buttonName2, canRender: this.canRenderDeleteRoad}];
        return (
            
            <GeneralSearch style={{width: '100%'}}
                {...{siteButtonsProps, roadButtonsProps}}
                searchVal={this.state.searchVal}
                returnTo='search'/>
        );
    }
}

export default SearchMenu