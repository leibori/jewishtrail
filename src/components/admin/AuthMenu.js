import React, { Component } from 'react'
import {myFunctions} from '../firebase/firebase'
import { Link } from 'react-router-dom'
import './GeneralAdmin.css';

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

const errorStyle = {
  width:'80',
  marginLeft:'3%',
  padding: '1% 3%',
  borderRadius:'3px',
  backgroundColor:'#FDCAC4',
  color:'#ED6160'

}

class AdminMenu extends Component {
  state = {
    action: '',
    email: "",
    error: '',
  }
  constructor(){
    super()
    this.deleteUser = this.deleteUser.bind(this);
    this.createAdmin = this.createAdmin.bind(this);
  }
  

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  deleteUser = (e) => {
    e.preventDefault()
    const email = this.state.email
    const deleteUserByEmails = myFunctions.httpsCallable('deleteUserByEmails');
    deleteUserByEmails({email: email}).then(result => {
      const error = result.data.error ? result.data.error : null
      const FireBaseErr = result.data.errorInfo && result.data.errorInfo.message ? "Invalid email" : null
      if(error){ this.setState({error})}
      else if(FireBaseErr) { this.setState({error:FireBaseErr})}
      else{
        alert(result.data.message)    
        this.props.history.push("/auth")
      }    
    })
  }

  createAdmin = (e) => {
    e.preventDefault();
    const email = this.state.email        
    const addAdminRole = myFunctions.httpsCallable('addAdminRole');
    addAdminRole({email: email}).then(result => {
      const error = result.data.error ? result.data.error : null
      const FireBaseErr = result.data.errorInfo && result.data.errorInfo.message ? "Invalid Email" : null
      if(error){ this.setState({error})}
      else if(FireBaseErr) { this.setState({error:FireBaseErr})}
      else{
        alert(result.data.message)    
        this.props.history.push("/admin")
      }
    })
  }

  activeAction = (e) => {
    this.setState({
      action: e.target.id,
      error:'',
      email:'',
    })
  }
  
  render() {
    const action = this.state.action;
    const {error} = this.state;
    
    if(action === "deleteUser"){
         return(
          <div className='bg-admin'>
            <div style={{position:"absolute", width:"75%",top:'10%',height:'35%'}} className="input-field">
              <form style={{marginTop:'0px'}} onSubmit={(e) => {if(window.confirm("are you sure you want to delete this user?")){this.deleteUser(e)};}}>
                <input  style={inputStyle} id="email" onChange={this.handleChange} placeholder="Please enter an email" value={this.state.email} required type='email'></input><br></br>
                {error && <span style={errorStyle}>{error} <br/></span>}
                <button className="submit" style={buttonStyle} className="btn text-white" id='deleteUser'>Delete User Via Email</button>
                <button className="button" style={{...buttonStyle, padding:'10px 63px'}} className="btn text-white" id='' onClick={this.activeAction}>Retrun</button>
              </form>
            </div>
            </div>
         )   
    } else if (action === "createAdmin"){
        return (
          <div className='bg-admin'>
            <div style={{position:"absolute", width:"75%",top:'10%',height:'35%'}} className="input-field">
              <form style={{marginTop:'0px'}} onSubmit={(e) => this.createAdmin(e)}>
              <input style={inputStyle} id="email" onChange={this.handleChange} placeholder="pleae enter an email" value={this.state.email} required type='email'></input><br></br>
              {error && <span style={errorStyle}>{error} <br/></span>}
              <button className="submit" style={buttonStyle} className="btn text-white" id='deleteUser'>Create Admin Via Email</button>
              <button className="button" style={{...buttonStyle, padding:'10px 63px'}} className="btn text-white" id='' onClick={this.activeAction}>Retrun</button>
              </form>
            </div>
            </div>
        )
    }    
    return (
    <div className='bg-admin'>
    <div style={{position:"absolute", width:"75%",top:'10%',height:'35%'}} className="container">
      <h5 style={LabelStyle} className="black-tex">Admin Authorities Options:</h5>
      <p style={LabelStyle} >please Choose Option: </p>
      <button style={{...buttonStyle,padding:'10px 35px'}} className="btn text-white" id='createAdmin' onClick={this.activeAction}>Add Admin Via Email</button>
      <button style={{...buttonStyle, padding:'10px 60px'}} className="btn text-white" id='deleteUser' onClick={this.activeAction}>Delete User</button>
      <br></br>
      <Link style={{...buttonStyle,padding:'10px 30px',}} className="btn text-white" to='/admin'>Return to Admin Menu</Link>
    </div>
    </div>
    )    
  }
}

export default AdminMenu