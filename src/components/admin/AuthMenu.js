import React, { Component } from 'react'
import {myFunctions} from '../firebase/firebase'

class AdminMenu extends Component {
  state = {
    action: '',
    email: ""
  }
  
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  deleteUser = (e) => {
      const email = this.state.email
      console.log(email)
      this.setState({email:""})
      const deleteUserByEmails = myFunctions.httpsCallable('deleteUserByEmails');
      deleteUserByEmails({email: email}).then(result => {
        alert(result)    
      })
  }

  createAdmin = (e) => {
    const email = this.state.email
    console.log(email)
    this.setState({email:""})
    const addAdminRole = myFunctions.httpsCallable('addAdminRole');
    addAdminRole({email: email}).then(result => {
        alert(result)    
    })
  }

  activeAction = (e) => {
    this.setState({
      action: e.target.id
      
    })
  }
  
  render() {
    const action = this.state.action;
    if(action === "deleteUser"){
         return(
            <div className="input-field">
            <input id="email" onChange={this.handleChange}placeholder="Email Address" value={this.state.email}></input>
            <button id='deleteUser' onClick={this.deleteUser}>Delete User Via Email</button>
            <button id='' onClick={this.activeAction}>Retrun</button>
            </div>
         )   
    } else if (action === "createAdmin"){
        return (
            <div className="input-field">
            <input id="email" onChange={this.handleChange} placeholder="Email Address" value={this.state.email}></input>
            <button id='deleteUser' onClick={this.createAdmin}>Create Admin Via Email</button>
            <button id='' onClick={this.activeAction}>Retrun</button>
            </div>
        )
    }    
    return (
    <div className="container">
      <h5 className="grey-text text-darken-3">Choose Option:</h5>
      <button id='createAdmin' onClick={this.activeAction}>Add Admin Via Email</button>
      <button id='deleteUser' onClick={this.activeAction}>Delete User</button>
      <p>please choose option</p>
    </div>
    )    
  }
}

export default AdminMenu