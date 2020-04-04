import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class AdminMenu extends Component {
  state = {
    action: ''
  }
  activeAction = (e) => {
    this.setState({
      action: e.target.id
      
    })
  }
  //<button id='create' onClick={this.activeAction}>Create new Site</button>
  //<button id='delete' onClick={this.activeAction}>Delete Site</button>
  //<button id='change' onClick={this.activeAction}>Change Site</button>

  render() {
    return (
    <div className="container">
      <h5 className="black-text text-darken-3" style={{marginLeft:"-210px"}}>Welcome to Site Management. choose an Option:</h5>
      <button className="btn pink lighten-1" id='create'><Link to="/createSite" className="white-text">Create new Site</Link></button>
      <button className="btn pink lighten-1" style={{marginLeft:"30px"}} id='delete'><Link className="white-text" to="/deleteSite">Delete Site</Link></button>
      <button className="btn pink lighten-1" style={{marginLeft:"30px"}} id='change'><Link className="white-text" to="/updateSite">Update Site</Link></button>
    </div>
    )    
  }
}

export default AdminMenu