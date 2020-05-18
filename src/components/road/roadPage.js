import React, { Component } from "react";
import { getRoadByID } from '../search/SearchUtils'
import { getAroundYouMap, findUserPosition } from '../map/MapUtilities'
import { getSiteByID } from "../firebase/FirebaseUtilities";
import { PaginatedList } from 'react-paginated-list';
import SiteComponent from '../sites/siteComponent'
import { Card, ListGroupItem, ListGroup, Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import { setSiteFavorites, setTrailFavorites, setLikes, setDislikes } from '../../actions/index'
import {updateVote, getVoteByUserID, deleteVote} from '../firebase/FirebaseVotingUtils'
import { updateUserFavoriteSites, getRoadFavoritesIDs, updateUserFavoriteRoads, getFavoritesIDs } from '../firebase/FirebaseUtilities'
import Circle from 'react-circle';


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


class RaodPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            trail_id: props.match.params.id,
            roadName: "",
            CityList: [],
            CountryList: [],
            description: "",
            siteList:[],
            vote: 0,
            haveUsersLocation: false,
            imageUrl: '',
            location: {
                lat: 41.294856,
                lng: -4.055685,
            },
            navigationLink: "https://www.google.com/maps/dir/?api=1",
            likeFlag: '',
            dislikeFlag: '',
        }
    };


    async componentWillReceiveProps(nextProps) {

        if (this.props.position != nextProps.position) {
            this.handleNavigationLink(nextProps.position)
        }
    }


    async componentWillMount() {

        await this.handleSiteList()

        if (this.props.position.country == '') {
            await this.props.findUserPosition()
        } else {
            this.handleNavigationLink(this.props.position)
        }

        this.handleMap()

        this.handleVotesAndFavorites()

        this.setState({
            likeFlag: this.colorLike(),
            dislikeFlag: this.colorDislike(),
        })
    }


    async handleSiteList() {
        const roadId = this.state.trail_id;
        var all_road_props = await getRoadByID(roadId)

        const siteListID = all_road_props.siteList;
        const siteList = await Promise.all(siteListID.map((async (sid) => ({ id:sid, ...(await getSiteByID(sid))}))))

        this.setState({
            ...all_road_props,
            siteList
        })
    }

    async handleNavigationLink(position) {

        const { siteList } = this.state;

        var navLink = this.state.navigationLink + "&waypoints="
        const firstSite = siteList[0], lastSite = siteList[siteList.length - 1]
        var firstDistance = Math.sqrt(Math.pow(position.lat - firstSite.latitude, 2) + Math.pow(position.lng - firstSite.longitude, 2))
        var lastDistance = Math.sqrt(Math.pow(position.lat - lastSite.latitude, 2) + Math.pow(position.lng - lastSite.longitude, 2))

        if(firstDistance < lastDistance) {
            navLink += firstSite.latitude + "%2C" + firstSite.longitude
            for(var i = 1; i < siteList.length - 2; ++i) {
                navLink += "%7C" + siteList[i].latitude + "%2C" + siteList[i].longitude
            }
            navLink += "&destination=" + lastSite.latitude + "%2C" + lastSite.longitude
        } else {
            navLink += lastSite.latitude + "%2C" + lastSite.longitude
            for(i = siteList.length - 2; i > 0; --i) {
                navLink += "%7C" + siteList[i].latitude + "%2C" + siteList[i].longitude
            }
            navLink += "&destination=" + firstSite.latitude + "%2C" + firstSite.longitude
        }
        navLink += "&dir_action=navigate"
        // console.log(navLink)
        this.setState({
            navigationLink: navLink
        })
    }


    async handleMap() {
        const { siteList } = this.state;

        const maxLat = Math.max.apply(Math, siteList.map(function(site) { return site.latitude }))
        const minLat = Math.min.apply(Math, siteList.map(function(site) { return site.latitude }))

        const maxLng = Math.max.apply(Math, siteList.map(function(site) { return site.longitude }))
        const minLng = Math.min.apply(Math, siteList.map(function(site) { return site.longitude }))

        const avgLat = (maxLat + minLat) / 2
        const avgLng = (maxLng + minLng) / 2

        const zoom = Math.floor(Math.max(maxLat - minLat, maxLng - minLng))        

        getAroundYouMap('map', avgLat, avgLng, zoom, siteList)
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
        const trailId = this.state.trail_id
        const voteLikeButtonName = <span className="fas fa-thumbs-up fa-lg" style={likeStyle}/>

        if(this.props.likes.includes(trailId)){
            //return true
            return <span style={{color:'green'}}>{voteLikeButtonName}</span>
        }
        return voteLikeButtonName
        //return false
    }


    /**
     * This function is used to color the dislike button in case the user already clicked on it for a specific site/trail.
     */
    colorDislike = () => {
        const trailId = this.state.trail_id
        const voteDislikeButtonName = <span className="fas fa-thumbs-down fa-lg" style={dislikeStyle}/>

        if(this.props.dislikes.includes(trailId)){
            //return true
            return <span style={{color:'red'}}>{voteDislikeButtonName}</span>
        }
        return voteDislikeButtonName
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
     * This function recieves a trail id and adds it to the user's favorite trails list in the database.
     * It also updates the favorites trails that are saved in local storage using redux.
     */
    addRoadToFavorites = async(e, trailId) => {
        const { uid } = this.props.logStatus
        var favorites = this.props.trailFavorites

        favorites.push(trailId)
        
        this.props.setTrailFavorites(favorites)
        updateUserFavoriteRoads(uid, favorites)
        
        alert("The trail was added to your favorites.");
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

        alert("The trail was removed from your favorites.");
        this.setState({})
    }


    render() {
        const { trail_id, siteList, navigationLink, imageUrl } = this.state;

        const addToFavoritesIcon = <img style={{width: '30px', height:'30px', maxHeight: '40px', maxWidth: '40px'}} src="http://icons.iconarchive.com/icons/dryicons/aesthetica-2/64/favorite-add-icon.png"/>
        const deleteInFavoritesIcon = <img style={{width: '30px', height:'30px', maxHeight: '40px', maxWidth: '40px'}} src="http://icons.iconarchive.com/icons/dryicons/aesthetica-2/64/favorite-remove-icon.png"/>

        if(!siteList.length){
            return <span>Loading...</span>
        }

        const mapping = (list) => list.map((site, i) => {
            return (
                <div key={i} >
                    <SiteComponent site={site} siteButtonsProps={[{buttonName: null, canRender: ()=>false, buttonFunction: null}]}/>
                </div>)
        });
        return (
            <div>
                <Card style={{ width: '100%', height: '100%' }}>
                    <div style={{height: '300px'}}>
                        <Card.Img variant="top" src={imageUrl} style={{height: '300px', width: '100%'}} />
                        <div className="card-img-overlay" style={{position: 'absolute', paddingTop:'55%', paddingLeft: '75%', maxHeight:'300px', zIndex: '1'}}>
                            <span style={{borderRadius: '50%', backgroundColor:'rgba(255,255,255,0.8)', height: '80px', width: '80px', display: 'inline-block'}}>
                                <Circle progress={this.state.vote} progressColor="#50c878" size={80} bgColor="#ff0000" lineWidth={30} textColor="#3f704d" textStyle={{font:'bold 6rem Helvetica, Ariel, sens-serif'}}></Circle>
                            </span>
                        </div>
                    </div>
                    <Card.Body>
                        <Card.Title>{this.state.name}</Card.Title>
                        <Card.Text>{this.state.description}</Card.Text>
                        <Row>
                            <Col xs={6} style={{alignItems: 'center'}}>
                                <p></p>
                                <Card.Link  onClick={() => window.open(navigationLink)} style={{ color: "#1295b1" }}>Start the journey</Card.Link>
                            </Col>
                            { this.props.logStatus.claims !== "guest" && this.state.vote !== '' ?
                                (<React.Fragment>
                                    <Col xs={3}>
                                        <button variant="outlined" style={buttonVote} onClick={(e) => this.voteSite(e,1,trail_id)}>{this.state.likeFlag}</button>
                                        <button variant="outlined" style={buttonVote} onClick={(e) => this.voteSite(e,0,trail_id)}>{this.state.dislikeFlag}</button>
                                    </Col>
                                    { this.canRenderAddRoad(trail_id) ? 
                                        (<Col style={{paddingTop: '3%'}}><button variant="outlined" style= {{marginTop: '0%'}} onClick={(e) => this.addRoadToFavorites(e, trail_id)}>{addToFavoritesIcon}</button></Col>)
                                        : this.canRenderDeleteRoad(trail_id) ? 
                                        (<Col style={{paddingTop: '3%'}}><button variant="outlined" style= {{marginTop: '0%'}} onClick={(e) => this.deleteRoadInFavorites(e, trail_id)}>{deleteInFavoritesIcon}</button></Col>)
                                        : ''
                                    }
                                </React.Fragment>) : ''
                            } 
                        </Row>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem className="container">
                            {siteList.length > 30 ? <PaginatedList
                                    list={siteList}
                                    itemsPerPage={30}
                                    renderList={mapping}/>: mapping(siteList)}
                        </ListGroupItem>
                    </ListGroup>
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
        position: state.position,
        logStatus: state.status,
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

export default connect(mapStateToProps, mapDispatchToProps)(RaodPage);