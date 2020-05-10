import React, { Component } from 'react'
import {getFavorites, updateUserFavoriteSites, updateUserFavoriteRoads } from '../firebase/FirebaseUtilities'
import SiteFavComponents from './siteFavComponents'
import RoadFavComponent from './roadFavComponent'
import { PaginatedList } from 'react-paginated-list'
import ReactLoading from "react-loading";
import "bootstrap/dist/css/bootstrap.css";
import {getFavoritesIDs,getRoadFavoritesIDs} from '../firebase/FirebaseUtilities'
import { setSiteFavorites, setTrailFavorites, setLikes, setDislikes } from '../../actions/index'
import InnerBgImg from "../../assets/img/signs.jpg";
import { connect } from 'react-redux'
import {updateVote,getVoteByUserID,deleteVote} from '../firebase/FirebaseVotingUtils'
import "components/search/GeneralSearch/index.css"

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
const fixedbutton = {
  backgroundImage: "url(" + InnerBgImg +") no-repeat",
  paddingTop: '10px',
  position: 'fixed',
  zIndex: '1',
  marginTop:' 0px',
  paddingBottom: '10px',
  top: '0%',
  width: '100%'
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
    }
  }

  async componentDidMount(){
    const uid = this.props.uid
    let likes = this.props.likes
    let dislikes = this.props.dislikes
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
    const field = {
      position: "relative",
      height: "45px",
      width: "100%",
      marginTop:"20%",
      display: "flex",
      borderRadius: "5px",
      marginBottom: '5%'
    };
    // Predicate that decides the color of the button of the site filter.
    const siteColorPredicate = !this.state.roadFilter ? 'rgba(230,223,0,1)' : 'rgba(255,255,255,1)'

    // Predicate that decides the color of the button of the road filter.
    const roadColorPredicate = !this.state.siteFilter ? 'rgba(230,223,0,1)' : 'rgba(255,255,255,1)'

    const mapping = (list) => list.map((site, i) => {
      // console.log(site);
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
    return (
      <div style ={{height: '100%',width: '100%'}}>
        {this.state.favoritesArr.length === 0 && <div style={{top: '50%', left:'50%',position:'fixed',transform: 'translate(-50%, -50%)'}}>
        {!this.state.empty ? (
           <ReactLoading type={"bars"} color={"white"} />
        ) : (
          <img src="/image/NoMatch.png"/>
        )}
        </div>}
        {this.state.favoritesArr.length > 0 &&
        <div className="fixedButton">
          <button
              onClick={this.siteFilterClicked}
              style={{backgroundColor: siteColorPredicate, marginTop:"5%",borderRadius: '4px', marginLeft: '5%', padding: '6px'}}>Only Sites</button>
          <button
              onClick={this.roadFilterClicked}
              style={{backgroundColor: roadColorPredicate, marginTop:"5%",borderRadius: '4px', marginLeft: '3%', padding: '6px'}}>Only Roads</button>
        </div>}
        <div className="container" style={{ paddingLeft: '0px', paddingRight: '0px',marginTop: '105px'}}>
                    {this.checkCondition() ? 
                    <div style={{top: '50%', left:'50%',position:'fixed',transform: 'translate(-50%, -50%)'}}>
                      <img src="/image/NoMatch.png"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);