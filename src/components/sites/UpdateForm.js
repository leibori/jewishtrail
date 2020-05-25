import React, { Component } from 'react'
//import firebase from '../firebase'
import {UpdateSite} from '../firebase/FirebaseUtilities'
import { Link } from 'react-router-dom'
import {getSiteByID} from '../firebase/FirebaseUtilities'
import '../admin/GeneralAdmin.css';

// style options
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
  marginLeft:'5%',
  fontWeight:'400',
  fontFamily: 'Cambay, sans-serif',
  textShadow:'1px 1px black'

}

const inputStyle = {
  width:'80%',
  borderRadius:'6px',
  marginBottom:'2%',
}


class UpdateForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        id: props.match.params.id,
        isLoaded:false
      }
      this.handleSubmit = this.handleSubmit.bind(this);
    };

  async componentDidMount(){
    const id = this.state.id
    // get site data, set state according to result
    let site = await getSiteByID(id);
  
    this.setState({
      ...site,
       id,
       isLoaded:true})
  }  

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }
  handleChangeTokens(e,index){
    var tags  = this.state.tags
    tags[index] = e.target.value;
    this.setState({
      tags: tags
    })
  }
  addToken = (e) => {
    this.setState({
      tags:[...this.state.tags,""]
    })
  }
  // submit form
  async handleSubmit(e){  
    e.preventDefault();
    // get search tokens according to tags, city, name, and country. remove duplicates.
    const searchTokens = Array.from(new Set([...this.state.tags,this.state.city,this.state.country,...this.state.name.split(" "), 'site', 'sites']))
    // cteate site object.
    var site = {
      id: this.state.id,
      name: this.state.name,
      city: this.state.city,
      country: this.state.country,
      tags: this.state.tags,
      address: this.state.address,
      externalSourceUrl: this.state.externalSourceUrl,
      imageUrl: this.state.imageUrl,
      fullInfo: this.state.fullInfo,
      partialInfo: this.state.partialInfo,
      latitude: parseFloat(this.state.latitude),
      longitude: parseFloat(this.state.longitude),
      searchTokens:searchTokens,
      // in case there is no vote to this site, set defult to 50%.
      vote: this.state.vote ? this.state.vote: 50,
    }
    // in case of invalid latitiude and longitiude, alert an error.
    if (isNaN(site.latitude) || isNaN(site.longitude)) {
      alert('invalid latitude or longitude')
      return
    }

    await UpdateSite(site)
    alert(site.name + " has updated!");
    this.props.history.push('/adminSitePage')
  }
  // remove tag from tag list, given tag index. 
  deleteTag = (e,index) =>{
    var tags = [...this.state.tags]
    tags.splice(index,1)
    this.setState({tags: tags});
  }


  render() {
    if(!this.state.isLoaded){
      return <span>Loading...</span>
    }
    // site's Form.
    return (
      <div className="bg-admin" style={{paddingTop: '55px', width:"100%",top:'12%'}}>
          <h5 className="white-text" style={{fontWeight:'600', fontFamily:'cambay',textShadow:'2px 2px black'}}>Update Site</h5>
        <form onSubmit={(e)=> this.handleSubmit(e)} id="create-site-form">
          <div className="input-field">
            <label style={LabelStyle} htmlFor="name">  Site Name</label>
            <input style={inputStyle} type="text" id='name' onChange={this.handleChange}  value = {this.state.name} required></input>
          </div>
          <div className="input-field">
          <label style={LabelStyle} htmlFor="city">  City Name</label>
            <textarea style={inputStyle} id="city" className="materialize-textarea" onChange={this.handleChange} value = {this.state.city} required></textarea>
          </div>
          <div className="input-field">
            <label style={LabelStyle} htmlFor="country">  Country Name</label>
            <textarea style={inputStyle} id="country" className="materialize-textarea" onChange={this.handleChange} value = {this.state.country} required></textarea>
          </div>
          <div className="input-field">
            <label style={LabelStyle} htmlFor="address">  Address</label>
            <textarea style={inputStyle} id="address" className="materialize-textarea" onChange={this.handleChange} value = {this.state.address} required></textarea>
          </div>
          <div className="input-field">
            <label style={LabelStyle} htmlFor="externalSourceUrl">  External Source Url</label>
            <textarea style={inputStyle} id="externalSourceUrl" className="materialize-textarea" onChange={this.handleChange} value = {this.state.externalSourceUrl} required></textarea>
          </div>
          <div className="input-field">
            <label style={LabelStyle} htmlFor="imageUrl">  Image Url Link</label>
            <textarea style={inputStyle} id="imageUrl" className="materialize-textarea" onChange={this.handleChange} value = {this.state.imageUrl} required></textarea>
          </div>
          <div className="input-field">
            <label style={LabelStyle} htmlFor="fullInfo"> Enter Descpirtion</label>
            <textarea style={inputStyle} id="fullInfo" className="materialize-textarea" onChange={this.handleChange} value = {this.state.fullInfo} required></textarea>
          </div>
          <div className="input-field">
            <label style={LabelStyle} htmlFor="partialInfo">  Enter marker Descpirtion</label>
            <textarea style={inputStyle} id="partialInfo" className="materialize-textarea" onChange={this.handleChange} value = {this.state.partialInfo} required></textarea>
          </div>
          <div className="input-field">
            <label style={LabelStyle} htmlFor="latitude"> Enter latitude</label>
            <textarea style={inputStyle} id="latitude" className="materialize-textarea" onChange={this.handleChange} value = {this.state.latitude} required></textarea>
          </div>
          <div className="input-field">
            <label style={LabelStyle} htmlFor="longitude"> Enter longitude</label>
            <textarea style={inputStyle} id="longitude" className="materialize-textarea" onChange={this.handleChange} value = {this.state.longitude} required></textarea>
          </div>
          
          <label style={LabelStyle}> Tags</label>
          <button type="button" style={{marginLeft:'10px',backgroundColor:'#5dbb63',opacity:'0.8',borderRadius:'6px'}} className="white-text" id="token" onClick={this.addToken}>Add Tag</button>
          {/* render each tag of tag list. */}
          {
            this.state.tags.map((token,index) => {
              return (
                <div key={index}>
                  <textarea onChange={(e) => this.handleChangeTokens(e,index)} value={token}  /> 
                  <button style={{backgroundColor:'#5dbb63',opacity:'0.8'}} className="white-text" type="button" onClick={(e) => this.deleteTag(index)}> Delete Tag</button>
                </div>
              )
            })
          }
          <div className="input-field">
            <button style={buttonStyle} className="btn white-text" type="submit">Update Site</button>
            <button style={buttonStyle} type="button" className="btn"><Link className="white-text" to="/adminSitePage">Return to Admin Menu</Link></button>
          </div>
        </form>
      </div>
    )
  }
}

export default UpdateForm