import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import  {myFirebase} from '../firebase/firebase';
import {signup, signInWithGoogle} from '../firebase/FirebaseLoginUtils'
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBModalFooter } from 'mdbreact';

const centerStyle = {
  margin: 'auto',
  width: '50%',
}

class SignUp extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      online: '',
      email: '',
      password: '',
      username:'',
    };
    this.onSignup = this.onSignup.bind(this);
    this.handleChange = this.handleChange.bind();
    this.googleLogin = this.googleLogin.bind(this);

  }

  googleLogin = async (e) => {
    e.preventDefault();
    var userid = await signInWithGoogle()
    console.log(userid)
    this.setState({
      online: true,
      uid: userid
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

  onSignup = (e) => {
    const { email, password, username } = this.state;
    e.preventDefault();
    signup(e, email, password, username);
    this.props.history.push('/Menu');
  }
  render() {
    if(this.state.online){
      return <Redirect to = "/Menu"></Redirect>
    }
    const { email, password, username } = this.state;
    return (
        <MDBContainer>
            <MDBRow className="mt-2 mb-3 d-flex justify-content-center">
                <MDBCol md="4">
                    <MDBCard>
                        <div className="header pt-3 blue-gradient">
                            <MDBRow className="d-flex justify-content-center">
                                <h1 className="white-text mb-3 pt-3 font-weight-bold">
                                Sign Up
                                </h1>
                            </MDBRow>
                            <MDBRow className="mt-2 mb-3 d-flex justify-content-center">
                                <a onClick={this.googleLogin} className="fa-lg p-2 m-2 gplus-ic">
                                    <MDBIcon fab className="fa-google-plus-g white-text fa-lg" />
                                </a>
                            </MDBRow>
                        </div>
                        <MDBCardBody className="mx-4">
                        <h3 align='center' className="blue-text mb-3 pt-3 font-weight-bold">
                                Start your trail today!
                                </h3>
                          <form onSubmit={this.onSignup}>
                            <div className="md-form mt-3">
                              <i className="fa fa-envelope prefix grey-text"></i>
                              <input required name="email" onChange={this.handleChange} type="email" id="materialSubscriptionFormPasswords" className="form-control"/>
                              <label htmlFor="materialSubscriptionFormPasswords"> Email...</label>
                            </div>
                            <div className="md-form mt-3">
                              <i className="fa fa-lock prefix grey-text"></i>
                              <input required type="password" name="password" onChange={this.handleChange} id="materialSubscriptionFormPasswords" className="form-control"/>
                              <label htmlFor="materialSubscriptionFormPasswords">Password...</label>
                            </div> 
                            <div className="md-form mt-3">
                              <i className="fa fa-user prefix grey-text"></i>
                              <input required type="text" name="username" onChange={this.handleChange} id="materialSubscriptionFormPasswords" className="form-control"/>
                              <label htmlFor="materialSubscriptionFormPasswords">Username...</label>
                            </div>  
                            <div style={{margin: 'auto'}} className="text-center mb-3">
                                <MDBBtn
                                    type="submit"
                                    gradient="blue"
                                    rounded
                                    className="z-depth-1a"
                                    style={{borderRadius: '18px',}}                                    
                                >
                                  Sign up
                                </MDBBtn>
                            </div>
                          </form>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );}
}
export default SignUp;