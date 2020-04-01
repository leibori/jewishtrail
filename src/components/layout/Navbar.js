import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {myFirebase} from '../firebase/firebase';
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'


class Navbar extends Component {
  state=({
    isLoggedIn: false
  }) 
  
  async componentDidMount(){
    myFirebase.auth().onAuthStateChanged(async (user) => {
      if(user){
        this.setState({isLoggedIn: true})
      }else{
        this.setState({isLoggedIn: false})
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