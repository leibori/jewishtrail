import React, { Component } from 'react';
import {myFirebase} from '../firebase/firebase';
import { Link } from 'react-router-dom';

class Home extends Component {

    logout(e){
        // check if user online or not.
        myFirebase.auth().signOut().then(() =>{
            console.log("logged out")
        })
    }

    render() {
        return (
            <div>
                <h1>Welcome!</h1>
                <button  className="btn white lighten-1 z-depth-0 "><Link to="LoginPage">Log In</Link></button>
                <button  className="btn white lighten-1 z-depth-0 "><Link to="Menu">Enter as guest </Link></button>
            </div>
        );

    }

}

export default Home;