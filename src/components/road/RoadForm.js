import React, { Component } from 'react'
import Select from 'react-select'
import {findSites} from '../search/SearchUtils'
import SiteComponent from '../sites/siteComponent'
import {getSiteByID,createNewRoad}  from '../firebase/FirebaseUtilities'
import { myDatabase } from '../firebase/firebase'

const options = [
    { value: 'tags', label: 'Tags'},
    { value: 'country', label: 'Country'},
    { value: 'city', label: 'City'},
    { value: 'name', label: 'Name'}
]

class RoadForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userid: "",
            claim: "guest",
            searchVal: '',
            topDownValue: 'tags',
            siteListResult: [],
            siteList:[],
            name:"",
            description:""
        }

        this.onSearchButtonClicked = this.onSearchButtonClicked.bind(this);
        this.updateSearchValue = this.updateSearchValue.bind(this);
        this.updateTopDownhValue = this.updateTopDownhValue.bind(this);
        this.createNewRoadSubmit = this.createNewRoadSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    };

    async onSearchButtonClicked(e) {
        e.preventDefault();

        // console.log(this.state.searchVal)
        // console.log(this.state.topDownValue)

        const result = await findSites(this.state.topDownValue, this.state.searchVal)
        // console.log(result)
        this.setState({siteListResult: result})
    }

    updateSearchValue(e) {
      this.setState({searchVal: e.target.value})
    }

    updateTopDownhValue(e) {
      this.setState({topDownValue: e.value})
    }
    
    renderButton(sid) {
        const site = this.state.siteList.find((s)=> s.siteID === sid );
        return !site;
        
    }
    async createNewRoadSubmit(){
        if(!this.state.siteList.length){
            alert("no sites where selected")
            return
        }

        const roadName = this.state.name;
        const roadDescription = this.state.description;
        let siteListID = []
        this.state.siteList.forEach((site) => siteListID.push(site.id));
        const road = {siteListID,roadName,roadDescription}
        await createNewRoad(road);
        //console.log("created new road")
    }
    async addSiteToRoadList(siteID){
        const siteData = await getSiteByID(siteID)
        const siteObject = {
            id:siteID,
            ...siteData
        }
        var siteList = this.state.siteList
        siteList.push(siteObject)
        this.setState({
            siteList
        })
        // console.log(siteList)
    }
    removeSite(index){
        var siteList = [...this.state.siteList]
        siteList.splice(index,1);
        this.setState({siteList});
        // console.log(index)
        // this.setState({ siteList: this.state.siteList.splice(index, 1)});
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
      }

    render() {

        return (
            
            <div className="col-md">
                <form>
                    <div className="input-field">
                        <input type="text" id='name' onChange={this.handleChange} />
                        <label htmlFor="name">  Road  Name</label>
                        </div>
                    <div className="for-group">
                         <label >Road Description</label>
                        <textarea value={this.description} onChange={this.handleChange} type="description" className="form-control" name="description" placeholder="Road Description" />
                    </div>
                 </form>
                 <button type="submit" onClick={this.createNewRoadSubmit} className="btn pink lighten-1">Submit</button>   
                <ul className="container">
                    {this.state.siteList.map((site, i) => {
                        return (
                            <div key={i} >
                            <li>
                                <SiteComponent props={site}/>
                            </li>
                            <button onClick={() => this.removeSite(i)}>remove Site </button>
                            </div>)

                  })}
                </ul>



                <form ref={this.form} id="search-form">
                    <div className="search-field">
                        <input ref={this.searchVal} onChange={this.updateSearchValue} type="text" required />
                    </div>
                    <Select ref={this.dropList} onChange={this.updateTopDownhValue} options = {options} />
                    <div>
                        <button onClick={this.onSearchButtonClicked}>Search</button>
                    </div>
                    <p className="error pink-text center-align"></p>
                </form>
                
                <div className="container">
                    {this.state.siteListResult.map((site, i) => {
                        if(this.renderButton(site.id)) {
                            return  <div key={i} >
                                        <SiteComponent props={site}/>
                                        <button onClick={() => this.addSiteToRoadList(site.id)}>Add to Road</button>
                                    </div>
                        }
                        return <SiteComponent key={i} props={site}/>
                    //if site-id is not in favoritesList show button to add to favorites
                  })}
                </div>
            </div>
        )    
    }
}

export default RoadForm