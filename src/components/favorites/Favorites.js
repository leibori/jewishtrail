import React, { Component } from 'react'
import {getFavorites} from '../firebase/FirebaseUtilities'
import SiteHandle from './siteHandle'
import {myDatabase, myFirebase} from '../firebase/firebase'

class Favorites extends Component {
  state = {
    favoritesArr: [],
    userid: ""
  }
  async componentDidMount(){
    var siteList = []
    myFirebase.auth().onAuthStateChanged(async (user) => {
      siteList = await getFavorites(user.uid);
      this.setState({
        favoritesArr: siteList, userid: user.uid
      });
      // this.setState({claim: await getUserClaims(user)});
    })
  }
  deleteFromFirebase = async(uid) => {
    var userid = this.state.userid;
    var uidList =[]
    this.state.favoritesArr.forEach(site=>{
      if(site.uid !== uid){
        uidList.push(site.uid);
      }
    })

    await myDatabase.collection('accounts').doc(userid).update({
    'favorites': uidList
    })
    .catch(function(error) {
      console.error("Error removing document: ", error);
    });
  }

  deleteSite = (id,uid) =>  {
     let favorites = this.state.favoritesArr.filter(site =>{
      return site.id !== id
    });
    this.setState({
      favoritesArr: favorites
    })
    this.deleteFromFirebase(uid);
  }


  render() {
    //if (this.state.favorites){  
      return (
        <div className="container">
            {this.state.favoritesArr.map((site, i) => (
              <SiteHandle deleteSite ={this.deleteSite} key={i} props={site}/>
            ))}
        </div>
      )
  }
}

export default Favorites