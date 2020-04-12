import React, { Component } from 'react'
import {createNewSite} from '../firebase/FirebaseUtilities'
import { Link } from 'react-router-dom'

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
    const searchTokens = Array.from(new Set([...this.state.tags,this.state.city,this.state.city,...this.state.name.split(" ")]))
    console.log(searchTokens)
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
    }
    await createNewSite(site)
    alert("created a new site");
    this.props.history.push('/adminPage');
  }

  deleteTag = (e,index) =>{
    var tags = [...this.state.tags]
    tags.splice(index,1)
    this.setState({tags: tags});
  }


  render() {
    return (
      <div className="container">
          <h5 className="grey-text text-darken-3">Create a New Site</h5>
          <form onSubmit={(e)=> this.handleSubmit(e)} id="create-site-form">
          <div className="input-field">
            <input type="text" id='name' onChange={this.handleChange} required/>
            <label htmlFor="name"> Site Name</label>
          </div>
          <div className="input-field">
            <textarea id="city" className="materialize-textarea" onChange={this.handleChange} required></textarea>
            <label htmlFor="city"> City Name</label>
          </div>
          <div className="input-field">
            <textarea id="country" className="materialize-textarea" onChange={this.handleChange} required></textarea>
            <label htmlFor="country"> Country Name</label>
          </div>
          <div className="input-field">
            <textarea id="adress" className="materialize-textarea" onChange={this.handleChange} required></textarea>
            <label htmlFor="adress">  Address</label>
          </div>
          <div className="input-field">
            <textarea id="externalSourceUrl" className="materialize-textarea" onChange={this.handleChange} required></textarea>
            <label htmlFor="externalSourceUrl" > External Url Link</label>
          </div>
          <div className="input-field">
            <textarea id="imageUrl" className="materialize-textarea" onChange={this.handleChange} required></textarea>
            <label htmlFor="imageUrl"> Image Url Link</label>
          </div>
          <div className="input-field">
            <textarea id="fullInfo" className="materialize-textarea" onChange={this.handleChange} required></textarea>
            <label htmlFor="fullInfo"> Enter Description</label>
          </div>
          <div className="input-field">
            <textarea id="partialInfo" className="materialize-textarea" onChange={this.handleChange} required></textarea>
            <label htmlFor="partialInfo"> Enter Marker Description</label>
          </div>
          <div className="input-field">
            <textarea id="latitude" className="materialize-textarea" onChange={this.handleChange} required></textarea>
            <label htmlFor="latitude"> Enter latitude</label>
          </div>
          <div className="input-field">
            <textarea id="longitude" className="materialize-textarea" onChange={this.handleChange} required></textarea>
            <label htmlFor="longitude"> Enter longitude</label>
          </div>
          <label>Tags</label>
          {
            this.state.tags.map((token,index) => {
              return (
                <div key={index}>
                  <input  onChange={(e) => this.handleChangeTokens(e,index)} value={token}  /> 
                  <button type="button" onClick={(e) => this.deleteTag(index)}> Delete Tag</button>
                </div>
              )
            })
          }
          <hr/>
          <button type="button" id="token" onClick={this.addToken}>Add Tag</button>
          <hr/>
          <div className="input-field">
          <button type="submit" className="btn pink lighten-1" color="red">Create Site</button>
            <button style={{marginLeft:"50px"}} type="button" className="btn pink lighten-1"><Link className="white-text" to="/adminPage">Return to Admin Menu</Link></button>
          </div>
          </form>
      </div>
    )
  }
}

export default CreateSite