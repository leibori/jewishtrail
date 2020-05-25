import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {getTrailByID as getTrailByID} from '../search/SearchUtils'
import {getSiteByID} from '../firebase/FirebaseUtilities'
import TrailSearch from 'components/search/TrailSearch';

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
marginLeft:'20px',
fontWeight:'400',
fontFamily: 'Cambay, sans-serif',
textShadow:'1px 1px black'
}

class UpdateTrail extends Component {

  constructor(props) {
    super(props);

    this.state = {
        searchVal: props.match.params.searchVal ? props.match.params.searchVal : '',
        siteList: [],
        chosenSite: null,
        changingFlag: false
    }

    this.onTrailButtonClick = this.onTrailButtonClick.bind(this);
};


async onTrailButtonClick(e, trailId){
    var all_trail_props = await getTrailByID(trailId)
    const siteListID = all_trail_props.siteList;
    const siteList = await Promise.all(siteListID.map((async (sid) => ({ id:sid, ...(await getSiteByID(sid))}))))
    this.props.history.push({
      pathname: '/trailForm',
      state: {...all_trail_props, siteList, trailId}
    });
}


render() {
    return (
      <div className='bg-admin' style={{paddingTop: '55px', width:"100%",top:'12%',height:'100%'}}>
            <h5 style={LabelStyle}>Search Site to Update</h5>
            <TrailSearch
             trailButtonsProps = {[{
              buttonName: `Update Trail`,
              canRender: () => true,
              buttonFunction: this.onTrailButtonClick
               }]}
              searchVal={this.state.searchVal}
              returnTo='updateTrail'/>

            <button style={buttonStyle}  type="button"><Link className="white-text" to="/adminPage">Return to Admin Menu</Link></button>
        </div>
    )    
  }
}

export default UpdateTrail