import React, { Component } from 'react'
import SiteComponent from '../sites/siteComponent'
import {getSiteByID,createNewRoad}  from '../firebase/FirebaseUtilities'
import { PaginatedList } from 'react-paginated-list';
import SiteSearch from '../search/SiteSearch'

// const options = [
//     { value: 'tags', label: 'Tags'},
//     { value: 'country', label: 'Country'},
//     { value: 'city', label: 'City'},
//     { value: 'name', label: 'Name'}
// ]

class RoadForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userid: "",
            claim: "guest",
            searchVal: props.match.params.searchVal ? props.match.params.searchVal : '',
            topDownValue: 'tags',
            siteListResult: [],
            siteList:[],
            name: '',
            description: '',
        }

        this.updateSearchValue = this.updateSearchValue.bind(this);
        this.updateTopDownhValue = this.updateTopDownhValue.bind(this);
        this.createNewRoadSubmit = this.createNewRoadSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    };


    updateSearchValue(e) {
      this.setState({searchVal: e.target.value})
    }

    updateTopDownhValue(e) {
      this.setState({topDownValue: e.value})
    }
    
    renderButton = (sid) => {
        const { siteList } = this.state;
        const site = siteList.find((s)=> s.id === sid );
        return !site;
    }


    async createNewRoadSubmit(e){
        e.preventDefault()
        if(!this.state.siteList.length){
            alert("no sites where selected")
            return
        }
        let searchTokens = [];
        const roadName = this.state.name;
        const roadDescription = this.state.description;
        const CityList = Array.from(new Set(this.state.siteList.map((site) => site.city)))
        const CountryList = Array.from(new Set(this.state.siteList.map((site) => site.country)))
        var TagList = []
        let temp = Array.from(new Set(this.state.siteList.map((site) => site.tags)))
        temp.forEach((tagsArr) => tagsArr.forEach((tag) => TagList.push(tag)));
        searchTokens = Array.from(new Set([...TagList,...CityList,...CountryList,...roadName.split(" ")]))

        let siteListID = []
        this.state.siteList.forEach((site) => siteListID.push(site.id));
        
        const road = {siteListID,roadName,roadDescription,CityList,CountryList,TagList,searchTokens}
        
        await createNewRoad(road);
        console.log("created new road")
    }
    addSiteToRoadList = async(e, siteID) => {
        const siteData = await getSiteByID(siteID)
        const siteObject = {
            ...siteData,
            id:siteID
            
        }
        var siteList = this.state.siteList
        siteList.push(siteObject)
        this.setState({
            siteList
        });
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
        const { siteList } = this.state;

        const mapping = (list) => list.map((site, i) => {
            return (
                <div key={i} >
                    <li>
                        <SiteComponent props={site}/>
                    </li>
                    <button onClick={() => this.removeSite(i)}>remove Site </button>
                </div>)
        });

        return (
            <div className="col-md">
                <form>
                    <div className="input-field">
                        <input required name="name" type="text" id='name' onChange={this.handleChange} />
                        <label htmlFor="name">  Road  Name</label>
                    </div>
                    <div className="for-group">
                         <label >Road Description</label>
                        <textarea required value={this.description} onChange={this.handleChange} type="description" className="form-control" name="description" placeholder="Road Description" />
                    </div>
                    <button type="submit" onClick={(e) =>this.createNewRoadSubmit(e)} className="btn pink lighten-1">Submit</button>
                 </form>
                <ul className="container">
                    {siteList.length > 0 && <PaginatedList
                            list={siteList}
                            itemsPerPage={3}
                            renderList={mapping}/>}
                    {/* {this.state.siteList.map((site, i) => {
                        return (
                            <div key={i} >
                            <li>
                                <SiteComponent props={site}/>
                            </li>
                            <button onClick={() => this.removeSite(i)}>remove Site </button>
                            </div>)})} */}
                </ul>
                <SiteSearch
                    siteButtonsProps= {[{
                        buttonName: `Add to road`,
                        canRender: this.renderButton,
                        buttonFunction: this.addSiteToRoadList
                    }]}
                    searchVal={this.state.searchVal}
                    returnTo='roadForm'/>
            </div>
        );

    //     return (
            
            



                // <form ref={this.form} id="search-form">
                //     <div className="search-field">
                //         <input ref={this.searchVal} onChange={this.updateSearchValue} type="text" required />
                //     </div>
                //     <Select ref={this.dropList} onChange={this.updateTopDownhValue} options = {options} />
                //     <div>
                //         <button onClick={this.onSearchButtonClicked}>Search</button>
                //     </div>
                //     <p className="error pink-text center-align"></p>
                // </form>
                
                // <div className="container">
                //     {this.state.siteListResult.map((site, i) => {
                //         if(this.renderButton(site.id)) {
                //             return  <div key={i} >
                //                         <SiteComponent props={site}/>
                //                         <button onClick={() => this.addSiteToRoadList(site.id)}>Add to Road</button>
                //                     </div>
                //         }
                //         return <SiteComponent key={i} props={site}/>
                //     //if site-id is not in favoritesList show button to add to favorites
                //   })}
                // </div>
    //         </div>
    //     )    
    }
}

export default RoadForm