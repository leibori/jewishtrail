import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {findFromDB} from '../search/SearchUtils'
import SiteSearch from '../search/SiteSearch'


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
    const result = await findFromDB(this.state.topDownValue, this.state.searchVal)
    if(!result.length){
      alert("no Result")
    }
    this.setState({siteList: result})
}

updateSearchValue(e) {
  this.setState({searchVal: e.target.value})
}


onSiteButtonClick = (e, id) => {
  this.props.history.push("/updateForm/" +id);
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
            <SiteSearch
              onClickMethod={this.onSiteButtonClick}
              buttonName={`Update site`}
              canRenderButton={()=>true}
              searchVal={this.state.searchVal}
              returnTo='updateSite'/>

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