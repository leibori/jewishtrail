import React from 'react'
import { NavLink } from 'react-router-dom'

const SignedOutLinks = () => {
  return (
    <div>
      <ul className="right">
        <li><NavLink to='/LoginPage'>Log In</NavLink></li>
        <li><NavLink to='/about'>About</NavLink></li>
        <li><NavLink to='/searchSite'>Search Site</NavLink></li>
      </ul>
    </div>
  )
}

export default SignedOutLinks