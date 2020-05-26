import React, { Component } from 'react';
import MyBrowserRouter from 'components/MyBrowerRouter';
import Navbar from 'components/layout/Navbar';
{/*import Footer from 'components/Footer/Footer';*/}



class App extends Component {

  render() {
    return (
    /* define data and style of the main files for the all app using MyBrowserRouter.js  */
    <div className="App" >
      <MyBrowserRouter style={{height:'100%', width:'100%'}}><Navbar/></MyBrowserRouter>
    </div>
    ); 
    
  }
}

export default App;