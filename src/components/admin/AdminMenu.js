import React, { Component } from 'react'
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

class AdminMenu extends Component {
  render() {
    return (
      <div className="container" style={{position:"absolute",margin:'auto', width:"75%",textAlign:'center',top:'10%',height:'35%'}}>
          <p style={LabelStyle}> Welcome to Admin Menu, Please select a Option:</p>
          <div className="container">
            <button style={buttonStyle} className="btn"><Link className="white-text" to="/adminSitePage">Site Management</Link></button>
            <button style={buttonStyle} className="btn"><Link className="white-text" to="/adminRoadPage">Road Management</Link></button>
            <button style={buttonStyle} className="btn"><Link className="white-text" to="/auth">Users Management</Link></button>
        </div>
      </div>
    )
  }
}

export default AdminMenu