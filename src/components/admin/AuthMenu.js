import React, { Component } from 'react'
import {myFunctions} from '../firebase/firebase'
import { Link } from 'react-router-dom'

const buttonStyle = {
  marginLeft:"30px",
  borderRadius:'8px', 
  padding:"10px 20px",
  backgroundColor:'#5dbb63',
  opacity:'0.8',
  marginTop:'20px',
  
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

class AdminMenu extends Component {
  state = {
    action: '',
    email: ""
  }
  constructor(){
    super()
    this.deleteUser = this.deleteUser.bind(this);
  }
  

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  deleteUser = (e) => {
    const email = this.state.email
    if(!email.length){
      return
    }
    this.setState({email:""})
    const deleteUserByEmails = myFunctions.httpsCallable('deleteUserByEmails');
    deleteUserByEmails({email: email}).then(result => {
      
      alert(result.data.message)    
      this.props.history.push("/auth")    
    })
  }

  createAdmin = (e) => {
    const email = this.state.email
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
            <div style={{position:"absolute", width:"75%",top:'10%',height:'35%'}} className="input-field">
              <form>
                <input  style={inputStyle} id="email" onChange={this.handleChange}placeholder="Email Address" value={this.state.email} required></input><br></br>
                <button type="button" style={buttonStyle} className="btn text-white" id='deleteUser' onClick={(e) => {if(window.confirm("are you sure you want to delete this user?")){ this.deleteUser(e)};}}>Delete User Via Email</button>
                <button type="button" style={{...buttonStyle, padding:'10px 63px'}} className="btn text-white" id='' onClick={this.activeAction}>Retrun</button>
              </form>
            </div>
         )   
    } else if (action === "createAdmin"){
        return (
            <div style={{position:"absolute", width:"75%",top:'10%',height:'35%'}} className="input-field">
              <form>
              <input style={inputStyle} id="email" onChange={this.handleChange} placeholder="Email Address" value={this.state.email} required></input><br></br>
              <button style={buttonStyle} className="btn text-white" id='deleteUser' onClick={this.createAdmin}>Create Admin Via Email</button>
              <button style={{...buttonStyle, padding:'10px 63px'}} className="btn text-white" id='' onClick={this.activeAction}>Retrun</button>
              </form>
            </div>
        )
    }    
    return (
    <div style={{position:"absolute", width:"75%",top:'10%',height:'35%'}} className="container">
      <h5 style={LabelStyle} className="black-tex">Admin Authorities Options:</h5>
      <p style={LabelStyle} >please Choose Option: </p>
      <button style={{...buttonStyle,padding:'10px 35px'}} className="btn text-white" id='createAdmin' onClick={this.activeAction}>Add Admin Via Email</button>
      <button style={{...buttonStyle, padding:'10px 60px'}} className="btn text-white" id='deleteUser' onClick={this.activeAction}>Delete User</button>
      <br></br>
      <Link style={{...buttonStyle,padding:'10px 30px',}} className="btn text-white" to='/admin'>Return to Admin Menu</Link>
    </div>
    )    
  }
}

export default AdminMenu