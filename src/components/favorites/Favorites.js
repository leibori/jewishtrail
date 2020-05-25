import React, { Component } from 'react'
import {getFavorites, updateUserFavoriteSites, updateUserFavoriteTrails } from '../firebase/FirebaseUtilities'
import SiteFavComponents from './siteFavComponents'
import TrailFavComponent from './trailFavComponent'
import SelectStyle from './selectStyle'
import { PaginatedList } from 'react-paginated-list'
import ReactLoading from "react-loading";
import "bootstrap/dist/css/bootstrap.css";
import {getFavoritesIDs,getTrailFavoritesIDs} from '../firebase/FirebaseUtilities'
import { setSiteFavorites, setTrailFavorites, setLikes, setDislikes } from '../../actions/index'
import { connect } from 'react-redux'
import {getVoteByUserID} from '../firebase/FirebaseVotingUtils'
import "./fav.css"
import {findUserPosition} from '../map/MapUtilities'

let sortOptions = ["Sort by","Distances","Rates"]
let searchOptions = ["Field","Name","Country","City"]
class Favorites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favoritesArr: [],
      userid: "",
      siteFilter: true,
      TrailFilter: true,
      done: false,
      empty: false,
      searchField: '',
      categorySearch: '',
    }
  }
  // extract data when calling th component.
  async componentDidMount(){
    const uid = this.props.uid
    let likes = this.props.likes
    let dislikes = this.props.dislikes
    let allVotes = []
    let siteFavorites = this.props.siteFavorites
    let trailFavorites = this.props.trailFavorites
    // extract data for saving in redux - likes / dislikes
    if(likes.length === 0 && dislikes.length === 0){
      allVotes = await getVoteByUserID(uid)
      likes =  allVotes.filter(x=>x.vote === 1).map(x=>x.siteID)
      dislikes = allVotes.filter(x=>x.vote === 0).map(x=>x.siteID)
      this.props.setLikes(likes)
      this.props.setDislikes(dislikes) 
    }
    // extract data for saving in redux - favorite (site).
    if (siteFavorites.length === 0) {
      siteFavorites = await getFavoritesIDs(uid)
      this.props.setSiteFavorites(siteFavorites)
    }
    // extract data for saving in redux - favorite (trail).
    if (trailFavorites.length === 0) {
      trailFavorites = await getTrailFavoritesIDs(uid)
      this.props.setTrailFavorites(trailFavorites)
    } 
    // extract data for saving in redux - likes / dislikes.
    var siteList = await getFavorites(siteFavorites,trailFavorites)
    if(siteList.length === 0){
      this.setState({empty: true})
    }
    // extract data for saving in redux - poisition.
    if(this.props.country === ""){
      this.props.findUserPosition()
    }
    
    this.setState({done: true})
    this.setState({
      favoritesArr: siteList
    });
  }
  /**
     * This function executes when the user clicks on the site filter button, and it sets boolean values in order to filter the results.
     */
  siteFilterClicked = () => {
    if (!this.state.TrailFilter) {
        this.setState({TrailFilter: true})
    } else {
        this.setState({siteFilter: true, TrailFilter: false})
    }
  }


  /**
   * This function executes when the user clicks on the road filter button, and it sets boolean values in order to filter the results.
   */
  TrailFilterClicked = () => {
      if (!this.state.siteFilter) {
          this.setState({siteFilter: true})
      } else {
          this.setState({siteFilter: false, TrailFilter: true}) 
      }
  }  
  /* update changes in favorites per account in firestore. */
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
      updateUserFavoriteTrails(userid, uidList)
    }
  }
  /* decide on which category of search field u wanna search about it */
  categorySearch = (typeSearch) => {
    this.setState({
      categorySearch: typeSearch
    })    
  }
  /* decide what kind of sort u want to display.. Distance or Rates */
  sortBy = (typeSort) => {
    let sortedArray = []
    // case on checking which sites are cloest to u.
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
    // order sites according users rates.
    else if(typeSort == 'Rates'){
      // iterate over array and making comperation.
      sortedArray = this.state.favoritesArr.sort((a, b) => parseFloat(b.vote) - parseFloat(a.vote))
      this.setState({
        favoritesArr: sortedArray
      })
    }
  }

  /**
  * This function is used to filter (by site or by trail) the results based on boolean values.
  */
  resultsFilter = (result) => {
      return (this.state.siteFilter && result.type == 'sites') ||
          (this.state.TrailFilter && result.type == 'roads')
  }
  /* check if we need to display an error message for the user */
  checkCondition() {
    if(this.state.favoritesArr.filter(this.resultsFilter).length === 0 && this.state.done){
      return true;
    }
    return false;
  }
  /* delete site from favorites array and firebase */
  deleteSite = (id,uid,type) =>  {
     let favorites = this.state.favoritesArr.filter(site =>{
      return site.id !== id
    });
    // set favorites.
    this.setState({
      favoritesArr: favorites
    })
    // case we want to display an error message for empty favorites.
    if(favorites.length === 0){
      this.setState({
        done: true,
        empty: true
      })
    }
    // call function to delete from firebase that Trail / site the user decide to remove.
    this.deleteFromFirebase(type,uid);
  }
  
  render() {
    // button icon for favorite
    const buttonName2 = <img style={{width: '40px', height:'40px', maxHeight: '40px', maxWidth: '40px'}} src="http://icons.iconarchive.com/icons/dryicons/aesthetica-2/64/favorite-remove-icon.png"/>
    // props that include function and icon that we want to pass to site/Trail component.
    const siteButtonsProps = [{buttonFunction: this.deleteSite, buttonName: buttonName2}, 
          {buttonFunction: this.deleteSiteInFavorites, buttonName: buttonName2}];
    // Predicate that decides the color of the button of the site filter.
    const siteColorPredicate = !this.state.TrailFilter ? 'rgba(230,223,0,1)' : 'rgba(255,255,255,1)'

    // Predicate that decides the color of the button of the trail filter.
    const TrailColorPredicate = !this.state.siteFilter ? 'rgba(230,223,0,1)' : 'rgba(255,255,255,1)'
    
    // iterate over favorites array on relevant condition to diaply site / trail component.
    const mapping = (list) => list.map((site, i) => {
      return  (
                  <div style={{width: '100%'}} key={i}>
                  {site.type === 'sites' && this.state.siteFilter ?
                      (<div>  
                          <SiteFavComponents {...{siteButtonsProps}} site={site} />
                      </div>)
                      : site.type === 'roads' && this.state.TrailFilter ?
                      (<div style={{width: '100%'}}>  
                          <TrailFavComponent {...{siteButtonsProps}} Trail={site}/>
                      </div>) : ''
                  }
                  </div>

              );
    });
    // used to decide if the user to search by some parameters.
    let filteredFav = []
    if(this.state.searchField.length > 0){
      // case of name
      if(this.state.categorySearch == 'Name'){
        filteredFav = this.state.favoritesArr.filter(fav=>fav.name.toLowerCase().includes(this.state.searchField.toLowerCase()))
      }
      // case of country.
      if(this.state.categorySearch == 'Country'){
        filteredFav = this.state.favoritesArr.filter(fav=>Array.isArray(fav.country) ?
        fav.country[0].toLowerCase().includes(this.state.searchField.toLowerCase()) :
        fav.country.toLowerCase().includes(this.state.searchField.toLowerCase()))
      }
      // case of city.
      if(this.state.categorySearch == 'City'){
        filteredFav = this.state.favoritesArr.filter(fav=>Array.isArray(fav.city) ? 
        fav.city.some(value => value.toLowerCase().includes(this.state.searchField.toLowerCase())) :
        fav.city.toLowerCase().includes(this.state.searchField.toLowerCase())) 
      }
    }
    return (
      <div className="background-fullsize" style ={{height: '20%', width: '100%'}}>
        {this.state.favoritesArr.length === 0 && <div style={{top: '50%', left:'50%',position:'fixed',transform: 'translate(-50%, -50%)'}}>
        {!this.state.empty ? (
           <ReactLoading type={"bars"} color={"black"} />
        ) : null
        }
        </div>}
        {this.state.favoritesArr.length > 0 &&
        <div className="fixed">
            <form onSubmit={this.onSearchButtonClicked} style={{paddingBottom: '0%', marginTop: '0%', width: '100%'}}>
              <div className='favoritesField'>
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
                <SelectStyle passFunction={this.categorySearch} type ={searchOptions}/>
                </div>
            </form>
          <button
              className="button-leftFav"
              onClick={this.siteFilterClicked}
              style={{backgroundColor: siteColorPredicate}}>Only Sites</button>
          <button
              className="button-rightFav"
              onClick={this.TrailFilterClicked}
              style={{backgroundColor: TrailColorPredicate}}>Only Trails</button>
          <div className='sort-by'>
          <SelectStyle passFunction={this.sortBy} type ={sortOptions}/>
          </div>
        </div>}
        <div className="FavoritesResult" style={{zIndex:'0'}}>
                    {this.state.searchField.length > 0 ? filteredFav.length > 0 ? mapping(filteredFav) : 
                    <div style={{top: '50%', left:'50%',position:'fixed',width:'70%',transform: 'translate(-50%, -50%)'}}>
                    <span className='message' style={{ paddingLeft: '20%' ,fontSize:'16px'}}>Looks like you'r list empty</span><br/>
                      <img src="/image/binoculars.png" style={{ maxHeight: '50%', maxWidth: '50%', paddingTop: '25px' }}/>
                      </div>
                    : 
                    this.checkCondition() && this.state.searchField.length == 0 ? 
                    <div style={{top: '50%', left:'50%',position:'fixed',width:'70%',transform: 'translate(-50%, -50%)'}}>
                    <span className='message' style={{ paddingLeft: '20%' ,fontSize:'16px'}}>Looks like you'r list empty</span><br/>
                      <img src="/image/binoculars.png" style={{ maxHeight: '50%', maxWidth: '50%', paddingTop: '25px' }}/>
                      </div> :
                    this.state.favoritesArr.filter(this.resultsFilter).length > 20 ? 
                     <PaginatedList
                        list={this.state.favoritesArr.filter(this.resultsFilter)}
                        itemsPerPage={20}
                        renderList={mapping}/>: mapping(this.state.favoritesArr)}
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
      longitude: state.position.lng,
      country: state.position.country
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