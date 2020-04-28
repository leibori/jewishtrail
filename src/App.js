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
import Favorites from './components/favorites/Favorites';
import SitePage from './components/sites/SitePage'
import RoadForm from './components/road/RoadForm';
import UpdateForm from './components/sites/UpdateForm'
import RoadPage from './components/road/roadPage';
import DeleteRoad from './components/road/DeleteRoad';
import AdminSitePage from './components/admin/AdminSitePage'
import AdminRoadPage from './components/admin/AdminRoadPage'
import ForgotPassword from './components/login/ForgotPassword'

class App extends Component {

  render() {
    return (
    <div className="App" style={{height:'100%', width:'100%'}}>
      <BrowserRouter forceRefresh={true}>
      <div style={{position: 'fixed', zIndex: '20', width: '100%',backgroundColor: 'rgba(255,255,255,0.3)', }}>
            <Navbar/>
          </div>
          <header className="App-header">
            <script src="https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js"></script>
            <script src="https://www.gstatic.com/firebasejs/7.6.1/firebase-firestore.js"></script>
            <script src="https://www.gstatic.com/firebasejs/7.6.1/firebase-auth.js"></script>
            <script src="https://cdn.firebase.com/libs/firebaseui/4.0.0/firebaseui.js"></script>
            <link rel="manifest" href="/manifest.json"></link>
            <link rel="stylesheet" href="styles.css"></link>
            <link rel="apple-touch-icon" href="/icon.png"></link>
          </header>
          <div style={{zIndex: '0', width: '100%', height: '100%', position:'absolute', left: '0px', top: '0px'}}>
            <Route exact path='/' component={LoginPage}>
              <Redirect to='/LoginPage'/> </Route>
            <Route exact path='/aroundyou'  component={AroundYou} />
            <Route exact path='/loginpage' component={LoginPage} />
            <Route exact path='/logout' component={LogOut} />
            <Route exact path='/signup' component={SignUp} />
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
            <Route exact path='/road/:id' component={RoadPage} />
            <Route exact path='/deleteroad' component={DeleteRoad} />
            <Route exact path='/deleteroad/:searchVal' component={DeleteRoad} />          
            <Route exact path='/adminRoadPage' component={AdminRoadPage} /> 
            <Route exact path='/adminSitePage' component={AdminSitePage} />       
            <Route exact path='/admin' component={AdminMenu} />
            <Route exact path='/forgotpassword' component={ForgotPassword} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;