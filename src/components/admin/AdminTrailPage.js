import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './GeneralAdmin.css';
// style options
const buttonStyle = {
    marginLeft:"8%",
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
  


/*admin menu. conatain Links to Creation, delete and update Trails */
class AdminTrailPage extends Component {
  render() {
    return (
      <div className='bg-admin' style={{paddingTop: '55px', width:"100%",top:'12%',height:'100%',textAlign:'center'}}>
      <p style={LabelStyle}>Welcome to Road Management, choose an Option:</p>
      <button className="btn" style={buttonStyle} id='create'><Link to="/trailForm" className="white-text">Create new Road</Link></button>
      <br></br>
      <button className="btn" style={buttonStyle} id='delete'><Link className="white-text" to="/deleteTrail">Delete Road</Link></button>
      <br></br>
      <button className="btn" style={buttonStyle} id='change'><Link className="white-text" to="/updateTrail">Update Road</Link></button>
      <br></br>
      <button className="btn" style={buttonStyle} id='change'><Link className="white-text" to="/admin">Return to Admin Main Menu</Link></button>
    </div>
    )    
  }
}

export default AdminTrailPage