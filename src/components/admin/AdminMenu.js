import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './GeneralAdmin.css';

const buttonStyle = {
  marginLeft:"18%",
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

class AdminMenu extends Component {
  render() {
    return (
      <div className='bg-admin' style={{paddingTop: '55px', width:"100%",top:'12%',height:'100%'}}>
          <p style={LabelStyle}> Welcome to Admin Menu, Please select an Option:</p>
          <div className="container">
            <button className="butonStyle-admin" ><Link className="white-text" to="/adminSitePage">Site Management</Link></button>
            <button className="butonStyle-admin"><Link className="white-text" to="/adminTrailPage">Trail Management</Link></button>
            <button className="butonStyle-admin"><Link className="white-text" to="/auth">Users Management</Link></button>
            <button className="butonStyle-admin"><Link className="white-text" to="/massegeList">MailBox</Link></button>
        </div>
      </div>

    )
  }
}

export default AdminMenu