import React, { Component } from 'react'
//import firebase from '../firebase'
import {UpdateSite} from '../firebase/FirebaseUtilities'
import { Link } from 'react-router-dom'

class UpdateForm extends Component {
    constructor(props) {
      super(props);
        this.state = {
            id: props.props.id,
            name: props.props.name,
            city: props.props.city,
            country: props.props.country,
            tags: props.props.tags
          }
    };

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

  async handleSubmit(e,name,city,country,tags,id){  
    e.preventDefault();
    var site = {
      id: id,
      name: name,
      city: city,
      country: country,
      tags: tags
    }
    console.log(site)
    await UpdateSite(site)
    alert(site.name + " has updated!");
  }

  deleteTag = (e,index) =>{
    console.log("here")
    var tags = [...this.state.tags]
    tags.splice(index,1)
    this.setState({tags: tags});
  }


  render() {
    return (
      <div className="container">
        
          <h5 className="grey-text text-darken-3">Update a Site</h5>
          <div className="input-field">
            <textarea type="text" id='name' onChange={this.handleChange}  value = {this.state.name}></textarea>
            <label htmlFor="name">  Site Name</label>
          </div>
          <div className="input-field">
            <textarea id="city" className="materialize-textarea" onChange={this.handleChange} value = {this.state.city}></textarea>
            <label htmlFor="city">  City Name</label>
          </div>
          <div className="input-field">
            <textarea id="country" className="materialize-textarea" onChange={this.handleChange} value = {this.state.country}></textarea>
            <label htmlFor="country">  Country Name</label>
          </div>

          <label>Tags</label>
          {
            this.state.tags.map((token,index) => {
              return (
                <div key={index}>
                  <textarea  onChange={(e) => this.handleChangeTokens(e,index)} value={token}  /> 
                  <button onClick={(e) => this.deleteTag(index)}> Delete Tag</button>
                </div>
              )
            })
          }

          <hr/>
          <button id="token" onClick={this.addToken}>Add Tag</button>
          <hr/>
          <div className="input-field">
            <button onClick={(e) =>  this.handleSubmit(e,this.state.name,this.state.city,this.state.country, this.state.tags,this.state.id)} 
            className="btn pink lighten-1" color="red"><Link to="/adminPage">Update Site</Link></button>
          </div>
          
      </div>
    )
  }
}

export default UpdateForm