 import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminLinks = () => {
  return (
    <div>
      <ul className="right">
        <li><NavLink to='/admin'>Admin Page</NavLink></li>
      </ul>
    </div>
  )
}

export default AdminLinks