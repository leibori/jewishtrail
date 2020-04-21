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

const fontStyle = {
  color:"white",
  fontWeight:'bolder',
  textShadow:'1px 1px black'

}


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
        <nav className="nav-wrapper">
            <div className="App transparent">
          {/* <Link to='/menu' className="brand-logo">Jewish Trail</Link> */}
            <ReactBootStrap.Navbar collapseOnSelect expand="xl" bg="transparent" variant="light">
          {/*<ReactBootStrap.Navbar.Brand href="/Menu">Jewish Trail</ReactBootStrap.Navbar.Brand>*/}
          <ReactBootStrap.Navbar.Toggle aria-controls="responsive-navbar-nav" variant="dark" />
          <ReactBootStrap.Navbar.Collapse id="responsive-navbar-nav"> 
            <ReactBootStrap.Nav className="mr-auto">
            
              <ReactBootStrap.Nav.Link style={fontStyle} onClick={() => {if(window.confirm("are you sure?")){myFirebase.auth().signOut();}}} href="/loginPage">Log Out</ReactBootStrap.Nav.Link>
              <ReactBootStrap.Nav.Link style={fontStyle} href="/about">About</ReactBootStrap.Nav.Link>
              <ReactBootStrap.Nav.Link style={fontStyle} href="/search">Search</ReactBootStrap.Nav.Link>
              <ReactBootStrap.Nav.Link style={fontStyle} href="/favorites">Favorites</ReactBootStrap.Nav.Link>
              <ReactBootStrap.Nav.Link style={fontStyle} href="/aroundyou">Around You </ReactBootStrap.Nav.Link>

                {
                  this.state.isAdmin && (<ReactBootStrap.Nav.Link style={fontStyle} href="/admin">Admin Page</ReactBootStrap.Nav.Link>)
                }          
            </ReactBootStrap.Nav>
        </ReactBootStrap.Navbar.Collapse>    
      </ReactBootStrap.Navbar>
      </div>
      </nav>

      )
    }
    return (

      <nav className="nav-wrapper">
      <div className="App transparent " >
    {/* <Link to='/menu' className="brand-logo">Jewish Trail</Link> */}
      <ReactBootStrap.Navbar collapseOnSelect expand="xl" bg="transparent" variant="light">
    {/* <ReactBootStrap.Navbar.Brand href="/Menu">Jewish Trail</ReactBootStrap.Navbar.Brand>*/}
    <ReactBootStrap.Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <ReactBootStrap.Navbar.Collapse id="responsive-navbar-nav"> 
      <ReactBootStrap.Nav className="mr-auto">
      
        <ReactBootStrap.Nav.Link style={fontStyle} href="/LoginPage">Log In </ReactBootStrap.Nav.Link>
        <ReactBootStrap.Nav.Link style={fontStyle} href="/about">About</ReactBootStrap.Nav.Link>
        <ReactBootStrap.Nav.Link style={fontStyle} href="/search">Search</ReactBootStrap.Nav.Link>
        <ReactBootStrap.Nav.Link style={fontStyle} href="/aroundyou">Around You </ReactBootStrap.Nav.Link>

      </ReactBootStrap.Nav>
  </ReactBootStrap.Navbar.Collapse>    
</ReactBootStrap.Navbar>
</div>
</nav>
    )
  }
}
export default Navbar