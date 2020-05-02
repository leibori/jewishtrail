import React, { Component } from 'react';
import MyBrowserRouter from 'components/MyBrowerRouter';
import Navbar from 'components/layout/Navbar';


class App extends Component {

  render() {
    return (
    <div className="App" style={{height:'100%', width:'100%'}}>
      <MyBrowserRouter><Navbar/></MyBrowserRouter>
      </div>
    );
  }
}

export default App;