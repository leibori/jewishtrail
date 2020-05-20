import React, { Component } from 'react'
import {getFavorites, updateUserFavoriteSites, updateUserFavoriteRoads } from '../firebase/FirebaseUtilities'
import SiteFavComponents from './siteFavComponents'
import RoadFavComponent from './roadFavComponent'
import SelectStyle from './selectStyle'
import { PaginatedList } from 'react-paginated-list'
import ReactLoading from "react-loading";
import "bootstrap/dist/css/bootstrap.css";
import {getFavoritesIDs,getRoadFavoritesIDs} from '../firebase/FirebaseUtilities'
import { setSiteFavorites, setTrailFavorites, setLikes, setDislikes } from '../../actions/index'
import InnerBgImg from "../../assets/img/signs.jpg";
import { connect } from 'react-redux'
import {updateVote,getVoteByUserID,deleteVote} from '../firebase/FirebaseVotingUtils'
import "./fav.css"
import {findUserPosition} from '../map/MapUtilities'

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
class Favorites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favoritesArr: [],
      siteCount: 0,
      roadCount: 0,
      userid: "",
      siteFilter: true,
      roadFilter: true,
      done: false,
      empty: false,
      searchField: '',
      categorySearch: '',
    }
  }

  async componentDidMount(){
    const uid = this.props.uid
    let likes = this.props.likes
    let dislikes = this.props.dislikes
    let allVotes = []
    // let lat = this.props.position.lat
    // let lng = this.props.position.lng
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
    var siteList = await getFavorites(siteFavorites,trailFavorites)
    if(siteList.length === 0){
      this.setState({empty: true})
    }
    this.setState({done: true})
    this.setState({
      favoritesArr: siteList
    });
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
      const { claims } = this.props.logStatus
      if(claims !== "guest") {
          return true
      }
      return false
  }
  colorLike = (siteId,buttonName) => {
      if(this.props.likes.includes(siteId)){
          return <span style={{color:'green'}}>{buttonName}</span>
      }
      return buttonName
  }

  colorDislike = (siteId,buttonName) => {
      if(this.props.dislikes.includes(siteId)){
          return <span style={{color:'red'}}>{buttonName}</span>
      }
      return buttonName
  }
  /**
     * This function executes when the user clicks on the site filter button, and it sets boolean values in order to filter the results.
     */
  siteFilterClicked = () => {
    if (!this.state.roadFilter) {
        this.setState({roadFilter: true})
    } else {
        this.setState({siteFilter: true, roadFilter: false})
    }
  }


  /**
   * This function executes when the user clicks on the road filter button, and it sets boolean values in order to filter the results.
   */
  roadFilterClicked = () => {
      if (!this.state.siteFilter) {
          this.setState({siteFilter: true})
      } else {
          this.setState({siteFilter: false, roadFilter: true}) 
      }
  }  

  async deleteFromFirebase(type,uid){
    const userid = this.props.uid
    var uidList =[]
    this.state.favoritesArr.forEach(site=>{
      if(site.uid !== uid && site.type == "sites" && type == "sites"){
        uidList.push(site.uid);
      }
      if(site.uid !== uid && site.type == "roads" && type == "roads"){
        uidList.push(site.uid);
      }
    })
    if(type == 'sites'){
      this.props.setSiteFavorites(uidList)
      updateUserFavoriteSites(userid, uidList)
    }
    else{
      this.props.setTrailFavorites(uidList)
      updateUserFavoriteRoads(userid, uidList)
    }
  }
  categorySearch = (typeSearch) => {
    this.setState({
      categorySearch: typeSearch
    })    
  }
  sortBy = (typeSort) => {
    console.log(typeSort)
    let sortedArray = []
    if(typeSort == 'Distances'){
        const lat = this.props.latitude
        const long = this.props.longitude
        sortedArray = this.state.favoritesArr.sort(function(a, b) {
        var radlat1 = Math.PI * a.latitude/180;
        var radlat2 = Math.PI * lat/180;
        var theta = a.longitude-long;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
          dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;

        var radlat3 = Math.PI * b.latitude/180;
        var radlat4 = Math.PI * lat/180;
        var theta = b.longitude-long;
        var radtheta2 = Math.PI * theta/180;
        var dist2 = Math.sin(radlat3) * Math.sin(radlat4) + Math.cos(radlat3) * Math.cos(radlat4) * Math.cos(radtheta2);
        if (dist2 > 1) {
          dist2 = 1;
        }
        dist2 = Math.acos(dist2);
        dist2 = dist2 * 180/Math.PI;
        dist2 = dist2 * 60 * 1.1515;
        if(dist > dist2){
          return 1;
        }
        else{
          return -1;
        }
      });
      this.setState({
        favoritesArr: sortedArray
      })
    }
    else if(typeSort == 'Rates'){
      sortedArray = this.state.favoritesArr.sort((a, b) => parseFloat(b.vote) - parseFloat(a.vote))
      this.setState({
        favoritesArr: sortedArray
      })
    }
    //this.state.favoritesArr.sort((a, b) => parseFloat(a.vote) - parseFloat(b.vote));
  }

  /**
  * This function is used to filter (by site or by road) the results based on boolean values.
  */
  resultsFilter = (result) => {
      return (this.state.siteFilter && result.type == 'sites') ||
          (this.state.roadFilter && result.type == 'roads')
  }
  checkCondition() {
    if(this.state.favoritesArr.filter(this.resultsFilter).length === 0 && this.state.done){
      return true;
    }
    return false;
  }
  deleteSite = (id,uid,type) =>  {
     let favorites = this.state.favoritesArr.filter(site =>{
      return site.id !== id
    });
    this.setState({
      favoritesArr: favorites
    })
    if(favorites.length === 0){
      this.setState({
        done: true,
        empty: true
      })
    }
    this.deleteFromFirebase(type,uid);
  }
  
  render() {
    const buttonName2 = <img style={{width: '40px', height:'40px', maxHeight: '40px', maxWidth: '40px'}} src="http://icons.iconarchive.com/icons/dryicons/aesthetica-2/64/favorite-remove-icon.png"/>
    const voteLikeButtonName = <span className="fas fa-thumbs-up fa-2x" style={likeStyle}/>
    const voteDislikeButtonName = <span className="fas fa-thumbs-down fa-2x" style={dislikeStyle}/>
    const siteButtonsProps = [{buttonFunction: this.deleteSite, buttonName: buttonName2}, 
          {buttonFunction: this.deleteSiteInFavorites, buttonName: buttonName2}];
    const voteButtonsProps = [{buttonFunction: this.voteSite, buttonName:voteLikeButtonName,colorLike:this.colorLike,canRender:this.canRenderVoteID},
                            {buttonFunction: this.voteSite, buttonName:voteDislikeButtonName,colorDislike:this.colorDislike,canRender:this.canRenderVoteID}]
    const roadButtonsProps = [{buttonFunction: this.addRoadToFavorites, buttonName: buttonName2},
          {buttonFunction: this.deleteRoadInFavorites, buttonName: buttonName2}];
    // Predicate that decides the color of the button of the site filter.
    const siteColorPredicate = !this.state.roadFilter ? 'rgba(230,223,0,1)' : 'rgba(255,255,255,1)'

    // Predicate that decides the color of the button of the road filter.
    const roadColorPredicate = !this.state.siteFilter ? 'rgba(230,223,0,1)' : 'rgba(255,255,255,1)'

    const mapping = (list) => list.map((site, i) => {
      return  (
                  <div tyle={{width: '100%'}} key={i}>
                  {site.type === 'sites' && this.state.siteFilter ?
                      (<div>  
                          <SiteFavComponents {...{siteButtonsProps,voteButtonsProps}} site={site} />
                      </div>)
                      : site.type === 'roads' && this.state.roadFilter ?
                      (<div style={{width: '100%'}}>  
                          <RoadFavComponent {...{siteButtonsProps,voteButtonsProps}} road={site}/>
                      </div>) : ''
                  }
                  </div>

              );
    });
    let filteredFav = []
    if(this.state.searchField.length > 0){
      if(this.state.categorySearch == 'Name'){
        filteredFav = this.state.favoritesArr.filter(fav=>fav.name.toLowerCase().includes(this.state.searchField.toLowerCase()))
      }
      if(this.state.categorySearch == 'Country'){
        filteredFav = this.state.favoritesArr.filter(fav=>Array.isArray(fav.country) ?
        fav.country[0].toLowerCase().includes(this.state.searchField.toLowerCase()) :
        fav.country.toLowerCase().includes(this.state.searchField.toLowerCase()))
      }
      if(this.state.categorySearch == 'City'){
        filteredFav = this.state.favoritesArr.filter(fav=>Array.isArray(fav.city) ? 
        fav.city.some(value => value.toLowerCase().includes(this.state.searchField.toLowerCase())) :
        fav.city.toLowerCase().includes(this.state.searchField.toLowerCase())) 
      }
    }
    return (
      <div style ={{height: '20%', width: '100%'}}>
        {this.state.favoritesArr.length === 0 && <div style={{top: '50%', left:'50%',position:'fixed',transform: 'translate(-50%, -50%)'}}>
        {!this.state.empty ? (
           <ReactLoading type={"bars"} color={"black"} />
        ) : (<div style={{ height: '100%', paddingTop: '30%' }}>
          <span className='message' style={{ paddingLeft: '31%' }}>Looks like nothing is</span><br/>
          <span className='message' style={{ paddingLeft: '28%' }}>going around here yet...</span>
          <img src="/image/binoculars.png"/>
          </div>
        )}
        </div>}
        {this.state.favoritesArr.length > 0 &&
        <div className="fixed">
            <form onSubmit={this.onSearchButtonClicked} style={{paddingBottom: '0%', marginTop: '0%', width: '100%'}}>
              <div className='favoritesField' style={{width:'75%'}}>
                  <span><i className="fas fa-search" style={{marginLeft: '12px'}}></i></span>
                  <input style={{marginTop:'0px'}}
                  placeholder='Choose your search category...' 
                  type="search"
                  onChange={e => this.setState({searchField: e.target.value})}
                  />
                  <button
                    type="submit"
                    style={{backgroundColor: 'rgba(255,255,255,0.4)', border: '1px solid black', borderRadius: '4px', display: 'none'}}>Search</button>
                  <p className="error pink-text center-align"></p>
                </div>
                <div className='search-options'>
                <SelectStyle passFunction={this.categorySearch} type ={"search"}/>
                </div>
            </form>
          <button
              onClick={this.siteFilterClicked}
              style={{backgroundColor: siteColorPredicate,borderRadius: '4px', padding: '5px',margin:'6px 0px 0px 22px'}}>Only Sites</button>
          <button
              onClick={this.roadFilterClicked}
              style={{backgroundColor: roadColorPredicate,borderRadius: '4px', padding: '5px',margin:'6px 0px 0px 10px'}}>Only Trails</button>
          <div className='sort-by'>
          <SelectStyle passFunction={this.sortBy} type ={"sort"}/>
          </div>
        </div>}
        <div className="FavoritesResult" style={{zIndex:'0'}}>
                    {this.state.searchField.length > 0 ? filteredFav.length > 0 ? mapping(filteredFav) : 
                    <div style ={{ height: '100%', paddingTop: '30%' }}>
                    <span className='message' style={{ paddingLeft: '31%' }}>Looks like nothing is</span><br/>
                    <span className='message' style={{ paddingLeft: '28%' }}>going around here yet...</span>
                    <img src="/image/binoculars.png" style={{ maxHeight: '33%', maxWidth: '33%', paddingTop: '25px' }}/>
                    </div>
                    : 
                    this.checkCondition() && this.state.searchField.length == 0 ? 
                    <div style={{top: '50%', left:'50%',position:'fixed',transform: 'translate(-50%, -50%)'}}>
                      <img src="/image/binoculars.png"/>
                      </div> :
                    this.state.favoritesArr.filter(this.resultsFilter).length > 20 ? 
                     <PaginatedList
                        list={this.state.favoritesArr.filter(this.resultsFilter)}
                        itemsPerPage={20}
                        renderList={mapping}/>: this.state.favoritesArr.map((site,i)=>{
                          return  (
                            <div key={i} style={{paddingBottom:'0px'}}>
                            {site.type === 'sites' && this.state.siteFilter ?
                                (<div>  
                                    <SiteFavComponents {...{siteButtonsProps,voteButtonsProps}} site={site} />
                                </div>)
                                : site.type === 'roads' && this.state.roadFilter ?
                                (<div>  
                                    <RoadFavComponent {...{siteButtonsProps,voteButtonsProps}} road={site}/>
                                </div>) : ' '
                            }
                            </div>
                        );
                        })}
        </div>
      </div>
      )
  }
}

const mapStateToProps = (state) => {
  return {
      uid: state.status.uid,
      logStatus: state.status,
      claims: state.status.claims,
      siteFavorites: state.siteFavorites,
      trailFavorites: state.trailFavorites,
      likes: state.likes,
      dislikes: state.dislikes,
      latitude: state.position.lat,
      longitude: state.position.lng
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
    },
    findUserPosition: ()=>{
      findUserPosition(dispatch)
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);