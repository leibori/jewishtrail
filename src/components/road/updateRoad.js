import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {getRoadByID} from '../search/SearchUtils'
import {getSiteByID} from '../firebase/FirebaseUtilities'
import RoadSearch from 'components/search/RoadSearch';

const buttonStyle = {
  marginLeft:"30px",
  padding:"10px 24px",
  borderRadius:'8px', 
  backgroundColor:'#5dbb63',
  opacity:'0.8',
  marginTop:'20px'
}

const LabelStyle = {
color:'white',
marginLeft:'3%',
fontWeight:'400',
fontFamily: 'Cambay, sans-serif',
textShadow:'1px 1px black'
}

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


async onRoadButtonClick(e, roadId){
    var all_road_props = await getRoadByID(roadId)
    const siteListID = all_road_props.siteList;
    const siteList = await Promise.all(siteListID.map((async (sid) => ({ id:sid, ...(await getSiteByID(sid))}))))
    this.props.history.push({
      pathname: '/roadForm',
      state: {...all_road_props, siteList, roadId}
    });
}


render() {
    return (
        <div  style={{position:"absolute", width:"75%",top:'12%'}}>
            <h5 style={LabelStyle}>Search Site to Update</h5>
            <RoadSearch
             roadButtonsProps = {[{
              buttonName: `Update Road`,
              canRender: () => true,
              buttonFunction: this.onRoadButtonClick
               }]}
              searchVal={this.state.searchVal}
              returnTo='updateRoad'/>

            <button style={buttonStyle}  type="button"><Link className="white-text" to="/adminPage">Return to Admin Menu</Link></button>
        </div>
    )    
  }
}

export default UpdateRoad