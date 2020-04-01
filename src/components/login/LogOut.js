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
                <h1>Its Time To Say Goodbye</h1>
                <button onClick={this.logout}><Link to="/">Logout</Link></button>
            </div>
        );

    }

}

export default Home;