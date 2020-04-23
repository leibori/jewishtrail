import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {getRoadByID} from '../search/SearchUtils'
import {getSiteByID} from '../firebase/FirebaseUtilities'
import RoadSearch from 'components/search/RoadSearch';


class UpdateRoad extends Component {

  constructor(props) {
    super(props);

    this.state = {
        searchVal: props.match.params.searchVal ? props.match.params.searchVal : '',
        siteList: [],
        chosenSite: null,
        changingFlag: false
    }

    this.onRoadButtonClick = this.onRoadButtonClick.bind(this);
};


async onRoadButtonClick(e, road){
    var all_road_props = await getRoadByID(road.id)
    const siteListID = all_road_props.siteList;
    const siteList = await Promise.all(siteListID.map((async (sid) => ({ id:sid, ...(await getSiteByID(sid))}))))
    const id = road.id
    this.props.history.push({
      pathname: '/roadForm',
      state: {...all_road_props, siteList,id}
    });
}


render() {
    return (
        <div>
            <h5 className="grey-text text-darken-3">Search Site to Update</h5>
            <RoadSearch
             roadButtonsProps = {[{
              buttonName: `Update Road`,
              canRender: () => true,
              buttonFunction: this.onRoadButtonClick
               }]}
              searchVal={this.state.searchVal}
              returnTo='updateRoad'/>

            <button className="btn pink lighten-1" type="button"><Link className="white-text" to="/adminPage">Return to Admin Menu</Link></button>
        </div>
    )    
  }
}

export default UpdateRoad