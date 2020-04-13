import React from 'react'
import { NavLink } from 'react-router-dom'
import { Navbar } from 'react-bootstrap';
import { Container} from 'react-bootstrap';



const SignedInLinks = () => {
  return (
    <div>
     <Navbar expand="xl" variant="dark" bg="dark" size="xl">
        
          <NavLink to='/LogOut'>Log Out</NavLink>
          <NavLink to='/about'>About</NavLink>
          <NavLink to='/searchSite'>Search Site</NavLink>
          <NavLink to='/favorites'>Favorites</NavLink>
        {/* <li><NavLink to='/' className="btn btn-floating pink lighten-1">NN</NavLink></li> */}
      </Navbar>
          </div>
  )
}

export default SignedInLinks