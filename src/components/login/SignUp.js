import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import  {myFirebase} from '../firebase/firebase';
import {signup} from '../firebase/FirebaseLoginUtils'
import styles from "assets/jss/material-kit-react/views/loginPage.js";
import { Link } from 'react-router-dom';


import image from "assets/img/bg7.jpg";

const useStyles = makeStyles(styles);

export default function LoginPage(props) {
  const usernameRef = React.createRef('Default');
  const passwordRef = React.createRef('Default');
  const emailRef = React.createRef('Default');
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  setTimeout(function() {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
  const { ...rest } = props;
  return (
    <div>
      <Header
        absolute
        color="transparent"
        rightLinks={<HeaderLinks />}
        {...rest}
      />
      <div
        className={classes.pageHeader}
        style={{
          // backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <Card className={classes[cardAnimaton]}>
                <form className={classes.form}>
                  <CardHeader color="info" className={classes.cardHeader}>
                    <h4><b>Sign Up</b></h4>
                  </CardHeader>
                  <p className={classes.divider}>Join Today!</p>
                  <CardBody>
                    <CustomInput
                      inputRef={usernameRef}
                      labelText="Username..."
                      id="username"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        required: true,
                        type: "text",
                        endAdornment: (
                          <InputAdornment position="end">
                            <People className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <CustomInput
                      inputRef={emailRef}
                      labelText="Email..."
                      id="email"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        required: true,
                        type: "email",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <CustomInput
                      inputRef={passwordRef}
                      labelText="Password"
                      id="pass"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        required: true,
                        type: "password",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className={classes.inputIconsColor}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        ),
                        autoComplete: "off"
                      }}
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button type="submit" onSubmit={(e) => signup(e, emailRef.current.value, passwordRef.current.value, usernameRef.current.value)} 
                        round color="info" size="md">
                      Get started!
                    </Button>
                  </CardFooter>
                  <CardFooter className={classes.cardFooter}>
                  <Button simple color="info" size="sm">
                      <Link to="/Menu">
                        Enter as guest       
                      </Link>
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        <Footer whiteFont />
      </div>
    </div>
  );
}




// import React, { Component } from 'react';
// import { Redirect } from 'react-router-dom';
// import  {myFirebase} from '../firebase/firebase';
// import {signup} from '../firebase/FirebaseLoginUtils'
// import LoginPage from 'views/LoginPage/LoginPage';


// class SignUp extends Component {
//   constructor() {
//     super();
//     this.handleChange = this.handleChange.bind(this);
//     this.state = {
//       isLoggenIn: false,
//       email: '',
//       password: '',
//       user_name:'',
//     };
//   }

//   async componentDidMount(){
//     myFirebase.auth().onAuthStateChanged(async (user) => {
//       if(user){
//         this.setState({isLoggedIn: true})
//       }else{
//         this.setState({isLoggedIn: false})
//       }
      
//    })
//  }
//   handleChange(e) {
//     this.setState({ [e.target.name]: e.target.value });
//   }

//   render() {
//     // return <LoginPage/>;
//     if(this.state.isLoggedIn){
//       return <Redirect to = "/Menu"></Redirect>
//     }
//     return (
//       <div className="col-md">
//         <form>
//           <div className="for-group">
//             <label >Email address</label>
//             <input  value={this.state.email} onChange={this.handleChange} type="email" name="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
//             <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
//           </div>
//           <div className="for-group">
//             <label >Password</label>
//             <input  value={this.state.password} onChange={this.handleChange} type="password" name="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
//           </div>
//           <div className="for-group">
//             <label >user_name</label>
//             <input  value={this.state.user_name} onChange={this.handleChange} type="text" name="user_name" className="form-control" id="exampleFirstName" placeholder="user Name" />
//           </div>
          // <button onClick={(e) => signup(e, this.state.email, this.state.password, this.state.user_name)} className="btn btn-success">Signup</button>
//         </form>
//       </div>
//     );
//   }
// }
// export default SignUp;