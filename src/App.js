import React, { Component } from 'react';
import { BrowserRouter, Switch, Route} from 'react-router-dom'

import Menu from './components/main-menu/Menu'
import AdminMenu from './components/admin/AdminMenu'
import LoginPage from './components/login/LoginPage'
import SignUp from './components/login/SignUp'
import ChangeSite from './components/admin/ChangeSite';
import CreateSite from './components/admin/CreateSite';
import DeleteSite from './components/admin/DeleteSite';
import AuthMenu from './components/admin/AuthMenu';
import SearchMenu from './components/search/SearchMenu';
import About from './components/main-menu/about';
import Navbar from './components/layout/Navbar'
import Home from './components/login/Home';
import LogOut from './components/login/LogOut';
import {myFirebase} from './components/firebase/firebase';
import Favorites from './components/favorites/Favorites';
import SitePage from './components/sites/SitePage'

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
      <BrowserRouter>
        <div className="App">
        <Navbar />
          <header className="App-header">
            <script src="https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js"></script>
            <script src="https://www.gstatic.com/firebasejs/7.6.1/firebase-firestore.js"></script>
            <script src="https://www.gstatic.com/firebasejs/7.6.1/firebase-auth.js"></script>
            <script src="https://cdn.firebase.com/libs/firebaseui/4.0.0/firebaseui.js"></script>
            <link rel="manifest" href="/manifest.json"></link>
            <link rel="stylesheet" href="styles.css"></link>
            <h1>Jewish Trail</h1>
          </header>
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/Menu'  component={Menu} />
            <Route path='/LoginPage' component={LoginPage} />
            <Route path='/LogOut' component={LogOut} />
            <Route path='/SignUp' component={SignUp} />
            <Route path='/adminPage' component={AdminMenu} />
            <Route path='/createSite' component={CreateSite} />
            <Route path='/deleteSite' component={DeleteSite} />
            <Route path='/updateSite' component={ChangeSite} />
            <Route path='/auth' component={AuthMenu} />
            <Route path='/searchSite' component={SearchMenu} />
            <Route path='/favorites' component={Favorites} />
            <Route path='/about' component={About} />
            <Route exact path='/site/:id' component={SitePage} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;