 import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminLinks = () => {
  return (
    
    <div>
      <ul className="container">
        <li><NavLink to='/admin'>Admin Page</NavLink></li>
      </ul>
    </div>
  )
}

export default AdminLinks