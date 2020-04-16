import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect} from 'react-router-dom'

import Menu from './components/main-menu/Menu'
import AdminMenu from './components/admin/AdminMenu'
import LoginPage from './components/login/LoginPage/index'
import SignUp from './components/login/SignUp'
import UpdateSite from './components/admin/UpdateSite';
import CreateSite from './components/admin/CreateSite';
import DeleteSite from './components/admin/DeleteSite';
import AdminPage from './components/admin/AdminPage';
import AuthMenu from './components/admin/AuthMenu';
import SearchMenu from './components/search/SearchMenu';
import About from './components/main-menu/about/index';
import Navbar from './components/layout/Navbar'
import Home from './components/login/Home';
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
      <BrowserRouter forceRefresh={true}>
        <div className="App">
          <Navbar/>
          <header className="App-header">
            <script src="https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js"></script>
            <script src="https://www.gstatic.com/firebasejs/7.6.1/firebase-firestore.js"></script>
            <script src="https://www.gstatic.com/firebasejs/7.6.1/firebase-auth.js"></script>
            <script src="https://cdn.firebase.com/libs/firebaseui/4.0.0/firebaseui.js"></script>
            <link rel="manifest" href="/manifest.json"></link>
            <link rel="stylesheet" href="styles.css"></link>
          </header>
          <Switch>
            <Route exact path='/' >
              <Redirect to='/LoginPage'/>
            </Route>
            {/* <Route exact path='/' component={LoginPage}/> */}
            <Route path='/menu'  component={Menu} />
            <Route path='/loginpage' component={LoginPage} />
            <Route path='/logout' component={LogOut} />
            <Route path='/signup' component={SignUp} />
            <Route path='/adminpage' component={AdminMenu} />
            <Route path='/createsite' component={CreateSite} />
            <Route exact path='/deletesite' component={DeleteSite} />
            <Route exact path='/deletesite/:searchVal' component={DeleteSite} />
            <Route exact path='/updatesite' component={UpdateSite} />
            <Route exact path='/updatesite/:searchVal' component={UpdateSite} />
            <Route exact path='/updateform/:id' component={UpdateForm} />
            <Route path='/auth' component={AuthMenu} />
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
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;