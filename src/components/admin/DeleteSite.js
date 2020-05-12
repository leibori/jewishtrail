import React, { Component } from 'react'
import {findFromDB} from '../search/SearchUtils'
import {DeleteSiteFromDB} from '../firebase/FirebaseUtilities'
import { Link } from 'react-router-dom'
import SiteSearch from '../search/SiteSearch'

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


class DeleteSite extends Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
        searchVal: props.match.params.searchVal ? props.match.params.searchVal : '',
        topDownValue: 'tags',
        // siteList: []
    }
    this.onSearchButtonClicked = this.onSearchButtonClicked.bind(this);
    this.updateSearchValue = this.updateSearchValue.bind(this);
    this.updateTopDownhValue = this.updateTopDownhValue.bind(this);
};

DeleteSite = async(e, siteID) => {
  const siteList = this.myRef.current.state.siteList;
  e.preventDefault();
  if(!(window.confirm("Are you sure you want to delete this site?"))){
    return
  }
  const index = siteList.findIndex(s=> s.id === siteID );
  await DeleteSiteFromDB(siteList[index]);
  console.log("site" + siteList[index].name + "had deleted")
  
  siteList.splice(index,1)
  this.setState({siteList});
}


async onSearchButtonClicked(e) {
    e.preventDefault();

    const result = await findFromDB(this.state.topDownValue, this.state.searchVal)
    this.setState({siteList: result})
}

updateSearchValue(e) {
  this.setState({searchVal: e.target.value})
}

updateTopDownhValue(e) {
  this.setState({topDownValue: e.value})
}

render() {
    return (
        <div style={{position:"absolute", width:"100%",top:'12%'}}>
            <h5 style={LabelStyle}>Search Site to Delete</h5>
            {/* <form ref={this.form} id="search-form">
                <div className="search-field">
                    <textarea ref={this.searchVal} onChange={this.updateSearchValue} type="text" required />
                </div>
                <Select ref={this.dropList} defaultValue={options[0]} onChange={this.updateTopDownhValue} options = {options} />
                <button onClick={this.onSearchButtonClicked}>Search</button>
                <p className="error pink-text center-align"></p>
            </form> */}
            
            <SiteSearch ref={this.myRef}
              siteList={this.state.siteList}
              siteButtonsProps= {[{
                buttonName: `Delete site`,
                canRender: () => true,
                buttonFunction: this.DeleteSite
            }]}
              searchVal={this.state.searchVal}
              returnTo='deleteSite'/>

            {/* <ul className="container" bind={this.state.siteList}>
                {this.state.siteList.map((site, i) => (
                  <li key = {i}>
                  <SiteComponent props={site}/>
                  <button onClick={(e) => this.DeleteSite(e,i)}>Delete Site</button>
                  </li>
                ))
                }
              </ul>*/}
            <button style={buttonStyle} className="btn"><Link className="white-text" to="/adminSitePage">Return to Admin Menu</Link></button>
        </div>
    )    
  }
}

export default DeleteSite