import React, { Component } from 'react'
import {getFavorites, updateUserFavoriteSites, updateUserFavoriteRoads } from '../firebase/FirebaseUtilities'
import SiteFavComponents from './siteFavComponents'
import RoadFavComponent from './roadFavComponent'
import { myDatabase } from '../firebase/firebase'
import { PaginatedList } from 'react-paginated-list'
import ReactLoading from "react-loading";
import "bootstrap/dist/css/bootstrap.css";
import { connect } from 'react-redux'

class Favorites extends Component {

  state = {
    favoritesArr: [],
    siteCount: 0,
    roadCount: 0,
    userid: "",
    siteFilter: true,
    roadFilter: true,
    done: false,
    empty: false
  }


  async componentDidMount(){
    const uid = this.props.uid
    var siteList = await getFavorites(uid);
    if(siteList.length === 0){
      this.setState({empty: true})
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
      updateUserFavoriteSites(userid, uidList)
    }
    else{
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
      console.log("true");
      return true;
    }
    console.log("false");
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
    const siteColorPredicate = !this.state.roadFilter ? 'rgba(230,223,0,0.4)' : 'rgba(255,255,255,0.4)'
    // Predicate that decides the color of the button of the road filter.
    const roadColorPredicate = !this.state.siteFilter ? 'rgba(230,223,0,0.4)' : 'rgba(255,255,255,0.4)'
    const mapping = (list) => list.map((site, i) => {
      // console.log(site);
      return  (
                  <div key={i}>
                  {site.type === 'sites' && this.state.siteFilter ?
                      (<div>  
                          <SiteFavComponents deleteSite ={this.deleteSite} key={i} props={site}/>
                      </div>)
                      : site.type === 'roads' && this.state.roadFilter ?
                      (<div>  
                          <RoadFavComponent deleteSite ={this.deleteSite} key={i} props={site}/>
                      </div>) : ''
                  }
                  </div>

              );
  });
    return (
      <div style ={{width: '100%'}}>
        {this.state.favoritesArr.length === 0 && <div style={{top: '50%', left:'50%',position:'fixed',transform: 'translate(-50%, -50%)'}}>
        {!this.state.empty ? (
           <ReactLoading type={"bars"} color={"white"} />
        ) : (
          <img src="/image/NoMatch.png"/>
        )}
        </div>}
        {this.state.favoritesArr.length > 0 && <div style={{marginBottom: '5%'}}>
        <button
            onClick={this.siteFilterClicked}
            style={{backgroundColor: siteColorPredicate, marginTop:"13%",borderRadius: '4px', marginLeft: '5%'}}>Only Sites</button>
        <button
            onClick={this.roadFilterClicked}
            style={{backgroundColor: roadColorPredicate,marginTop:"13%",borderRadius: '4px', marginLeft: '10px' }}>Only Roads</button>
        </div>}
        <div className="container" style={{ paddingLeft: '0px', paddingRight: '0px'}}>
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
                                    <SiteFavComponents deleteSite ={this.deleteSite} key={i} props={site}/>
                                </div>)
                                : site.type === 'roads' && this.state.roadFilter ?
                                (<div>  
                                    <RoadFavComponent deleteSite ={this.deleteSite} key={i} props={site}/>
                                </div>) : ' '
                            }
                            </div>
                        );
                        })}}
        </div>
      </div>
      )
  }
}

const mapStateToProps = (state) => {
  return {
      uid: state.status.uid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);