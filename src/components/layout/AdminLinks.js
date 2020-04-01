 import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminLinks = () => {
  return (
    <div>
      <ul className="right">
        <button><NavLink to='/adminPage'>Admin Page</NavLink></button>
      </ul>
    </div>
  )
}

export default AdminLinks