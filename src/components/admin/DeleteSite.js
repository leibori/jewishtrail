import React, { Component } from 'react'
import Select from 'react-select'
import {findSites} from '../search/SearchUtils'
import SiteComponent from '../sites/siteComponent'
import {DeleteSiteFromDB} from '../firebase/FirebaseUtilities'
import { Link } from 'react-router-dom'

const options = [
  { value: 'tags', label: 'Tags'},
  { value: 'country', label: 'Country'},
  { value: 'city', label: 'City'},
  { value: 'name', label: 'Name'}
]

class DeleteSite extends Component {

  constructor(props) {
    super(props);

    this.state = {
        searchVal: '',
        topDownValue: 'tags',
        siteList: []
    }

    this.onSearchButtonClicked = this.onSearchButtonClicked.bind(this);
    this.updateSearchValue = this.updateSearchValue.bind(this);
    this.updateTopDownhValue = this.updateTopDownhValue.bind(this);
};

async DeleteSite(e,index){
  e.preventDefault();
  const site = this.state.siteList[index]
  await DeleteSiteFromDB(site)
  console.log("site" + site.name + "had deleted")
  
  var siteList = [...this.state.siteList]
  siteList.splice(index,1)
  this.setState({siteList: siteList});
}


async onSearchButtonClicked(e) {
    e.preventDefault();

    const result = await findSites(this.state.topDownValue, this.state.searchVal)
    console.log(result)
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
        <div>
            <h5 className="grey-text text-darken-3">Search Site to Delete</h5>
            <form ref={this.form} id="search-form">
                <div className="search-field">
                    <textarea ref={this.searchVal} onChange={this.updateSearchValue} type="text" required />
                </div>
                <Select ref={this.dropList} onChange={this.updateTopDownhValue} options = {options} />
                <button onClick={this.onSearchButtonClicked}>Search</button>
                <p className="error pink-text center-align"></p>
            </form>
            
            <ul className="container" bind={this.state.siteList}>
                {this.state.siteList.map((site, i) => (
                  <li key = {i}>
                  <SiteComponent props={site}/>
                  <button onClick={(e) => this.DeleteSite(e,i)}>Delete Site</button>
                  </li>
                ))
                }
            </ul>
            <button><Link to="/adminPage">Return to Admin Menu</Link></button>
        </div>
    )    
  }
}

export default DeleteSite