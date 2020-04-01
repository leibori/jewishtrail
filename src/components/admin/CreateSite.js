import React, { Component } from 'react'
//import firebase from '../firebase'
import {createNewSite} from '../firebase/FirebaseUtilities'
import { Link } from 'react-router-dom'

class CreateSite extends Component {
  state = {
    tags:[],
    Name: '',
    city: '',
    country: '',
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

  resetForm = () => {
    console.log("jere")
    this.setState({
      tags:[],
      Name: '',
      city: '',
      country: ''  
    })
  }

  async handleSubmit(e,name,city,country,tags){  
    e.preventDefault();
    var site = {
      name: name,
      city: city,
      country: country,
      tags: tags
    }
    await createNewSite(site)
    alert("created a new site");
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
        
          <h5 className="grey-text text-darken-3">Create a New Site</h5>
          <div className="input-field">
            <input type="text" id='name' onChange={this.handleChange} />
            <label htmlFor="name">  Site Name</label>
          </div>
          <div className="input-field">
            <textarea id="city" className="materialize-textarea" onChange={this.handleChange}></textarea>
            <label htmlFor="city">  City Name</label>
          </div>
          <div className="input-field">
            <textarea id="country" className="materialize-textarea" onChange={this.handleChange}></textarea>
            <label htmlFor="country">  Country Name</label>
          </div>

          <label>Tags</label>
          {
            this.state.tags.map((token,index) => {
              return (
                <div key={index}>
                  <input  onChange={(e) => this.handleChangeTokens(e,index)} value={token}  /> 
                  <button onClick={(e) => this.deleteTag(index)}> Delete Tag</button>
                </div>
              )
            })
          }

          <hr/>
          <button id="token" onClick={this.addToken}>Add Tag</button>
          <hr/>
          <div className="input-field">
            <button onClick={(e) =>  this.handleSubmit(e,this.state.name,this.state.city,this.state.country, this.state.tags)} 
            className="btn pink lighten-1"><Link to="/adminPage">Create</Link></button>
            <button><Link to="/adminPage">Return to Admin Menu</Link></button>
          </div>
          
      </div>
    )
  }
}

export default CreateSite