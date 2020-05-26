import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import  {myFirebase} from '../firebase/firebase';
import {signup, signInWithGoogle} from '../firebase/FirebaseLoginUtils'
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBModalFooter } from 'mdbreact';
import ReCAPTCHA from "react-google-recaptcha";
import './GeneralBack.css';
import { recaptchaKey } from 'keys'


const centerStyle = {
  margin: 'auto',
  width: '50%',
}

class SignUp extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);

    /*signup data */
    this.state = {
      online: '',
      email: '',
      password: '',
      confpassword: '',
      username:'',
      recaptchaRef: React.createRef(),
    };
    this.onSignup = this.onSignup.bind(this);
    this.handleChange = this.handleChange.bind();
    this.googleLogin = this.googleLogin.bind(this);

  }
  /* login using google */
  googleLogin = async (e) => {
    e.preventDefault();
    var userid = await signInWithGoogle()
    console.log(userid)
    this.setState({
      online: true,
      uid: userid
    })
  }

    /* firebase status */
  async componentDidMount(){
    myFirebase.auth().onAuthStateChanged(async (user) => {
      if(user){
        this.setState({online: true})
      }else{
        this.setState({online: false})
      }
      
   })
 }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  /* Signup messege alert*/
  onSignup = (e) => {
    e.preventDefault();
    const { email, password, username, confpassword, recaptchaRef } = this.state;
    if (!recaptchaRef.current.getValue()){
      alert("Please fill reCaptcha box.")
      return
    }
    if ( confpassword !== password ){
      alert("Passwords does not match.")
      return;
    }
    signup(e, email, password, username).then(() => this.props.history.push('/notverified'));
  }
  
  render() {
    const { email, password, username, recaptchaRef } = this.state;
    return (
    /* Signup form to fill in */
    <div style={{height: '100%'}} >
        <title>Login</title>
        <div className='bg-img'>
          <div className='content'>
            <header>Sign Up</header>
            <form onSubmit={(e)=>this.onSignup(e, email, password, username)}>
              <div className='field'>
                <span  className="fas fa-user"></span>
                <input required name="username" onChange={this.handleChange} type='text' placeholder='Username...'></input>
              </div>
              <div className='field space'>
                <span className="far fa-envelope"></span>
                <input required name="email" onChange={this.handleChange} type='email' placeholder='Email...'></input>
              </div>
              <div className='field space'>
                <span className="fas fa-lock">                  
                </span>
                <input required name="password" onChange={this.handleChange} type='password' placeholder='Pasword...'></input>
              </div>
              <div className='field space'>
                <span className="fas fa-lock"></span>
                <input required name="confpassword" onChange={this.handleChange} type='password' placeholder='Confirm Pasword...'></input>
              </div>
              <div className='space'>
                <ReCAPTCHA ref={recaptchaRef} sitekey={recaptchaKey}/>
              </div>
              <div className='field space'>
                <input type='submit' value='Sign Up'></input>
              </div>
              <div className='login'>———————— or ————————</div>
              <div className='pass'>
                <a href='/about'>Continue as a guest</a>
              </div>
              <div className='pass'>
                Already have an account?  
                <a href="/LoginPage">Log in</a>
              </div>
            </form>
          </div>
        </div>
      </div>);
  }
}

export default SignUp;