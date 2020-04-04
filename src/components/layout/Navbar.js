import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {myFirebase} from '../firebase/firebase';
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'
import {getUserClaims} from '../firebase/FirebaseUtilities'
import AdminLinks from './AdminLinks';


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
        this.setState({isLoggedIn: true})
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
        <nav className="nav-wrapper grey darken-3">
        <div className="container">
          <Link to='/menu' className="brand-logo">Jewish Trail</Link>
          <SignedInLinks />
          {this.state.isAdmin
            ? <AdminLinks />
            : null
          }
        </div>
      </nav>
      )
    }
    return (
      <nav className="nav-wrapper grey darken-3">
        <div className="container">
          <Link to='/menu' className="brand-logo">Jewish Trail</Link>
          <SignedOutLinks />
        </div>
      </nav>
    )
  }
}
export default Navbar