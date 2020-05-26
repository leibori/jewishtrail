import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {findFromDB} from '../search/SearchUtils'
import SiteSearch from '../search/SiteSearch'
import './GeneralAdmin.css';
// style options.
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

class ChangeSite extends Component {

  constructor(props) {
    super(props);

    this.state = {
        searchVal: props.match.params.searchVal ? props.match.params.searchVal : '',
        siteList: [],
        chosenSite: null,
        changingFlag: false
    }

    this.onSearchButtonClicked = this.onSearchButtonClicked.bind(this);
    this.updateSearchValue = this.updateSearchValue.bind(this);
    this.updateTopDownhValue = this.updateTopDownhValue.bind(this);
    this.onSiteButtonClick = this.onSiteButtonClick.bind(this);
};



async onSearchButtonClicked(e) {
    e.preventDefault();
    const result = await findFromDB(this.state.topDownValue, this.state.searchVal)
    if(!result.length){
      alert("no Result")
    }
    this.setState({siteList: result})
}

updateSearchValue(e) {
  this.setState({searchVal: e.target.value})
}

// in case of clicking update site button, redirect to updateForm page. 
onSiteButtonClick = (e, siteID) => {
  this.props.history.push("/updateForm/" + siteID);
}

updateTopDownhValue(e) {
  this.setState({topDownValue: e.value})
}

/*update site contain Site search component */
render() {
    return (
        <div className='bg-admin' style={{paddingTop: '55px', width:"100%",top:'12%',height:'100%'}}>
            <h5 style={LabelStyle}>Search Site to Update</h5>
            <SiteSearch style={{paddingLeft: '0px', paddingRight: '0px'}}
             siteButtonsProps= {[{
              buttonName: `Update site`,
              canRender: () => true,
              buttonFunction: this.onSiteButtonClick
          }]}
              searchVal={this.state.searchVal}
              returnTo='updateSite'/>
            <button style={buttonStyle} className="btn" type="button"><Link className="white-text" to="/adminSitePage">Return to Admin Menu</Link></button>
        </div>
    )    
  }
}

export default ChangeSite