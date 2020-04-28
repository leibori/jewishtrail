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
import { setLogStatus } from 'actions';
import { connect } from 'react-redux'

const fontStyle = {
  color:"white",
  fontWeight:'bolder',
  textShadow:'1px 1px black'

}
const backStyle = {
  background:"rgba(255,255,255,0.3)'" 
}



class Navbar extends Component {
  state=({
    isLoggedIn: false,
    isAdmin:false
  }) 
  
  async componentDidMount(){
    const { claims } = this.props.status
    if(claims === "admin"){
      this.setState({isAdmin: true,
                    isLoggedIn: true}
    )}
    else if(claims == "registered"){
      this.setState({isLoggedIn: true, isAdmin: false})
    }else{
      this.setState({isLoggedIn: false,
                    isAdmin: false
      })
    }      
  }

  logOut = () => {
    if(window.confirm("are you sure?")) {
      this.props.logOut()
      myFirebase.auth().signOut();
      window.location.href = '/loginPage'
    }
  }

  render() {
    return (
      <nav className="nav-wrapper">
          <div className="App transparent">
        {/* <Link to='/menu' className="brand-logo">Jewish Trail</Link> */}
          <ReactBootStrap.Navbar collapseOnSelect expand="xl" bg="transparent" variant="light">
        {/*<ReactBootStrap.Navbar.Brand href="/Menu">Jewish Trail</ReactBootStrap.Navbar.Brand>*/}
        <ReactBootStrap.Navbar.Toggle aria-controls="responsive-navbar-nav" variant="dark" />
        <ReactBootStrap.Navbar.Collapse id="responsive-navbar-nav"> 
          <ReactBootStrap.Nav className="mr-auto">
          
            { this.state.isLoggedIn ? (
              <ReactBootStrap.Nav.Link style={fontStyle} onClick={this.logOut}>Log Out</ReactBootStrap.Nav.Link>
              ) : (
              <ReactBootStrap.Nav.Link style={fontStyle} href="/LoginPage">Log In </ReactBootStrap.Nav.Link>
              )
            }
            
            <ReactBootStrap.Nav.Link style={fontStyle} href="/about">About</ReactBootStrap.Nav.Link>
            <ReactBootStrap.Nav.Link style={fontStyle} href="/search">Search</ReactBootStrap.Nav.Link>
            {
              this.state.isLoggedIn && (<ReactBootStrap.Nav.Link style={fontStyle} href="/favorites">Favorites</ReactBootStrap.Nav.Link>)
            }

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
}

const mapStateToProps = (state) => {
  return {
    status: state.status,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logOut: async () => { 
      await dispatch(setLogStatus({
        claims: 'guest',
        uid: ''
      }))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);