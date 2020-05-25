import React, { Component } from 'react'
import { updateUserFavoriteSites, getTrailFavoritesIDs, updateUserFavoriteTrails, getFavoritesIDs } from '../firebase/FirebaseUtilities'
import GeneralSearch from './GeneralSearch/';
import { setSiteFavorites, setTrailFavorites } from '../../actions/index'
import { connect } from 'react-redux'
import favorites_add_icon from '../../assets/img/favorite-add-icon.png'
import favorites_remove_icon from '../../assets/img/favorite-remove-icon.png'


/**
 * This component is the search menu.
 */
class SearchMenu extends Component {

    // A constructor that sets the values of this component's state.
    constructor(props) {
        super(props);

        this.state = {

            // Pulls a string in the address' parameters into "searchVal", otherwise sets empty string.
            searchVal: props.match.params.searchVal ? props.match.params.searchVal : '',
        }

        // Bind to various functions needed to render certain buttons.
        this.canRenderAddSite = this.canRenderAddSite.bind(this);
        this.canRenderAddTrail = this.canRenderAddTrail.bind(this);
        this.canRenderDeleteSite = this.canRenderDeleteSite.bind(this);
        this.canRenderDeleteTrail = this.canRenderDeleteTrail.bind(this);
        this.deleteSiteInFavorites = this.deleteSiteInFavorites.bind(this);
        this.deleteTrailInFavorites = this.deleteTrailInFavorites.bind(this);
    }


    /**
     * This function is used in case the user has changed to get it's current claim, favorites and id.
     */
    async componentDidMount() {

        const { claims, uid } = this.props.logStatus

        if (claims !== 'guest') {

            let siteFavorites = this.props.siteFavorites
            let trailFavorites = this.props.trailFavorites

            if (siteFavorites.length === 0) {
                siteFavorites = await getFavoritesIDs(uid)
                this.props.setSiteFavorites(siteFavorites)
            } 

            if (trailFavorites.length === 0) {
                trailFavorites = await getTrailFavoritesIDs(uid)
                this.props.setTrailFavorites(trailFavorites)
            }
        }
    }


    /**
     * This function returns true if the user is not a guest and the site id (sid) is not in the user's favorite sites list.
     * Otherwise, it returns false.
     * This function is used to decide whether or not to show the "add to favorites" button.
     */
    canRenderAddSite = (sid) => {
        const { claims } = this.props.logStatus
        if(claims !== "guest") {
            if(!this.props.siteFavorites.includes(sid)) {
                return true
            }
        }
        return false
    }


    /**
     * This function returns true if the user is not a guest and the site id (sid) is in the user's favorite sites list.
     * Otherwise, it returns false.
     * This function is used to decide whether or not to show the "delete from favorites" button.
     */
    canRenderDeleteSite = (sid) => {
        const { claims } = this.props.logStatus
        if(claims !== "guest") {
            if (this.props.siteFavorites.includes(sid)) {
                return true;
            }
        }
        return false;
    }


    /**
     * This function returns true if the user is not a guest and the trail id (sid) is not in the user's favorite trails list.
     * Otherwise, it returns false.
     * This function is used to decide whether or not to show the "add to favorites" button.
     */
    canRenderAddTrail = (sid) => {
        const { claims } = this.props.logStatus
        if(claims !== "guest") {
            if(!this.props.trailFavorites.includes(sid)) {
                return true
            }
        }
        return false
    }


    /**
     * This function returns true if the user is not a guest and the trail id (sid) is in the user's favorite trails list.
     * Otherwise, it returns false.
     * This function is used to decide whether or not to show the "delete from favorites" button.
     */
    canRenderDeleteTrail = (rid) => {
        const { claims } = this.props.logStatus
        if(claims !== "guest") {
            return (this.props.trailFavorites.includes(rid));
        }
        return false
    }


    /**
     * This function receives a site id and removes it from the user's favorite sites list.
     * It also updates the favorites sites that are saved in local storage using redux.
     */
    deleteSiteInFavorites = async(e, sid) => {
        const { uid } = this.props.logStatus
        let siteFavorites = this.props.siteFavorites;

        var newSiteFavorites = siteFavorites.filter(s => s !== sid).map(s=>s);
        
        this.props.setSiteFavorites(newSiteFavorites)
        updateUserFavoriteSites(uid, newSiteFavorites)

        this.setState({})
    }


    /**
     * This function receives a trail id and removes it from the user's favorite trails list.
     * It also updates the favorites trails that are saved in local storage using redux.
     */
    deleteTrailInFavorites = async(e, trailId) => {
        const { uid } = this.props.logStatus
        let trailFavorites = this.props.trailFavorites;

        var newTrailFavorites = trailFavorites.filter(r => r !== trailId).map(r=>r);

        this.props.setTrailFavorites(newTrailFavorites)
        updateUserFavoriteTrails(uid, newTrailFavorites)

        this.setState({})
    }
   

    /**
     * This function recieves a site id and adds it to the user's favorite sites list in the database.
     * It also updates the favorites sites that are saved in local storage using redux.
     */
    addSiteToFavorites = async(e, sid) => {
        const { uid } = this.props.logStatus
        const favorites = this.props.siteFavorites;

        favorites.push(sid);

        this.props.setSiteFavorites(favorites)
        updateUserFavoriteSites(uid, favorites);   
 
        this.setState({})
    }


    /**
     * This function recieves a trail id and adds it to the user's favorite trails list in the database.
     * It also updates the favorites trails that are saved in local storage using redux.
     */
    addTrailToFavorites = async(e, trailId) => {
        const { uid } = this.props.logStatus
        var favorites = this.props.trailFavorites

        favorites.push(trailId)
        
        this.props.setTrailFavorites(favorites)
        updateUserFavoriteTrails(uid, favorites)
        
        this.setState({})
    }


    /**
     * This function renders the components by calling the "SiteSearch" component.
     */
    render() {
        const buttonName1 = <img style={{width: '40px', height:'40px', maxHeight: '40px', maxWidth: '40px'}} src={favorites_add_icon} alt="Add to favorites"/>
        const buttonName2 = <img style={{width: '40px', height:'40px', maxHeight: '40px', maxWidth: '40px'}} src={favorites_remove_icon} alt="Remove from favorites"/>
        const siteButtonsProps = [{buttonFunction: this.addSiteToFavorites, buttonName: buttonName1, canRender: this.canRenderAddSite}, 
            {buttonFunction: this.deleteSiteInFavorites, buttonName: buttonName2, canRender: this.canRenderDeleteSite}];
        const trailButtonsProps = [{buttonFunction: this.addTrailToFavorites, buttonName: buttonName1, canRender: this.canRenderAddTrail},
            {buttonFunction: this.deleteTrailInFavorites, buttonName: buttonName2, canRender: this.canRenderDeleteTrail}];
        return (
            <GeneralSearch style={{width: '100%'}}
                {...{siteButtonsProps, trailButtonsProps }}
                searchVal={this.state.searchVal}
                returnTo='search'/>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        logStatus: state.status,
        siteFavorites: state.siteFavorites,
        trailFavorites: state.trailFavorites,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSiteFavorites: (siteFavorites) => dispatch(setSiteFavorites(siteFavorites)),
        
        setTrailFavorites: (trailFavorites) => dispatch(setTrailFavorites(trailFavorites))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchMenu);