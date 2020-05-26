import React, { Component } from 'react'
import SiteComponent from '../sites/siteComponent'
import {getSiteByID,createNewTrail, updateTrail}  from '../firebase/FirebaseUtilities'
import { PaginatedList } from 'react-paginated-list';
import SiteSearch from '../search/SiteSearch';
import {Link} from 'react-router-dom'

// style options.
const buttonStyle = {
    marginLeft:"3%",
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

const inputStyle = {
    width:'80%',
    borderRadius:'6px',
    marginBottom:'2%',
}
 /* in case there is trail exsist, update trail. otherwise, create a new one. */
class TrailForm extends Component {

    constructor(props) {
        super(props);
        // if there is trail state, get it and set state according to given data.
        let formerState;
        if (props.location && props.location.state){
            formerState =  props.location.state
            
        }
        else {
            console.log('Didnt get anything');
        }
        this.state = {
            userid: "",
            claim: "guest",
            searchVal: props.match.params.searchVal ? props.match.params.searchVal : '',
            topDownValue: 'tags',
            siteListResult: [],
            siteList: formerState ? formerState.siteList : [],
            name: formerState ? formerState.name : '',
            description: formerState ? formerState.description : '',
            imageUrl: formerState ? formerState.imageUrl : '',
            trailId: formerState && formerState.trailId ? formerState.trailId : null,
            vote: formerState ? formerState.vote : null
        }

        this.updateSearchValue = this.updateSearchValue.bind(this);
        this.updateTopDownhValue = this.updateTopDownhValue.bind(this);
        this.createNewTrailSubmit = this.createNewTrailSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getState = this.getState.bind(this);
    };
    
    getState = () => this.state;

    updateSearchValue(e) {
      this.setState({searchVal: e.target.value})
    }

    updateTopDownhValue(e) {
      this.setState({topDownValue: e.value})
    }
    // according to site id, render button in case of this site is not in site list.
    renderButton = (sid) => {
        const { siteList } = this.state;
        const site = siteList.find((s)=> s.id === sid );
        return !site;
    }

    // trail creation, creat search tokens from Form's data.
    async createNewTrailSubmit(e){
        e.preventDefault()
        // in case there is no sites that added to trail, alern an error.
        if(!this.state.siteList.length){
            alert("no sites where selected")
            return
        }
        // create search token for tags, citys, countrys and name of all sites that where chosen for this trail.
        let searchTokens = [];
        const trailName = this.state.name;
        const trailId = this.state.trailId
        const trailDescription = this.state.description;
        const { imageUrl } = this.state;
        const vote = this.state.vote ? this.state.vote : 50;
        const CityList = Array.from(new Set(this.state.siteList.map((site) => site.city)))
        const CountryList = Array.from(new Set(this.state.siteList.map((site) => site.country)))
        var TagList = []
        // get all tags of each site in this trail.
        let temp = Array.from(new Set(this.state.siteList.map((site) => site.tags)))
        temp.forEach((tagsArr) => tagsArr.forEach((tag) => TagList.push(tag)));
        searchTokens = Array.from(new Set([...TagList,...CityList,...CountryList,...trailName.split(" ")]))
        searchTokens = searchTokens.map((i) => {return i.toLowerCase()});
        let siteListID = []
        this.state.siteList.forEach((site) => siteListID.push(site.id));
        // create trail object.
        const trail = {siteListID,trailName,trailDescription,CityList,CountryList,TagList,searchTokens, imageUrl, vote};
        // in case there trail ID allready exist, update trail.
        if(trailId){
            await updateTrail(trail,trailId)
            console.log("update trail")
        }
        // otherwise, create new trail.
        else{
            await createNewTrail(trail);
            console.log("created new trail")    
        }
        alert("Submittion Complete")
        this.props.history.push('/adminTrailPage')
    }
    // add site that chosen from SiteSearch component, and add it to chosen site list.
    addSiteToTrailList = async(e, siteID) => {
        // create site object and save it in site list.
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
    // remove site from site list.
    removeSite = (e, siteID)=>{
        const siteList = [...this.state.siteList]
        const index = siteList.findIndex(s => s.id==siteID )
        siteList.splice(index,1);
        this.setState({siteList});
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
      }
    
    render() {
        const { siteList } = this.state;
        // map function that render every site in site list.
        const mapping = (list) => list.map((site, i) => {
            return (
                <div key={i} >
                    <li>
                        <SiteComponent site={site} siteButtonsProps={[{
                            buttonName: `Remove Site`,
                            canRender: ()=>true,
                            buttonFunction: this.removeSite
                        }]}/>
                    </li>
                    {/* <button onClick={() => this.removeSite(i)}>remove Site </button> */}
                </div>)
        });

        return (
            <div className='bg-admin' style={{paddingTop: '55px', width:"100%",top:'12%',height:'100%'}}>
                <form onSubmit={()=>alert(2)}>
                    <div className="input-field">
                        <label style={LabelStyle} htmlFor="name">  Trail Name:</label>
                        <input style={inputStyle} required name="name" type="text" id='name' onChange={this.handleChange} value={this.state.name}/>                        
                    </div>
                    <div className="input-field">
                        <label style={LabelStyle} htmlFor="imageUrl">Image URL:</label>
                        <input style={inputStyle} required name="imageUrl" type="text" id='imageUrl' onChange={this.handleChange} value={this.state.imageUrl}/>
                    </div>
                    <div className="for-group">
                         <label style={LabelStyle}> Trail Description :</label>
                        <textarea style={inputStyle} required value={this.state.description} onChange={this.handleChange} type="description" className="form-control" name="description" placeholder="Trail Description" />
                    </div>
                    <button style={buttonStyle} type="submit" onClick={(e) =>this.createNewTrailSubmit(e)} className="btn text-white">Submit</button>
                    <button style={buttonStyle} type="button" className="btn text-white"><Link to="/adminTrailPage" className="text-white">Return</Link></button>
                 </form>
                 {/* show each site of site list. */}
                <ul style={{paddingLeft:'0px',paddingRight:'0px',width:'100%'}}>
                    {siteList.length > 3 ? <PaginatedList
                            list={siteList}
                            itemsPerPage={3}
                            renderList={mapping}/> : mapping(siteList)}
                </ul>
                <br></br>
                {/* site search component, give button functionality */}
                <SiteSearch
                    getParentState={this.getState}
                    siteButtonsProps= {[{
                        buttonName: `Add to trail`,
                        canRender: this.renderButton,
                        buttonFunction: this.addSiteToTrailList
                    }]}
                    searchVal={this.state.searchVal}
                    returnTo='trailForm'/>
            </div>
        );
    }
}

export default TrailForm