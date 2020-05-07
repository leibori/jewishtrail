import React, { Component } from 'react'
import {getFavoritesIDs} from '../firebase/FirebaseUtilities'
import {updateUserFavoriteSites, getRoadFavoritesIDs, updateUserFavoriteRoads} from '../firebase/FirebaseUtilities'
import GeneralSearch from './GeneralSearch/';
import { setSiteFavorites, setTrailFavorites, setLikes, setDislikes } from '../../actions/index'
import { connect } from 'react-redux'
import {updateVote,getVoteByUserID,deleteVote} from '../firebase/FirebaseVotingUtils'


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

        // let formerState;
        // if (props.location && props.location.state){
        //     formerState =  props.location.state
        // }
        // else {
        //     console.log('Didnt get anything');
        // }

        this.state = {
           
            // In case a user is registered this hold the site id's of it's favorite sites.
            siteFavoriteList: [],

            // In case a user is registered this hold the road id's of it's favorite roads.
            roadFavoriteList: [],

            // Pulls a string in the address' parameters into "searchVal", otherwise sets empty string.
            searchVal: props.match.params.searchVal ? props.match.params.searchVal : '',

            // formerState: formerState ? formerState : '',

        }
        // console.log(this.state.searchVal)
        this.canRenderAddSite = this.canRenderAddSite.bind(this);
        this.canRenderAddRoad = this.canRenderAddRoad.bind(this);
        this.canRenderDeleteSite = this.canRenderDeleteSite.bind(this);
        this.canRenderDeleteRoad = this.canRenderDeleteRoad.bind(this);
        this.deleteSiteInFavorites = this.deleteSiteInFavorites.bind(this);
        this.deleteRoadInFavorites = this.deleteRoadInFavorites.bind(this);
        this.colorLike = this.colorLike.bind(this);
        this.colorDislike = this.colorDislike.bind(this);
    }

    /**
     * This function is used in case the user has changed to get it's current claim, favorites and id.
     */
    async componentDidMount() {
        console.log(this.props.logStatus)
        const { claims, uid } = this.props.logStatus
        if (claims != 'guest') {
            let likes = this.props.likes
            let dislikes = this.props.dislikes
            console.log(likes)
            console.log(dislikes)
            let allVotes = []
            let siteFavorites = this.props.siteFavorites
            let trailFavorites = this.props.trailFavorites
            if(likes.length === 0 && dislikes.length === 0){
                allVotes = await getVoteByUserID(uid)
                likes =  allVotes.filter(x=>x.vote === 1).map(x=>x.siteID)
                dislikes = allVotes.filter(x=>x.vote === 0).map(x=>x.siteID)
                this.props.setLikes(likes)
                this.props.setDislikes(dislikes) 
            }
            if (siteFavorites.length === 0) {
                siteFavorites = await getFavoritesIDs(uid)
                this.props.setSiteFavorites(siteFavorites)
            } 
            if (trailFavorites.length === 0) {
                trailFavorites = await getRoadFavoritesIDs(uid)
                this.props.setTrailFavorites(trailFavorites)
            }
            this.setState({
                siteFavoriteList: siteFavorites,
                roadFavoriteList: trailFavorites
            });
        }
    }

    /**
     * This function returns true if the user is not a guest and the site id (sid) is not in the user's favorites list.
     * Otherwise, it returns false.
     * This function is used to decide whether or not to show the "add to favorites" button.
     */
    canRenderAddSite = (sid) => {
        const { claims } = this.props.logStatus
        if(claims !== "guest") {
            if(!this.state.siteFavoriteList.includes(sid)) {
                return true
            }
        }
        return false
    }


    canRenderDeleteSite = (sid) => {
        const { claims } = this.props.logStatus
        if(claims !== "guest") {
            if (this.state.siteFavoriteList.includes(sid)){
                return true;
            }
        }
        return false;
    }


    deleteSiteInFavorites = async(e, sid) => {
        const { uid } = this.props.logStatus
        let { siteFavoriteList } = this.state;

        var newSiteFavorites = siteFavoriteList.filter(s => s !== sid).map(s=>s);

        this.props.setSiteFavorites(newSiteFavorites)
        updateUserFavoriteSites(uid, newSiteFavorites)
        this.setState({siteFavoriteList: newSiteFavorites});

        alert("The road was removed from your favorites.");
    }

    deleteRoadInFavorites = async(e, trailId) => {
        const { uid } = this.props.logStatus
        let { roadFavoriteList } = this.state;

        var newRoadFavorites = roadFavoriteList.filter(r => r !== trailId).map(r=>r);

        updateUserFavoriteRoads(uid, newRoadFavorites)
        this.props.setTrailFavorites(newRoadFavorites)
        this.setState({roadFavoriteList: newRoadFavorites});

        alert("The trail was removed from your favorites.");
    }
   
    canRenderAddRoad = (sid) => {
        const { claims } = this.props.logStatus
        if(claims !== "guest") {
            if(!this.state.roadFavoriteList.includes(sid)) {
                return true
            }
        }
        return false
    }

    canRenderDeleteRoad = (rid) => {
        const { claims } = this.props.logStatus
        if(claims !== "guest") {
            return (this.state.roadFavoriteList.includes(rid));
        }
        return false
    }

    /**
     * This function recieves an id and adds it to the user's favorite sites list in the database and in this component.
     */
    addSiteToFavorites = async(e, sid) => {
        const { uid } = this.props.logStatus
        const favorites = this.state.siteFavoriteList;

        favorites.push(sid);

        this.props.setSiteFavorites(favorites)
        updateUserFavoriteSites(uid, favorites);
        this.setState({siteFavoriteList: favorites})
        
        alert("The site was added to your favorites.");
    }


    /**
     * This function recieves an id and adds it to the user's favorite roads list in the database and in this component.
     */
    addRoadToFavorites = async(e, trailId) => {
        const { uid } = this.props.logStatus
        var favorites = this.state.roadFavoriteList

        favorites.push(trailId)
        
        this.props.setTrailFavorites(favorites)
        updateUserFavoriteRoads(uid, favorites)
        this.setState({roadFavoriteList: favorites})
        
        alert("The trail was added to your favorites.");
    }
    deleteElementFromRedux(type,elementId){
        switch (type){
            case 'likes':
                let updatedLikes = this.props.likes
                const IndexLike = updatedLikes.findIndex(element=>element === elementId)
                updatedLikes.splice(IndexLike,1)
                this.props.setLikes(updatedLikes)  
                break
            case 'dislikes':
                let updateDislikes = this.props.dislikes
                const IndexDisLikes = updateDislikes.findIndex(element=>element === elementId)
                updateDislikes.splice(IndexDisLikes,1)
                this.props.setDislikes(updateDislikes)
                break
            default:
        }
    }
    voteSite = (e,vote,siteId) => {
        const { uid } = this.props.logStatus
        if(vote){
            if(this.props.likes.includes(siteId)){
                this.deleteElementFromRedux('likes',siteId)
                deleteVote(uid,siteId)
            }
            else{
                if(this.props.dislikes.includes(siteId)){
                    this.deleteElementFromRedux('dislikes',siteId)    
                }
                let updatedLikes = this.props.likes
                updatedLikes.push(siteId)
                this.props.setLikes(updatedLikes)
                updateVote(uid,siteId,vote)
            }
        }else{
            if(this.props.dislikes.includes(siteId)){
                this.deleteElementFromRedux('dislikes',siteId)
                deleteVote(uid,siteId)
            }   
            else{
                if(this.props.likes.includes(siteId)){
                    this.deleteElementFromRedux('likes',siteId)
                }
                let updateDislikes = this.props.dislikes
                updateDislikes.push(siteId)
                this.props.setDislikes(updateDislikes)
                updateVote(uid,siteId,vote)
            }
        }
    }

    canRenderVoteID = (siteId) => {
        console.log(siteId)
        const { claims } = this.props.logStatus
        if(claims !== "guest") {
            return true
        }
        return false
    }
    colorLike = (siteId,buttonName) => {
        if(this.props.likes.includes(siteId)){
            console.log("bugaaaa")
            //return true
            return <span style={{color:'green'}}>{buttonName}</span>
        }
        console.log("lo buga")
        return buttonName
        //return false
    }

    colorDislike = (siteId,buttonName) => {
        if(this.props.dislikes.includes(siteId)){
            //return true
            return <span style={{color:'red'}}>{buttonName}</span>
        }
        return buttonName
    }
    /**
     * This function renders the components by calling the "SiteSearch" component.
     */
    render() {
        const buttonName1 = <img style={{width: '40px', height:'40px', maxHeight: '40px', maxWidth: '40px'}} src="http://icons.iconarchive.com/icons/dryicons/aesthetica-2/64/favorite-add-icon.png"/>
        const buttonName2 = <img style={{width: '40px', height:'40px', maxHeight: '40px', maxWidth: '40px'}} src="http://icons.iconarchive.com/icons/dryicons/aesthetica-2/64/favorite-remove-icon.png"/>
        const voteLikeButtonName = <span className="fas fa-thumbs-up fa-2x" style={likeStyle}/>
        const voteDislikeButtonName = <span className="fas fa-thumbs-down fa-2x" style={dislikeStyle}/>
        const siteButtonsProps = [{buttonFunction: this.addSiteToFavorites, buttonName: buttonName1, canRender: this.canRenderAddSite}, 
            {buttonFunction: this.deleteSiteInFavorites, buttonName: buttonName2, canRender: this.canRenderDeleteSite}];
        const voteButtonsProps = [{buttonFunction: this.voteSite, buttonName:voteLikeButtonName,colorLike:this.colorLike,canRender:this.canRenderVoteID},
                                  {buttonFunction: this.voteSite, buttonName:voteDislikeButtonName,colorDislike:this.colorDislike,canRender:this.canRenderVoteID}]
        const roadButtonsProps = [{buttonFunction: this.addRoadToFavorites, buttonName: buttonName1, canRender: this.canRenderAddRoad},
            {buttonFunction: this.deleteRoadInFavorites, buttonName: buttonName2, canRender: this.canRenderDeleteRoad}];
        return (
            <GeneralSearch style={{width: '100%'}}
                {...{siteButtonsProps, roadButtonsProps,voteButtonsProps}}
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
        likes: state.likes,
        dislikes: state.dislikes
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
        setLikes: (likes) =>{
            dispatch(setLikes(likes))
        },
        setDislikes: (dislikes) =>{
            dispatch(setDislikes(dislikes))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchMenu);