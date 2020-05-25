import React, { Component } from 'react'
import SiteComponent from '../sites/siteComponent'
import {getSiteByID,createNewRoad, updateRoad}  from '../firebase/FirebaseUtilities'
import { PaginatedList } from 'react-paginated-list';
import SiteSearch from '../search/SiteSearch';
import {Link} from 'react-router-dom'

// const options = [
//     { value: 'tags', label: 'Tags'},
//     { value: 'country', label: 'Country'},
//     { value: 'city', label: 'City'},
//     { value: 'name', label: 'Name'}
// ]

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
  
class RoadForm extends Component {

    constructor(props) {
        super(props);
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
            roadId: formerState && formerState.roadId ? formerState.roadId : null,
            vote: formerState ? formerState.vote : null
        }

        this.updateSearchValue = this.updateSearchValue.bind(this);
        this.updateTopDownhValue = this.updateTopDownhValue.bind(this);
        this.createNewRoadSubmit = this.createNewRoadSubmit.bind(this);
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
        const roadId = this.state.roadId
        const roadDescription = this.state.description;
        const { imageUrl } = this.state;
        const vote = this.state.vote ? this.state.vote : 50;
        const CityList = Array.from(new Set(this.state.siteList.map((site) => site.city)))
        const CountryList = Array.from(new Set(this.state.siteList.map((site) => site.country)))
        var TagList = []
        let temp = Array.from(new Set(this.state.siteList.map((site) => site.tags)))
        temp.forEach((tagsArr) => tagsArr.forEach((tag) => TagList.push(tag)));
        searchTokens = Array.from(new Set([...TagList,...CityList,...CountryList,...roadName.split(" ")]))
        searchTokens = searchTokens.map((i) => {return i.toLowerCase()});
        let siteListID = []
        this.state.siteList.forEach((site) => siteListID.push(site.id));
        
        const road = {siteListID,roadName,roadDescription,CityList,CountryList,TagList,searchTokens, imageUrl, vote};
        if(roadId){
            await updateRoad(road,roadId)
            console.log("update Road")
        }
        else{
            await createNewRoad(road);
            console.log("created new road")    
        }
        alert("Submittion Complete")
        this.props.history.push('/adminRoadPage')
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
                        <label style={LabelStyle} htmlFor="name">  Road Name:</label>
                        <input style={inputStyle} required name="name" type="text" id='name' onChange={this.handleChange} value={this.state.name}/>                        
                    </div>
                    <div className="input-field">
                        <label style={LabelStyle} htmlFor="imageUrl">Image URL:</label>
                        <input style={inputStyle} required name="imageUrl" type="text" id='imageUrl' onChange={this.handleChange} value={this.state.imageUrl}/>
                    </div>
                    <div className="for-group">
                         <label style={LabelStyle}> Road Description :</label>
                        <textarea style={inputStyle} required value={this.state.description} onChange={this.handleChange} type="description" className="form-control" name="description" placeholder="Road Description" />
                    </div>
                    <button style={buttonStyle} type="submit" onClick={(e) =>this.createNewRoadSubmit(e)} className="btn text-white">Submit</button>
                    <button style={buttonStyle} type="button" className="btn text-white"><Link to="/adminRoadPage" className="text-white">Return</Link></button>
                 </form>
                <ul style={{paddingLeft:'0px',paddingRight:'0px',width:'100%'}}>
                    {siteList.length > 3 ? <PaginatedList
                            list={siteList}
                            itemsPerPage={3}
                            renderList={mapping}/> : mapping(siteList)}
                </ul>
                <br></br>
                <SiteSearch
                    getParentState={this.getState}
                    siteButtonsProps= {[{
                        buttonName: `Add to road`,
                        canRender: this.renderButton,
                        buttonFunction: this.addSiteToRoadList
                    }]}
                    searchVal={this.state.searchVal}
                    returnTo='roadForm'/>
            </div>
        );
    }
}

export default RoadForm