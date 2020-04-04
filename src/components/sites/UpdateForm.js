import React, { Component } from 'react'
//import firebase from '../firebase'
import {UpdateSite} from '../firebase/FirebaseUtilities'
import { Link } from 'react-router-dom'
import {getSiteByID} from '../firebase/FirebaseUtilities'

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

  async handleSubmit(e){  
    e.preventDefault();
    var site = {
      id: this.state.id,
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
      longitude: parseFloat(this.state.longitude)
    }
    
    await UpdateSite(site)
    alert(site.name + " has updated!");
    this.props.history.push('/adminPage')
  }

  deleteTag = (e,index) =>{
    var tags = [...this.state.tags]
    tags.splice(index,1)
    this.setState({tags: tags});
  }


  render() {
    if(!this.state.isLoaded){
      return <span>Loading...</span>
    }
    return (
      <div className="container">
          <h5 className="grey-text text-darken-3">Update a Site</h5>
        <form onSubmit={(e)=> this.handleSubmit(e)} id="create-site-form">
          <div className="input-field">
            <input type="text" id='name' onChange={this.handleChange}  value = {this.state.name} required></input>
            <label htmlFor="name">  Site Name</label>
          </div>
          <div className="input-field">
            <textarea id="city" className="materialize-textarea" onChange={this.handleChange} value = {this.state.city} required></textarea>
            <label htmlFor="city">  City Name</label>
          </div>
          <div className="input-field">
            <textarea id="country" className="materialize-textarea" onChange={this.handleChange} value = {this.state.country} required></textarea>
            <label htmlFor="country">  Country Name</label>
          </div>
          <div className="input-field">
            <textarea id="adress" className="materialize-textarea" onChange={this.handleChange} value = {this.state.adress} required></textarea>
            <label htmlFor="adress">  Adress</label>
          </div>
          <div className="input-field">
            <textarea id="externalSourceUrl" className="materialize-textarea" onChange={this.handleChange} value = {this.state.externalSourceUrl} required></textarea>
            <label htmlFor="externalSourceUrl">  External Source Url</label>
          </div>
          <div className="input-field">
            <textarea id="imageUrl" className="materialize-textarea" onChange={this.handleChange} value = {this.state.imageUrl} required></textarea>
            <label htmlFor="imageUrl">  Image Url Link</label>
          </div>
          <div className="input-field">
            <textarea id="fullInfo" className="materialize-textarea" onChange={this.handleChange} value = {this.state.fullInfo} required></textarea>
            <label htmlFor="fullInfo"> Enter Descpirtion</label>
          </div>
          <div className="input-field">
            <textarea id="partialInfo" className="materialize-textarea" onChange={this.handleChange} value = {this.state.partialInfo} required></textarea>
            <label htmlFor="partialInfo">  Enter marker Descpirtion</label>
          </div>
          <div className="input-field">
            <textarea id="latitude" className="materialize-textarea" onChange={this.handleChange} value = {this.state.latitude} required></textarea>
            <label htmlFor="latitude"> Enter latitude</label>
          </div>
          <div className="input-field">
            <textarea id="longitude" className="materialize-textarea" onChange={this.handleChange} value = {this.state.longitude} required></textarea>
            <label htmlFor="longitude"> Enter longitude</label>
          </div>
          
          <label>Tags</label>
          {
            this.state.tags.map((token,index) => {
              return (
                <div key={index}>
                  <textarea  onChange={(e) => this.handleChangeTokens(e,index)} value={token}  /> 
                  <button type="button" onClick={(e) => this.deleteTag(index)}> Delete Tag</button>
                </div>
              )
            })
          }

          <hr/>
          <button type="button" id="token" onClick={this.addToken}>Add Tag</button>
          <hr/>
          <div className="input-field">
            <button type="submit" className="btn pink lighten-1" color="red">Update Site</button>
            <button  type="button" className="btn pink lighten-1" style={{marginLeft:"30px"}}><Link className="white-text" to="/adminPage">Return to Admin Menu</Link></button>
          </div>
        </form>
      </div>
    )
  }
}

export default UpdateForm