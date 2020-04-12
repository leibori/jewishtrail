import React, { Component } from 'react'
import {myFirebase} from '../firebase/firebase'
import {getUserClaims, updateUserRoadsFavorites, getFavoritesIDs} from '../firebase/FirebaseUtilities'
import RoadSearch from './RoadSearch'


class RoadMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userid: "",
            claim: "guest",
            favoriteList: [],
            searchVal: props.match.params.searchVal ? props.match.params.searchVal : ''
        }
        console.log(this.state.searchVal)
        this.canRenderButton = this.canRenderButton.bind(this);
        this.addRoadsToFavorites = this.addRoadsToFavorites.bind(this);
    }

    canRenderButton = (sid) => {
        if(this.state.claim !== "guest") {
            console.log(`user is not a guest`);
            if(!this.state.favoriteList.includes(sid)) {
                return true
            }
        }
        return false
    }

    addRoadsToFavorites = async(e, sid) => {
        var favorites = this.state.favoriteList
        favorites.push(sid)
        updateUserRoadsFavorites(this.state.userid, favorites)
        
        this.setState({favoriteList: favorites})
    }

    async componentDidMount(){
        myFirebase.auth().onAuthStateChanged(async (user) => {
            if(user) {
                var siteList = await getFavoritesIDs(user.uid)
                this.setState({userid: user.uid, claim: await getUserClaims(user), favoriteList: siteList});
            }
            //get favorites from user and save to this.state.favoriteList
       })
    }
    render() {
      
        return (
            <RoadSearch
                onClickMethod={this.addRoadsToFavorites}
                buttonName={`Add to favorites`}
                canRenderButton={this.canRenderButton}
                searchVal={this.state.searchVal}
                returnTo='searchRoad'/>
        );
    }
}

export default RoadMenu