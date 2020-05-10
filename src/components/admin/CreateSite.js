import React, { Component } from 'react'
import {createNewSite} from '../firebase/FirebaseUtilities'
import { Link } from 'react-router-dom'

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

const inputStyle = {
  width:'80%',
  borderRadius:'6px',
  marginBottom:'2%',
}

class CreateSite extends Component {
  constructor(props){
    super(props)
    console.log(props)
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      tags:[],
      Name: '',
      city: '',
      country: '',
      adress: '',
      externalSourceUrl: '',
      imageUrl: '',
      fullInfo: '',
      partialInfo: '',
      latitude: null,
      longitude: null
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleChangeTokens(e,index){
    var tags = this.state.tags
    tags[index] = e.target.value;
    this.setState({
      tags: this.state.tags
    })
  }
  
  addToken = (e) => {
    this.setState({
      tags:[...this.state.tags,""]
    })
  }

  async handleSubmit(e){
    e.preventDefault();
    let searchTokens = Array.from(new Set([...this.state.tags,this.state.city,this.state.country,...this.state.name.split(" "), 'site', 'sites']))
    searchTokens = searchTokens.map((i) => {return i.toLowerCase()});

    var site = {
      name: this.state.name,
      city: this.state.city,
      country: this.state.country,
      tags: this.state.tags,
      adress: this.state.adress,
      externalSourceUrl: this.state.externalSourceUrl,
      imageUrl: this.state.imageUrl,
      fullInfo: this.state.fullInfo,
      partialInfo: this.state.partialInfo,
      latitude: parseFloat(this.state.latitude),
      longitude: parseFloat(this.state.longitude),
      searchTokens: searchTokens,
      vote: 50,
    }
    if (!site.latitude || !site.longitude) {
      alert('error')
      return
    }
    await createNewSite(site)
    alert("created a new site");
    this.props.history.push('/adminSitePage');
  }

  deleteTag = (e,index) =>{
    var tags = [...this.state.tags]
    tags.splice(index,1)
    this.setState({tags: tags});
  }


  render() {
    return (
      <div className="container" style={{position:"absolute", width:"75%",top:'12%'}}>
          <h5 className="white-text" style={{fontWeight:'600', fontFamily:'cambay',}}>Create a New Site</h5>
          <form onSubmit={(e)=> this.handleSubmit(e)} id="create-site-form">
          <div className="input-field">
            <input style={inputStyle} type="text" id='name' onChange={this.handleChange} required/>
            <label style={LabelStyle} htmlFor="name"> Site Name</label>
          </div>
          <div className="input-field">
            <input style={inputStyle} id="city" className="materialize-textarea" onChange={this.handleChange} required></input>
            <label style={LabelStyle} htmlFor="city">City Name</label>
          </div>
          <div className="input-field">
            <input style={inputStyle} id="country" className="materialize-textarea" onChange={this.handleChange} required></input>
            <label style={LabelStyle} htmlFor="country"> Country Name</label>
          </div>
          <div className="input-field">
            <textarea style={inputStyle} id="adress" className="materialize-textarea" onChange={this.handleChange} required></textarea>
            <label style={LabelStyle} htmlFor="adress"> Address</label>
          </div>
          <div className="input-field">
            <textarea style={inputStyle} id="externalSourceUrl" className="materialize-textarea" onChange={this.handleChange} required></textarea>
            <label style={LabelStyle} htmlFor="externalSourceUrl" > External Url Link</label>
          </div>
          <div className="input-field">
            <textarea style={inputStyle} id="imageUrl" className="materialize-textarea" onChange={this.handleChange} required></textarea>
            <label style={LabelStyle} htmlFor="imageUrl"> Image Url Link</label>
          </div>
          <div className="input-field">
            <textarea style={inputStyle} id="fullInfo" className="materialize-textarea" onChange={this.handleChange} required></textarea>
            <label style={LabelStyle} htmlFor="fullInfo"> Enter Description</label>
          </div>
          <div className="input-field">
            <textarea style={inputStyle} id="partialInfo" className="materialize-textarea" onChange={this.handleChange} required></textarea>
            <label style={LabelStyle} htmlFor="partialInfo">Marker Description</label>
          </div>
          <div className="input-field">
            <input style={inputStyle} id="latitude" className="materialize-textarea" onChange={this.handleChange} required></input>
            <label style={LabelStyle} htmlFor="latitude"> Enter latitude</label>
          </div>
          <div className="input-field">
            <input style={inputStyle} id="longitude" className="materialize-textarea" onChange={this.handleChange} required></input>
            <label style={LabelStyle} htmlFor="longitude"> Enter longitude</label>
          </div>
          <label style={LabelStyle}>Tags</label>
          {
            this.state.tags.map((token,index) => {
              return (
                <div key={index}>
                  <input  onChange={(e) => this.handleChangeTokens(e,index)} value={token}  /> 
                  <button type="button" className="white-text" style={{backgroundColor:'#5dbb63',opacity:'0.8'}} onClick={(e) => this.deleteTag(index)}> Delete Tag</button>
                </div>
              )
            })
          }
          <hr/>
          <button type="button" style={{backgroundColor:'#5dbb63',opacity:'0.8',borderRadius:'6px'}} className="white-text" id="token" onClick={this.addToken}>Add Tag</button>
          <hr/>
          <div className="input-field">
          <button type="submit" className="btn white-text" style={buttonStyle}>Create Site</button>
            <button style={buttonStyle} type="button" className="btn"><Link className="white-text" to="/adminSitePage">Return to Admin Menu</Link></button>
          </div>
          </form>
      </div>
    )
  }
}

export default CreateSite