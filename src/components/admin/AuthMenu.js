import React, { Component } from 'react'
import {myFunctions} from '../firebase/firebase'
import { Link } from 'react-router-dom'

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
        alert(result.data.message)    
        this.props.history.push("/admin")    
      })
  }

  createAdmin = (e) => {
    const email = this.state.email
    console.log(email)
    this.setState({email:""})
    const addAdminRole = myFunctions.httpsCallable('addAdminRole');
    addAdminRole({email: email}).then(result => {
      console.log(result)
        alert(result.data.message)    
        this.props.history.push("/admin")
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
            <button className="btn pink lighten-1" id='deleteUser' onClick={this.deleteUser}>Delete User Via Email</button>
            <button style={{marginLeft:"50px"}} className="btn pink lighten-1" id='' onClick={this.activeAction}>Retrun</button>
            </div>
         )   
    } else if (action === "createAdmin"){
        return (
            <div className="input-field">
            <input id="email" onChange={this.handleChange} placeholder="Email Address" value={this.state.email}></input>
            <button className="btn pink lighten-1" id='deleteUser' onClick={this.createAdmin}>Create Admin Via Email</button>
            <button style={{marginLeft:"50px"}} className="btn pink lighten-1" id='' onClick={this.activeAction}>Retrun</button>
            </div>
        )
    }    
    return (
    <div className="container">
      <h5 className="black-text text-darken-3">Admin Authorities Options:</h5>
      <button className="btn pink lighten-1" id='createAdmin' onClick={this.activeAction}>Add Admin Via Email</button>
      <button style={{marginLeft:"30px"}} className="btn pink lighten-1" id='deleteUser' onClick={this.activeAction}>Delete User</button>
      <p>please choose option</p>
      <Link className="btn blue lighten-1" to='/admin'>Return to Admin Menu</Link>
    </div>
    )    
  }
}

export default AdminMenu