import React, { Component } from 'react';
import {myFirebase} from '../firebase/firebase';
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'
import {getUserClaims} from '../firebase/FirebaseUtilities'
import AdminLinks from './AdminLinks';
import * as ReactBootStrap from "react-bootstrap";
import {
    BrowserRouter as Router,
    Link,
    NavLink
  } from "react-router-dom";

class Navbar extends Component {
  state=({
    isLoggedIn: false,
    isAdmin:false
  }) 
  
  async componentDidMount(){
    myFirebase.auth().onAuthStateChanged(async (user) => {
      var claim = await getUserClaims(user);
      if(claim === "admin"){
        this.setState({isAdmin: true,
                      isLoggedIn: true}
      )}
      else if(user){
        this.setState({isLoggedIn: true, isAdmin: false})
      }else{
        this.setState({isLoggedIn: false,
                      isAdmin: false
        })
      }      
   })
  }

  render() {
    
    if(this.state.isLoggedIn){
      return (
        <nav className="nav-wrapper dark">
            <div className="App" >
          {/* <Link to='/menu' className="brand-logo">Jewish Trail</Link> */}
            <ReactBootStrap.Navbar collapseOnSelect expand="xl" bg="dark" variant="dark">
          <ReactBootStrap.Navbar.Brand href="/Menu">Jewish Trail</ReactBootStrap.Navbar.Brand>
          <ReactBootStrap.Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <ReactBootStrap.Navbar.Collapse id="responsive-navbar-nav"> 
            <ReactBootStrap.Nav className="mr-auto">
            
              <ReactBootStrap.Nav.Link href="/LogOut">Log Out</ReactBootStrap.Nav.Link>
              <ReactBootStrap.Nav.Link href="/about">About</ReactBootStrap.Nav.Link>
              <ReactBootStrap.Nav.Link href="/search">Search</ReactBootStrap.Nav.Link>
              <ReactBootStrap.Nav.Link href="/favorites">Favorites</ReactBootStrap.Nav.Link>
                {
                  this.state.isAdmin && (<ReactBootStrap.Nav.Link href="/admin">Admin Page</ReactBootStrap.Nav.Link>)
                }          
            </ReactBootStrap.Nav>
        </ReactBootStrap.Navbar.Collapse>    
      </ReactBootStrap.Navbar>
      </div>
      </nav>

      )
    }
    return (

      <nav className="nav-wrapper dark">
      <div className="App" >
    {/* <Link to='/menu' className="brand-logo">Jewish Trail</Link> */}
      <ReactBootStrap.Navbar collapseOnSelect expand="xl" bg="dark" variant="dark">
    <ReactBootStrap.Navbar.Brand href="/Menu">Jewish Trail</ReactBootStrap.Navbar.Brand>
    <ReactBootStrap.Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <ReactBootStrap.Navbar.Collapse id="responsive-navbar-nav"> 
      <ReactBootStrap.Nav className="mr-auto">
      
        <ReactBootStrap.Nav.Link href="/LoginPage">Log In </ReactBootStrap.Nav.Link>
        <ReactBootStrap.Nav.Link href="/about">About</ReactBootStrap.Nav.Link>
        <ReactBootStrap.Nav.Link href="/search">Search</ReactBootStrap.Nav.Link>
      </ReactBootStrap.Nav>
  </ReactBootStrap.Navbar.Collapse>    
</ReactBootStrap.Navbar>
</div>
</nav>
    )
  }
}
export default Navbar