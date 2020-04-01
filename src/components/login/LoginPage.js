import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import {myFirebase} from '../firebase/firebase';
import { signInWithGoogle, login } from '../firebase/FirebaseLoginUtils'


class LoginPage extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
 //   this.signup = this.signup.bind(this);
    this.state = {
      userInfo: null,
      email: '',
      password: '',
      isLoggedIn: false
      
    };
  }

  googleLogin = async () => {
    var userid = await signInWithGoogle()
    console.log(userid)
    this.setState({
      isLoggedIn: true,
      userInfo: userid
    })
  }

  async componentDidMount(){
    myFirebase.auth().onAuthStateChanged(async (user) => {
      if(user){
        this.setState({isLoggedIn: true})
      }else{
        this.setState({isLoggedIn: false})
      }  
     })
  }
  
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    if(this.state.isLoggedIn){
      return <Redirect to = "/Menu"></Redirect>
    }
        return (
      <div className="col-md-6">
        <form>
          <div className="form-group">
            <label >Email address</label>
            <input  value={this.state.email} onChange={this.handleChange} type="email" name="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>
          <div className="form-group">
            <label >Password</label>
            <input  value={this.state.password} onChange={this.handleChange} type="password" name="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
          </div>
          <button type="submit" onClick={(e) => login(e, this.state.email, this.state.password)} className="btn black lighten-2 z-depth-0">Login</button>
          <small id="signitup" className="form-text text-muted">Not a member yet? sign up now</small>
          <button  className="btn white lighten-1 z-depth-0"><Link to="/SignUp">Signup</Link></button>
          <button onClick={async () => this.googleLogin()} className="googleBtn" type="button">Login With Google</button>
        <button  className="btn white lighten-1 z-depth-0 "><Link to="/Menu">Enter as guest</Link></button>
        </form>
      </div>
    );
  }
}
export default LoginPage;