import React from 'react'
import { NavLink } from 'react-router-dom'

const SignedInLinks = () => {
  return (
    <div>
      <ul className="right">

        <li><NavLink to='/LogOut'>Log Out</NavLink></li>
        <li><NavLink to='/about'>About</NavLink></li>
        <li><NavLink to='/searchSite'>Search Site</NavLink></li>
        <li><NavLink to='/favorites'>Favorites</NavLink></li>
        <li><NavLink to='/' className="btn btn-floating pink lighten-1">NN</NavLink></li>
      </ul>
    </div>
  )
}

export default SignedInLinks