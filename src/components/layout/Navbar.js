import React, { Component } from 'react';
import {myFirebase} from '../firebase/firebase';
import './Navbar.css';
import * as ReactBootStrap from "react-bootstrap";
import {
    BrowserRouter as Router,
    Link,
    NavLink
  } from "react-router-dom";
import { setLogStatus, setSiteFavorites, setTrailFavorites, setLikes, setDislikes, setPosition } from '../../actions/index';
import { connect } from 'react-redux'

  /* The font style */
const fontStyle = {
  fontSize: '17px',
  color:"black",
  fontWeight:'650',
  textAlign: 'center',

}
  /*background color*/
const backStyle = {
  background:"rgba(255,255,255,0.3)'" 
}


  /* user status */
class Navbar extends Component {
  state=({
    isLoggedIn: false,
    isAdmin:false
  }) 
  
    /*update user status */
  async componentDidMount(){
    const { claims } = this.props.status
    if(claims === "admin"){
      this.setState({isAdmin: true,
                    isLoggedIn: true}
    )}
    // registered users
    else if(claims === "registered"){
      this.setState({isLoggedIn: true, isAdmin: false})
    }else{
      this.setState({isLoggedIn: false,
                    isAdmin: false
      })
    }      
  }

    /*log out */

  logOut = async() => {
    //pop-up massege
    if(window.confirm("are you sure?")) {
      await this.props.logOut()
      myFirebase.auth().signOut();
      window.location.href = '/loginPage'
    }
  }

  render() {
      /* user name in navbar */
    const user_name = this.props.status.user_name;
    const firstName = user_name ? user_name.split(' ')[0] : undefined;
     /* navbar decliration using bootstrap */
    return (
      <div className="App-transparent">
      <ReactBootStrap.Navbar collapseOnSelect expand="xl" bg="transparent" variant="light" >        
      <ReactBootStrap.Navbar.Toggle aria-controls="responsive-navbar-nav" variant="dark" bg="transparent" style={{ marginTop: '0px',}} />
        <ReactBootStrap.Navbar.Collapse id="responsive-navbar-nav"> 
          <ReactBootStrap.Nav className="mr-auto">
            { this.state.isLoggedIn ? (
              <ReactBootStrap.Nav.Link style={fontStyle} onClick={this.logOut}>Log Out</ReactBootStrap.Nav.Link>
              ) : (
              <ReactBootStrap.Nav.Link style={fontStyle} href="/LoginPage">Log In </ReactBootStrap.Nav.Link>
              )
            }
            <ReactBootStrap.Nav.Link style={fontStyle} href="/search">Search</ReactBootStrap.Nav.Link>
            {
              this.state.isLoggedIn && (<ReactBootStrap.Nav.Link style={fontStyle} href="/favorites">Favorites</ReactBootStrap.Nav.Link>)
            }
            <ReactBootStrap.Nav.Link style={fontStyle} href="/aroundyou">Around You </ReactBootStrap.Nav.Link>
            {
              !this.state.isAdmin && (  <ReactBootStrap.Nav.Link style={fontStyle} href="/contactUs">Contact Us </ReactBootStrap.Nav.Link>)
            }  

            {
              this.state.isAdmin && (<ReactBootStrap.Nav.Link style={fontStyle} href="/admin">Admin Page</ReactBootStrap.Nav.Link>)
            }          
            <ReactBootStrap.Nav.Link style={fontStyle} href="/about">About</ReactBootStrap.Nav.Link>            
          </ReactBootStrap.Nav>
      </ReactBootStrap.Navbar.Collapse>  
      { user_name && <div style={{right: '10px', top: '10px', position:'fixed'}}><span style={{color: '#5C5B5C',}} className="far fa-user"></span>
          <span class="navbar-text-right" style={{fontSize: '17px', WebkitTextStroke: '1px 1px black',fontFamily: 'Cambay', color: '#5C5B5C', fontWeight: '1000',}}>{" " + firstName}</span></div>}  
    </ReactBootStrap.Navbar>
    </div>
    )
  }
}
 /* user status */
const mapStateToProps = (state) => {
  return {
    status: state.status,
  };
};
 
 /* update user status */
const mapDispatchToProps = (dispatch) => {
  return {
    logOut: async () => { 
      await dispatch(setLogStatus({
        claims: 'guest',
        user_name: '', 
        uid: '',
        isVerified: false,
      }))
      //update info
      await dispatch(setLikes([]))
      await dispatch(setDislikes([]))
      await dispatch(setSiteFavorites([]))
      await dispatch(setTrailFavorites([]))
      await dispatch(setPosition({
        lat: 0,
        lng: 0,
        country: '',
      }))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);