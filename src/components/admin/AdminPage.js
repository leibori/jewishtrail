import React, { Component } from 'react'
import { Link, Redirect} from 'react-router-dom'


class AdminPage extends Component {
  render() {
    return (
      <div className="container">
          <p> Welcome to Admin Menu, Please select a Option:</p>
          <button className="btn pink lighten-1"><Link className="white-text" to="/adminPage">Site Management</Link></button>
          <button style={{marginLeft:"30px"}} className="btn pink lighten-1"><Link className="white-text" to="/auth">Users Management</Link></button>
      </div>
    )
  }
}

export default AdminPage