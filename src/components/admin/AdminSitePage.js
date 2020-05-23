import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './GeneralAdmin.css';

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
  fontWeight:'800',
  fontFamily: 'Cambay, sans-serif',
  textShadow:'1px 1px black'
}

class AdminSitePage extends Component {
  render() {
    return (
    <div className='bg-admin'>
    <div className="container" style={{position:"absolute",margin:'auto', width:"100%",textAlign:'center',top:'10%',height:'35%'}}>
      <p style={LabelStyle}>Welcome to Site Management. choose an Option:</p>
      <button className="btn" style={buttonStyle} id='create'><Link to="/createSite" className="white-text">Create new Site</Link></button>
      <br></br>
      <button className="btn" style={buttonStyle} id='delete'><Link className="white-text" to="/deleteSite">Delete Site</Link></button>
      <br></br>
      <button className="btn" style={buttonStyle} id='change'><Link className="white-text" to="/updateSite">Update Site</Link></button>
      <br></br>
      <button className="btn" style={buttonStyle} id='change'><Link className="white-text" to="/admin">Return to Admin Main Menu</Link></button>
    </div>
    </div>
    )    
  }
}

export default AdminSitePage