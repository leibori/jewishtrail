import React, { Component, useState } from "react";
import { Link, Redirect } from 'react-router-dom';
import {myFirebase} from 'components/firebase/firebase';
import { signInWithGoogle, login } from 'components/firebase/FirebaseLoginUtils'
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
// import People from "@material-ui/icons/People";
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
import styles from "assets/jss/material-kit-react/views/loginPage.js";
import Icon from "@material-ui/core/Icon";
import { Icon as TestIcon } from 'semantic-ui-react';



export default function LoginWrapper(props) {

const useStyles = makeStyles(styles);
const classes = useStyles();
  return (
      <LoginPage {...props} classes={classes}/>
  );
}

class LoginPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      online: false,
      uid: '',
      email: '',
      pass: '',
      cardAnimaton: "cardHidden",
      classes: props.classes,

    }
    this.googleLogin = this.googleLogin.bind(this);
    this.onChange = this.onChange.bind(this);
    this.updateAnimation = this.updateAnimation.bind(this);
    this.timeoutFunc = this.timeoutFunc.bind(this);
  }

  googleLogin = async () => {
    var userid = await signInWithGoogle()
    console.log(userid)
    this.setState({
            online: true,
            uid: userid
          });
  }

  timeoutFunc = () => {
    this.setState({cardAnimaton: ""});
  };

  onChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value})
  }

  updateAnimation = () => setTimeout(this.timeoutFunc);

  componentWillMount() {
    // this.updateAnimation();
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

  render = () => {
  console.log(this.state.classes);
  const classes = this.state.classes;
  const rest = {...this.props};
  if(this.state.online){
      return <Redirect to = "/Menu"></Redirect>
        }
  return (
    <div>
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
              <Card className={classes[this.state.cardAnimaton]}>
                <div align='center'>
                <form className={classes.form}>
                  <CardHeader align='center' color="info" className={classes.cardHeader}>
                    <h4><b>Login</b></h4>
                    <div className={classes.socialLine}>
                      <Button
                        justIcon
                        target="_blank"
                        color="transparent"
                        onClick={this.googleLogin}
                      >
                        <TestIcon name="google"/>
                        <i className={"fab fa-google-plus-g"} />
                      </Button>
                    </div>
                  </CardHeader>
                  <br/>
                  <p align='center' className={classes.divider}>Start your trail!</p>
                  <CardBody>
                      <CustomInput
                        labelText="Email..."
                        id="email"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: this.onChange,
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
                        labelText="Password"
                        id="pass"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: this.onChange,
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
                    {/* <CardFooter style="makeStyles-cardFooter-8"> */}
                    {/* <CardFooter className={classes.cardFooter}> */}
                    <CardFooter>

                        <Button type='submit' onClick={(e) => login(e, this.state.email, this.state.pass)} simple color="info" size="sm">
                          Log In
                        </Button>
                    </CardFooter>
                  <CardFooter className={classes.cardFooter}>
                    <Button simple color="info" size="sm">
                      <Link to="/SignUp" style={{color:'#00ACC1'}}>
                        Signup
                      </Link>
                    </Button>
                  </CardFooter>
                  <CardFooter className={classes.cardFooter}>
                    <Button simple color="info" size="sm">
                      <Link to="/Menu" style={{color:'#00ACC1'}}>
                        Enter as guest       
                      </Link>
                    </Button>
                  </CardFooter>
                </form>
                </div>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        {/* <Footer whiteFont /> */}
      </div>
    </div>
  );}
}

// C:\Users\Joker\Desktop\X Files\Personal Projects\Project\Ziv\jewishtrail\src\components\login\LoginPage.js