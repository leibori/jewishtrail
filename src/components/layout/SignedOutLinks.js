import React from 'react'
import { NavLink } from 'react-router-dom'
import { Navbar } from 'react-bootstrap';
import { Container} from 'react-bootstrap';

const SignedOutLinks = () => {
  return (
    <div>
      <Navbar expand="lg" variant="dark" bg="dark" size="lg">
          <NavLink to='/LoginPage'>Log In</NavLink>
          <NavLink to='/about'>About</NavLink>
          <NavLink to='/search'>Search</NavLink>
      </Navbar>
    </div>
  )
}

export default SignedOutLinks