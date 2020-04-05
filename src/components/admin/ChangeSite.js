import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import {findSites} from '../search/SearchUtils'
import SiteComponent from '../sites/siteComponent'
import SearchMenu from '../search/SearchMenu'
// import UpdateForm from '../sites/UpdateForm'
// import {getSiteByID} from '../firebase/FirebaseUtilities'

const options = [
  { value: 'tags', label: 'Tags'},
  { value: 'country', label: 'Country'},
  { value: 'city', label: 'City'},
  { value: 'name', label: 'Name'}
]

class ChangeSite extends Component {

  constructor(props) {
    super(props);

    this.state = {
        searchVal: '',
        topDownValue: 'tags',
        siteList: [],
        chosenSite: null,
        changingFlag: false
    }

    this.onSearchButtonClicked = this.onSearchButtonClicked.bind(this);
    this.updateSearchValue = this.updateSearchValue.bind(this);
    this.updateTopDownhValue = this.updateTopDownhValue.bind(this);
    this.onSiteButtonClick = this.onSiteButtonClick.bind(this);
};

// async UpdateSite(e,index){
//   e.preventDefault();
//   const siteID = this.state.siteList[index].id
//   //let site = await getSiteByID(siteID);
//   //site.id = siteID;
//   //setState({changingFlag: true, chosenSite:site})
//   this.setState({changingFlag: true, chosenSite:siteID})
// }


async onSearchButtonClicked(e) {
    e.preventDefault();
    const result = await findSites(this.state.topDownValue, this.state.searchVal)
    if(!result.length){
      alert("no Result")
    }
    this.setState({siteList: result})
}

updateSearchValue(e) {
  this.setState({searchVal: e.target.value})
}


onSiteButtonClick = (e, id) => {
  this.props.history.push("/updateSite/" +id);
  console.log(`Tirkedu`);
}

updateTopDownhValue(e) {
  this.setState({topDownValue: e.value})
}


render() {
  // if(this.state.changingFlag){
  //   return <UpdateForm props={this.state.chosenSite}/>
  // }
    return (
        <div>
            <h5 className="grey-text text-darken-3">Search Site to Update</h5>
            <SearchMenu onClickMethod={this.onSiteButtonClick} buttonName={`Update site`} canRenderButton={()=>true}/>

            {/* <form ref={this.form} id="search-form">
                <div className="search-field">
                    <textarea ref={this.searchVal} onChange={this.updateSearchValue} type="text" required />
                </div>
                <Select ref={this.dropList} defaultValue={options[0]} onChange={this.updateTopDownhValue} options = {options} />
                <button onClick={this.onSearchButtonClicked}>Search</button>
                <p className="error pink-text center-align"></p>
            </form> */}
            
            {/* <ul className="container" bind={this.state.siteList}>
                {this.state.siteList.map((site, i) => (
                  <li key = {i}>
                  <SiteComponent props={site}/>
                  <button><Link to={'/updateSite/'+site.id}>update Site</Link></button>
                  </li>
                ))
                }
            </ul> */}
            <button className="btn pink lighten-1" type="button"><Link className="white-text" to="/adminPage">Return to Admin Menu</Link></button>
        </div>
    )    
  }
}

export default ChangeSite