import React, {Component} from 'react';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import NotVerified from 'components/login/NotVerified';
import AroundYou from 'components/around_you/AroundYou'
import AdminMenu from 'components/admin/AdminMenu'
import LoginPage from 'components/login/LoginPage'
import SignUp from 'components/login/SignUp'
import UpdateSite from 'components/admin/UpdateSite';
import CreateSite from 'components/admin/CreateSite';
import DeleteSite from 'components/admin/DeleteSite';
import AdminPage from 'components/admin/AdminPage';
import AuthMenu from 'components/admin/AuthMenu';
import SearchMenu from 'components/search/SearchMenu';
import About from 'components/around_you/about';
import LogOut from 'components/login/LogOut';
import Favorites from 'components/favorites/Favorites';
import SitePage from 'components/sites/SitePage'
import RoadForm from 'components/road/RoadForm';
import UpdateForm from 'components/sites/UpdateForm'
import RoadPage from 'components/road/roadPage';
import DeleteRoad from 'components/road/DeleteRoad';
import AdminSitePage from 'components/admin/AdminSitePage'
import AdminRoadPage from 'components/admin/AdminRoadPage'
import ForgotPassword from 'components/login/ForgotPassword'
import updateRoad from 'components/road/updateRoad'
import ContactUs from 'components/MailBox/ContactUs'
import massegeList from 'components/MailBox/massegeList'
import massegePage from 'components/MailBox/massegePage'



import { connect } from 'react-redux'


class MyBrowserRouter extends Component{
  render() {
  let admin = this.props.claims === 'admin';
  let online = ((this.props.claims === 'registered') || admin) && (this.props.id !== '');
  let verified = this.props.isVerified
  let online_and_verified = (verified && online);
  let online_not_verified = (!verified && online);
  return (
      <BrowserRouter forceRefresh={true}>
      <div style={{position: 'fixed', zIndex: '20', width: '100%',backgroundColor: 'rgba(255,255,255,0.55)',}}>
            {this.props.children}
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
            <MyRoute exact path='/' component={LoginPage}>
              <Redirect to='/LoginPage'/> </MyRoute>
            <MyRoute exact path='/aroundyou'  component={AroundYou} />
            <MyRoute exact path='/loginpage' component={LoginPage} aboutCond={online} verCond={online_not_verified} />
            <MyRoute exact path='/logout' component={LogOut}/>
            <MyRoute exact path='/signup' component={SignUp} aboutCond={online} verCond={online_not_verified}/>
            <MyRoute exact path='/createsite' component={CreateSite} aboutCond={!admin} verCond={online_not_verified}/>
            <MyRoute exact path='/deletesite' component={DeleteSite} aboutCond={!admin} verCond={online_not_verified}/>
            <MyRoute exact path='/deletesite/:searchVal' component={DeleteSite} aboutCond={!admin} verCond={online_not_verified}/>
            <MyRoute exact path='/updatesite' component={UpdateSite} aboutCond={!admin} verCond={online_not_verified}/>
            <MyRoute exact path='/updatesite/:searchVal' component={UpdateSite} aboutCond={!admin} verCond={online_not_verified}/>
            <MyRoute exact path='/updateform/:id' component={UpdateForm} aboutCond={!admin} verCond={online_not_verified}/>
            <MyRoute exact path='/auth' component={AuthMenu} aboutCond={!admin} verCond={online_not_verified}/>
            <MyRoute exact path='/search' component={SearchMenu}/>
            <MyRoute exact path='/search/:searchVal' component={SearchMenu} /> 
            <MyRoute exact path='/favorites' component={Favorites} aboutCond={!online} verCond={online_not_verified}/>
            <MyRoute exact path='/about' component={About} />
            <MyRoute exact path='/contactUs' component={ContactUs} />
            <MyRoute exact path='/massegeList' component={massegeList} aboutCond={!admin} verCond={online_not_verified} />
            <MyRoute exact path='/massege/:id' component={massegePage} aboutCond={!admin} verCond={online_not_verified}/>
            <MyRoute exact path='/site/:id' component={SitePage} />
            <MyRoute exact path='/roadform' component={RoadForm} />
            <MyRoute exact path='/roadform/:searchVal' component={RoadForm} />
            <MyRoute exact path='/road/:id' component={RoadPage} />
            <MyRoute exact path='/deleteroad' component={DeleteRoad} aboutCond={!admin} verCond={online_not_verified}/>
            <MyRoute exact path='/deleteroad/:searchVal' component={DeleteRoad} aboutCond={!admin} verCond={online_not_verified}/>          
            <MyRoute exact path='/adminRoadPage' component={AdminRoadPage} aboutCond={!admin} verCond={online_not_verified}/> 
            <MyRoute exact path='/adminSitePage' component={AdminSitePage} aboutCond={!admin} verCond={online_not_verified}/>       
            <MyRoute exact path='/admin' component={AdminMenu} aboutCond={!admin} verCond={online_not_verified}/>
            <MyRoute exact path='/forgotpassword' component={ForgotPassword} aboutCond={online} verCond={online_not_verified}/>
            <MyRoute exact path='/updateRoad' component={updateRoad} aboutCond={!admin} verCond={online_not_verified}/>  
            <MyRoute exact path='/updateRoad/:searchVal' component={updateRoad} aboutCond={!admin} verCond={online_not_verified}/>
            <MyRoute exact path='/notverified' component={NotVerified} aboutCond={online_and_verified}/>
          </div>
        </BrowserRouter>);
  }
}

function MyRoute(props){
  const { exact, path, component, aboutCond, verCond} = props;
  return (
    <Route exact path={path} component={component}>
      {aboutCond ? <Redirect to="/about"/> : verCond ? <Redirect to='/notverified'/> : undefined}
    </Route>);
}

const mapStateToProps = (state) => {
  return {
      uid: state.status.uid,
      claims: state.status.claims,
      isVerified: state.status.isVerified,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(MyBrowserRouter);