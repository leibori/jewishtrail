import React, { Component } from 'react'
import { updateUserFavoriteSites, getRoadFavoritesIDs, updateUserFavoriteRoads, getFavoritesIDs } from '../firebase/FirebaseUtilities'
import GeneralSearch from './GeneralSearch/';
// import { setSiteFavorites, setTrailFavorites, setLikes, setDislikes } from '../../actions/index'
import { setSiteFavorites, setTrailFavorites } from '../../actions/index'
import { connect } from 'react-redux'
// import {updateVote,getVoteByUserID,deleteVote} from '../firebase/FirebaseVotingUtils'


let buttonVote = {
    width: '40px',
    height:'40px', 
    maxHeight: '40px', 
    maxWidth: '40px'
}

let likeStyle ={
    ...buttonVote,

}

let dislikeStyle={
    ...buttonVote,
}

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
        this.canRenderAddRoad = this.canRenderAddRoad.bind(this);
        this.canRenderDeleteSite = this.canRenderDeleteSite.bind(this);
        this.canRenderDeleteRoad = this.canRenderDeleteRoad.bind(this);
        this.deleteSiteInFavorites = this.deleteSiteInFavorites.bind(this);
        this.deleteRoadInFavorites = this.deleteRoadInFavorites.bind(this);
        // this.colorLike = this.colorLike.bind(this);
        // this.colorDislike = this.colorDislike.bind(this);
    }


    /**
     * This function is used in case the user has changed to get it's current claim, favorites and id.
     */
    async componentDidMount() {

        const { claims, uid } = this.props.logStatus

        if (claims !== 'guest') {
            // let likes = this.props.likes
            // let dislikes = this.props.dislikes
            // let allVotes = []
            let siteFavorites = this.props.siteFavorites
            let trailFavorites = this.props.trailFavorites
            // if(likes.length === 0 && dislikes.length === 0){
            //     allVotes = await getVoteByUserID(uid)
            //     likes =  allVotes.filter(x=>x.vote === 1).map(x=>x.siteID)
            //     dislikes = allVotes.filter(x=>x.vote === 0).map(x=>x.siteID)
            //     this.props.setLikes(likes)
            //     this.props.setDislikes(dislikes) 
            // }
            if (siteFavorites.length === 0) {
                siteFavorites = await getFavoritesIDs(uid)
                this.props.setSiteFavorites(siteFavorites)
            } 
            if (trailFavorites.length === 0) {
                trailFavorites = await getRoadFavoritesIDs(uid)
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
    canRenderAddRoad = (sid) => {
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
    canRenderDeleteRoad = (rid) => {
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
        // this.deleteElementFromRedux('siteFavorites', sid)
        updateUserFavoriteSites(uid, newSiteFavorites)

        this.setState({})
    }


    /**
     * This function receives a trail id and removes it from the user's favorite trails list.
     * It also updates the favorites trails that are saved in local storage using redux.
     */
    deleteRoadInFavorites = async(e, trailId) => {
        const { uid } = this.props.logStatus
        let trailFavorites = this.props.trailFavorites;

        var newTrailFavorites = trailFavorites.filter(r => r !== trailId).map(r=>r);

        this.props.setTrailFavorites(newTrailFavorites)
        // this.deleteElementFromRedux('trailFavorites', trailId)
        updateUserFavoriteRoads(uid, newTrailFavorites)

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
    addRoadToFavorites = async(e, trailId) => {
        const { uid } = this.props.logStatus
        var favorites = this.props.trailFavorites

        favorites.push(trailId)
        
        this.props.setTrailFavorites(favorites)
        updateUserFavoriteRoads(uid, favorites)
        
        this.setState({})
    }


    /**
     * This functions receives an element array from local storage and elemnt ID and removes the respective element from the array.
     * @param {[]} reduxElementArray 
     * @param {string} elementId 
     */
    // arraySpliceByElementID(reduxElementArray, elementId) {
    //     var index = reduxElementArray.findIndex(element=>element === elementId)
    //     reduxElementArray.splice(index, 1)
    // }


    /**
     * This functions receives a string value "type" that refers to a specific array in local storage, and a string value "elementId" to remove from it.
     * @param {string} type 
     * @param {string} elementId 
     */
    // deleteElementFromRedux(type, elementId) {
    //     var reduxElementArray
    //     switch (type){
    //         case 'likes':
    //             reduxElementArray = this.props.likes
    //             this.arraySpliceByElementID(reduxElementArray, elementId)
    //             this.props.setLikes(reduxElementArray)  
    //             break
    //         case 'dislikes':
    //             reduxElementArray = this.props.dislikes
    //             this.arraySpliceByElementID(reduxElementArray, elementId)
    //             this.props.setDislikes(reduxElementArray)  
    //             break
    //         case 'siteFavorites':
    //             reduxElementArray = this.props.siteFavorites
    //             this.arraySpliceByElementID(reduxElementArray, elementId)
    //             this.props.setSiteFavorites(reduxElementArray)  
    //             break
    //         case 'trailFavorites':
    //             reduxElementArray = this.props.trailFavorites
    //             this.arraySpliceByElementID(reduxElementArray, elementId)
    //             this.props.setTrailFavorites(reduxElementArray)  
    //             break
    //         default:
    //     }
    // }


    /**
     * This variable contains a function that hold the logic of user picking "like" or "dislike".
     * The "vote" value is 0 in case of dislike and 1 in case of like.
     * @param {int} vote
     * @param {string} elementId
     */
    // voteSite = (e,vote,elementId) => {
    //     const { uid } = this.props.logStatus
    //     if(vote){
    //         if(this.props.likes.includes(elementId)){
    //             this.deleteElementFromRedux('likes',elementId)
    //             deleteVote(uid,elementId)
    //         }
    //         else{
    //             if(this.props.dislikes.includes(elementId)){
    //                 this.deleteElementFromRedux('dislikes',elementId)    
    //             }
    //             let updatedLikes = this.props.likes
    //             updatedLikes.push(elementId)
    //             this.props.setLikes(updatedLikes)
    //             updateVote(uid,elementId,vote)
    //         }
    //     }else{
    //         if(this.props.dislikes.includes(elementId)){
    //             this.deleteElementFromRedux('dislikes',elementId)
    //             deleteVote(uid,elementId)
    //         }   
    //         else{
    //             if(this.props.likes.includes(elementId)){
    //                 this.deleteElementFromRedux('likes',elementId)
    //             }
    //             let updateDislikes = this.props.dislikes
    //             updateDislikes.push(elementId)
    //             this.props.setDislikes(updateDislikes)
    //             updateVote(uid,elementId,vote)
    //         }
    //     }
    // }


    /**
     * This function is used to decide whether or not to show the like and dislike buttons, based on the user's claims.
     */
    // canRenderVoteID = (siteId) => {
    //     const { claims } = this.props.logStatus
    //     if(claims !== "guest") {
    //         return true
    //     }
    //     return false
    // }


    /**
     * This function is used to color the like button in case the user already clicked on it for a specific site/trail.
     */
    // colorLike = (siteId,buttonName) => {
    //     if(this.props.likes.includes(siteId)){
    //         //return true
    //         return <span style={{color:'green'}}>{buttonName}</span>
    //     }
    //     return buttonName
    //     //return false
    // }


    /**
     * This function is used to color the dislike button in case the user already clicked on it for a specific site/trail.
     */
    // colorDislike = (siteId,buttonName) => {
    //     if(this.props.dislikes.includes(siteId)){
    //         //return true
    //         return <span style={{color:'red'}}>{buttonName}</span>
    //     }
    //     return buttonName
    // }


    /**
     * This function renders the components by calling the "SiteSearch" component.
     */
    render() {
        const buttonName1 = <img style={{width: '40px', height:'40px', maxHeight: '40px', maxWidth: '40px'}} src="http://icons.iconarchive.com/icons/dryicons/aesthetica-2/64/favorite-add-icon.png"/>
        const buttonName2 = <img style={{width: '40px', height:'40px', maxHeight: '40px', maxWidth: '40px'}} src="http://icons.iconarchive.com/icons/dryicons/aesthetica-2/64/favorite-remove-icon.png"/>
        // const voteLikeButtonName = <span className="fas fa-thumbs-up fa-2x" style={likeStyle}/>
        // const voteDislikeButtonName = <span className="fas fa-thumbs-down fa-2x" style={dislikeStyle}/>
        const siteButtonsProps = [{buttonFunction: this.addSiteToFavorites, buttonName: buttonName1, canRender: this.canRenderAddSite}, 
            {buttonFunction: this.deleteSiteInFavorites, buttonName: buttonName2, canRender: this.canRenderDeleteSite}];
        // const voteButtonsProps = [{buttonFunction: this.voteSite, buttonName:voteLikeButtonName,colorLike:this.colorLike,canRender:this.canRenderVoteID},
        //     {buttonFunction: this.voteSite, buttonName:voteDislikeButtonName,colorDislike:this.colorDislike,canRender:this.canRenderVoteID}]
        const roadButtonsProps = [{buttonFunction: this.addRoadToFavorites, buttonName: buttonName1, canRender: this.canRenderAddRoad},
            {buttonFunction: this.deleteRoadInFavorites, buttonName: buttonName2, canRender: this.canRenderDeleteRoad}];
        return (
            <GeneralSearch style={{width: '100%'}}
                // {...{siteButtonsProps, roadButtonsProps,voteButtonsProps}}
                {...{siteButtonsProps, roadButtonsProps }}

                searchVal={this.state.searchVal}
                // formerState={this.state.formerState}
                returnTo='search'/>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        logStatus: state.status,
        siteFavorites: state.siteFavorites,
        trailFavorites: state.trailFavorites,
        // likes: state.likes,
        // dislikes: state.dislikes
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSiteFavorites: (siteFavorites) => {
            dispatch(setSiteFavorites(siteFavorites))
        },
        setTrailFavorites: (trailFavorites) => {
            dispatch(setTrailFavorites(trailFavorites))
        },
        // setLikes: (likes) =>{
        //     dispatch(setLikes(likes))
        // },
        // setDislikes: (dislikes) =>{
        //     dispatch(setDislikes(dislikes))
        // }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchMenu);