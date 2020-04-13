import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import {myFirebase} from '../firebase/firebase';
import { signInWithGoogle, login } from '../firebase/FirebaseLoginUtils'
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBModalFooter } from 'mdbreact';

const centerStyle = {
    margin: 'auto',
    width: '50%',
}

export default class LoginPage extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
 //   this.signup = this.signup.bind(this);
    this.state = {
      email: '',
      password: '',
      online: false
      
    };
    this.googleLogin = this.googleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSignUpClick = this.onSignUpClick.bind(this);
  }

  googleLogin = async (e) => {
    e.preventDefault();
    var userid = await signInWithGoogle()
    console.log(userid)
    this.setState({
      online: true,
      userInfo: userid
    })
  }

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

  onSignUpClick = (e) => {
    e.preventDefault();
    this.props.history.push('/SignUp');
  }
  render() {
    if(this.state.online){
      return <Redirect to = "/Menu"></Redirect>
    }
    const { email, password } = this.state;
    return (
        <MDBContainer>
            <MDBRow>
                <MDBCol md="5" style={centerStyle}>
                    <MDBCard>
                        <div className="header pt-3 blue-gradient">
                            <MDBRow className="d-flex justify-content-center">
                                <h3 className="white-text mb-3 pt-3 font-weight-bold">
                                Log in
                                </h3>
                            </MDBRow>
                            <MDBRow className="mt-2 mb-3 d-flex justify-content-center">
                                <a onClick={this.googleLogin} className="fa-lg p-2 m-2 gplus-ic">
                                    <MDBIcon fab className="fa-google-plus-g white-text fa-lg" />
                                </a>
                            </MDBRow>
                        </div>
                        <MDBCardBody className="mx-4">
                            <MDBInput
                                name="email"
                                label="Your email"
                                group
                                type="email"
                                validate
                                error="wrong"
                                success="right"
                                onChange={this.onChange}
                            />
                            <MDBInput
                                name="password"
                                label="Your password"
                                group
                                type="password"
                                validate
                                containerClass="mb-0"
                                onChange={this.onChange}
                            />
                            <p className="font-small blue-text d-flex justify-content-end pb-3">
                                Forgot
                                <a href="#!" className="blue-text ml-1">
    
                                Password?
                                </a>
                            </p>
                            <div style={{margin: 'auto', width: '30%'}} className="text-center mb-3">
                                <MDBBtn
                                    type="button"
                                    gradient="blue"
                                    rounded
                                    className="btn-block z-depth-1a"
                                    style={{borderRadius: '18px',}}
                                    onClick={(e)=> login(e, email, password)}
                                    
                                >
                                    LOGIN
                                </MDBBtn>
                            </div>
                        </MDBCardBody>
                        <MDBModalFooter className="mx-5 pt-3 mb-1 justify-content-center">
                            <p align='center' className="font-small grey-text d-flex">
                            Not a member?
                            <a onClick={this.onSignUpClick} className="blue-text ml-1">
                              Sign Up
                            </a>
                            </p>
                        </MDBModalFooter>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );}
}
