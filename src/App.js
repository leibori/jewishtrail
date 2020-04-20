import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect} from 'react-router-dom'

import AroundYou from './components/around_you/AroundYou'
import AdminMenu from './components/admin/AdminMenu'
import LoginPage from './components/login/LoginPage'
import SignUp from './components/login/SignUp'
import UpdateSite from './components/admin/UpdateSite';
import CreateSite from './components/admin/CreateSite';
import DeleteSite from './components/admin/DeleteSite';
import AdminPage from './components/admin/AdminPage';
import AuthMenu from './components/admin/AuthMenu';
import SearchMenu from './components/search/SearchMenu';
import About from './components/around_you/about';
import Navbar from './components/layout/Navbar'
import LogOut from './components/login/LogOut';
import {myFirebase} from './components/firebase/firebase';
import Favorites from './components/favorites/Favorites';
import SitePage from './components/sites/SitePage'
import RoadForm from './components/road/RoadForm';
import UpdateForm from './components/sites/UpdateForm'
import RoadMenu from './components/search/RoadMenu';
import RaodPage from './components/road/roadPage';
import DeleteRoad from './components/road/DeleteRoad';

class App extends Component {

  constructor() {
    super();
    this.state = ({
      user: null,
    });
    this.authListener = this.authListener.bind(this);
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    myFirebase.auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        this.setState({ user });
        localStorage.setItem('user', user.uid);
      } else {
        this.setState({ user: null });
        localStorage.removeItem('user');
      }
    });
  }

  render() {
    // const user = {
    //   claims:"admin" 
    // }
    return (
    <div className="App" style={{height:'100%', width:'100%'}}>
      <BrowserRouter forceRefresh={true}>
          <div style={{position: 'absolute', zIndex: '20', width: '100%'}}>
            <Navbar/>
          </div>
          <header className="App-header">
            <script src="https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js"></script>
            <script src="https://www.gstatic.com/firebasejs/7.6.1/firebase-firestore.js"></script>
            <script src="https://www.gstatic.com/firebasejs/7.6.1/firebase-auth.js"></script>
            <script src="https://cdn.firebase.com/libs/firebaseui/4.0.0/firebaseui.js"></script>
            <link rel="manifest" href="/manifest.json"></link>
            <link rel="stylesheet" href="styles.css"></link>
          </header>
          <div style={{zIndex: '0', width: '100%', height: '100%', position:'absolute', left: '0px', top: '0px'}}>
            <Route exact path='/' component={LoginPage}>
              <Redirect to='/LoginPage'/>
            </Route>
            <Route exact path='/aroundyou'  component={AroundYou} />
            <Route exact path='/loginpage' component={LoginPage} />
            <Route exact path='/logout' component={LogOut} />
            <Route exact path='/signup' component={SignUp} />
            <Route exact path='/adminpage' component={AdminMenu} />
            <Route exact path='/createsite' component={CreateSite} />
            <Route exact path='/deletesite' component={DeleteSite} />
            <Route exact path='/deletesite/:searchVal' component={DeleteSite} />
            <Route exact path='/updatesite' component={UpdateSite} />
            <Route exact path='/updatesite/:searchVal' component={UpdateSite} />
            <Route exact path='/updateform/:id' component={UpdateForm} />
            <Route exact path='/auth' component={AuthMenu} />
            <Route exact path='/search' component={SearchMenu} />
            <Route exact path='/search/:searchVal' component={SearchMenu} />
            <Route path='/favorites' component={Favorites} />
            <Route path='/about' component={About} />
            <Route exact path='/site/:id' component={SitePage} />
            <Route exact path='/roadform' component={RoadForm} />
            <Route exact path='/roadform/:searchVal' component={RoadForm} />
            <Route exact path='/admin' component={AdminPage} />
            <Route exact path='/searchroad' component={RoadMenu} />
            <Route exact path='/searchroad/:searchVal' component={RoadMenu} />
            <Route exact path='/road/:id' component={RaodPage} />
            <Route exact path='/deleteroad' component={DeleteRoad} />
            <Route exact path='/deleteroad/:searchVal' component={DeleteRoad} />          
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;