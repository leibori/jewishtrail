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
      <h5 className="grey-text text-darken-3">Choose Option:</h5>
      <button id='create'><Link to="/createSite">Create new Site</Link></button>
      <button id='delete'><Link to="/deleteSite">Delete Site</Link></button>
      <button id='change'><Link to="/updateSite">Update Site</Link></button> 
    </div>
    )    
  }
}

export default AdminMenu