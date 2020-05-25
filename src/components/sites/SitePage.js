import React, { Component } from "react";
import { updateUserFavoriteSites, getRoadFavoritesIDs, getFavoritesIDs, getSiteByID } from '../firebase/FirebaseUtilities'
import { getSitePageMap, findUserPosition } from '../map/MapUtilities'
import { Card, Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import { setSiteFavorites, setTrailFavorites, setLikes, setDislikes } from '../../actions/index'
import {updateVote,getVoteByUserID,deleteVote} from '../firebase/FirebaseVotingUtils'
import Circle from 'react-circle';
import favorites_add_icon from '../../assets/img/favorite-add-icon.png'
import favorites_remove_icon from '../../assets/img/favorite-remove-icon.png'


let buttonVote = {  
    marginTop: '10px',
    textAlign: 'center',
    borderRadius: '4px',
    background: 'transparent',
    border: 'none',
}

let likeStyle ={
    ...buttonVote,
    marginRight: '5px',
}

let dislikeStyle={
    ...buttonVote,
    marginLeft: '5px',
}


class SitePage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            site_id: props.match.params.id,
            name: '',
            city: '',
            country: '',
            address: '',
            fullInfo: '',
            imageUrl: '',
            externalSourceUrl: '',
            latitude: 1,
            longitude: 1,
            vote: 0,
            zoom: 17,
            navigationLink: '',
            likeFlag: '',
            dislikeFlag: '',
        }
    };

    async componentWillMount() {

        var all_site_props = await getSiteByID(this.state.site_id)

        var navLink = "https://www.google.com/maps/dir/?api=1&destination="+all_site_props.latitude+"%2C"+all_site_props.longitude+"&dir_action=navigate"

        this.handleVotesAndFavorites()

        if(this.props.position.country === '') {
            this.props.findUserPosition()
        }

        getSitePageMap('map', all_site_props, this.state.zoom, this.props.position.lat, this.props.position.lng)

        this.setState({ 
            ...all_site_props,
            navigationLink: navLink,
            likeFlag: this.colorLike(),
            dislikeFlag: this.colorDislike(),
        })
    }


    async handleVotesAndFavorites() {

        const { claims, uid } = this.props.logStatus

        if (claims !== 'guest') {
            let likes = this.props.likes
            let dislikes = this.props.dislikes

            let siteFavorites = this.props.siteFavorites
            let trailFavorites = this.props.trailFavorites

            let allVotes = []

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
        }
    }


    /**
     * This functions receives an element array from local storage and elemnt ID and removes the respective element from the array.
     * @param {[]} reduxElementArray 
     * @param {string} elementId 
     */
    arraySpliceByElementID(reduxElementArray, elementId) {
        var index = reduxElementArray.findIndex(element=>element === elementId)
        reduxElementArray.splice(index, 1)
    }


    /**
     * This functions receives a string value "type" that refers to a specific array in local storage, and a string value "elementId" to remove from it.
     * @param {string} type 
     * @param {string} elementId 
     */
    deleteElementFromRedux(type, elementId) {
        var reduxElementArray
        switch (type){
            case 'likes':
                reduxElementArray = this.props.likes
                this.arraySpliceByElementID(reduxElementArray, elementId)
                this.props.setLikes(reduxElementArray)  
                break
            case 'dislikes':
                reduxElementArray = this.props.dislikes
                this.arraySpliceByElementID(reduxElementArray, elementId)
                this.props.setDislikes(reduxElementArray)  
                break
            case 'siteFavorites':
                reduxElementArray = this.props.siteFavorites
                this.arraySpliceByElementID(reduxElementArray, elementId)
                this.props.setSiteFavorites(reduxElementArray)  
                break
            case 'trailFavorites':
                reduxElementArray = this.props.trailFavorites
                this.arraySpliceByElementID(reduxElementArray, elementId)
                this.props.setTrailFavorites(reduxElementArray)  
                break
            default:
        }
    }


    /**
     * This variable contains a function that hold the logic of user picking "like" or "dislike".
     * The "vote" value is 0 in case of dislike and 1 in case of like.
     * @param {int} vote
     * @param {string} elementId
     */
    voteSite = (e,vote,elementId) => {
        const { uid } = this.props.logStatus
        if(vote){
            if(this.props.likes.includes(elementId)){
                this.deleteElementFromRedux('likes',elementId)
                deleteVote(uid,elementId)
            }
            else{
                if(this.props.dislikes.includes(elementId)){
                    this.deleteElementFromRedux('dislikes',elementId)    
                }
                let updatedLikes = this.props.likes
                updatedLikes.push(elementId)
                this.props.setLikes(updatedLikes)
                updateVote(uid,elementId,vote)
            }
        }else{
            if(this.props.dislikes.includes(elementId)){
                this.deleteElementFromRedux('dislikes',elementId)
                deleteVote(uid,elementId)
            }   
            else{
                if(this.props.likes.includes(elementId)){
                    this.deleteElementFromRedux('likes',elementId)
                }
                let updateDislikes = this.props.dislikes
                updateDislikes.push(elementId)
                this.props.setDislikes(updateDislikes)
                updateVote(uid,elementId,vote)
            }
        }

        this.setState({
            likeFlag: this.colorLike(),
            dislikeFlag: this.colorDislike(),
        })
    }


    /**
     * This function is used to color the like button in case the user already clicked on it for a specific site/trail.
     */
    colorLike = () => {
        const siteId = this.state.site_id
        const voteLikeButtonName = <span className="fas fa-thumbs-up fa-lg" style={likeStyle}/>

        if(this.props.likes.includes(siteId)){
            return <span style={{color:'green'}}>{voteLikeButtonName}</span>
        }
        return voteLikeButtonName
    }


    /**
     * This function is used to color the dislike button in case the user already clicked on it for a specific site/trail.
     */
    colorDislike = () => {
        const siteId = this.state.site_id
        const voteDislikeButtonName = <span className="fas fa-thumbs-down fa-lg" style={dislikeStyle}/>

        if(this.props.dislikes.includes(siteId)){
            return <span style={{color:'red'}}>{voteDislikeButtonName}</span>
        }
        return voteDislikeButtonName
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


    render() {
        const { site_id, imageUrl, navigationLink } = this.state;

        const addToFavoritesIcon = <img style={{width: '30px', height:'30px', maxHeight: '40px', maxWidth: '40px'}} src={favorites_add_icon} alt="Add to favorites"/>
        const deleteInFavoritesIcon = <img style={{width: '30px', height:'30px', maxHeight: '40px', maxWidth: '40px'}} src={favorites_remove_icon} alt="Remove from favorites"/>

        return (
            <div>
                <Card style={{ width: '100%', height: '100%' }}>
                    <div style={{height: '33%'}}>
                        <Card.Img variant="top" src={imageUrl} style={{height: '33%', width: '100%'}} />
                        <div className="card-img-overlay" style={{position: 'absolute', paddingTop:'43%', paddingLeft: '75%', maxHeight:'300px', zIndex: '1'}}>
                            <span style={{borderRadius: '50%', backgroundColor:'rgba(255,255,255,0.8)', height: '70px', width: '70px', display: 'inline-block'}}>
                                <Circle progress={this.state.vote} progressColor="#50c878" size={70} bgColor="#ff0000" lineWidth={30} textColor="#3f704d" textStyle={{font:'bold 6rem Helvetica, Ariel, sens-serif'}}></Circle>
                            </span>
                        </div>
                    </div>
                    <Card.Body>
                        <Card.Title>{this.state.name}</Card.Title>
                        <Card.Subtitle>{this.state.address}</Card.Subtitle>
                    </Card.Body>
                    <Card.Body style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                        <Row>
                            <Col xs={5} style={{alignItems: 'center'}}>
                                <br/>
                                <Card.Link  onClick={() => window.open(navigationLink)} style={{ color: "#1295b1" }}>Navigate to site</Card.Link>
                            </Col>
                            { this.props.logStatus.claims !== "guest" && this.state.vote !== '' ?
                                (<React.Fragment>
                                    <Col xs={3}>
                                        <button variant="outlined" style={buttonVote} onClick={(e) => this.voteSite(e,1,site_id)}>{this.state.likeFlag}</button>
                                        <button variant="outlined" style={buttonVote} onClick={(e) => this.voteSite(e,0,site_id)}>{this.state.dislikeFlag}</button>
                                    </Col>
                                    { this.canRenderAddSite(site_id) ? 
                                        (<Col style={{paddingTop: '3%'}}><button variant="outlined" style= {{marginTop: '0%'}} onClick={(e) => this.addSiteToFavorites(e, site_id)}>{addToFavoritesIcon}</button></Col>)
                                        : this.canRenderDeleteSite(site_id) ? 
                                        (<Col style={{paddingTop: '3%'}}><button variant="outlined" style= {{marginTop: '0%'}} onClick={(e) => this.deleteSiteInFavorites(e, site_id)}>{deleteInFavoritesIcon}</button></Col>)
                                        : ''
                                    }
                                </React.Fragment>) : ''
                            } 
                        </Row>
                    </Card.Body>
                    <Card.Body>
                        <Card.Text>{this.state.fullInfo}</Card.Text>
                    </Card.Body>
                    <Card.Body>
                        <Card.Link href={this.state.externalSourceUrl} style={{ color: "#1295b1" }}>View source</Card.Link>
                    </Card.Body>
                    <Card.Body>
                        <div style={{height: '400px', width: '100%'}} id='map' />
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        logStatus: state.status,
        position: state.position,
        siteFavorites: state.siteFavorites,
        trailFavorites: state.trailFavorites,
        likes: state.likes,
        dislikes: state.dislikes
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        findUserPosition: async () => findUserPosition(dispatch),

        setSiteFavorites: (siteFavorites) => dispatch(setSiteFavorites(siteFavorites)),

        setTrailFavorites: (trailFavorites) => dispatch(setTrailFavorites(trailFavorites)),

        setLikes: (likes) => dispatch(setLikes(likes)),
        
        setDislikes: (dislikes) => dispatch(setDislikes(dislikes)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SitePage);