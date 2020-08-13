import {BrowserRouter , Switch ,Route} from 'react-router-dom';
import Loginpage from './login';
import Dashboard from './dashbord';
import React, { Component } from 'react';
import 'react-sticky-header/styles.css';
import StickyHeader from 'react-sticky-header';
class App extends Component {
  render() {
    return (
      <div className="App">
                  <StickyHeader header={
            <div className="topnav" id="mytop">
                <h3> <a href="#">GitConnect</a></h3>
                <h3> <a href="#">Home</a> </h3>
                <h3> <a href="#">About Us</a> </h3>
            </div>
            } />
      <BrowserRouter>
        <Switch>
          <Route 
            exact 
            path={"/"}
            render  = {props => (
              <Loginpage {...props}/>
            )}  
          />
           <Route exact path={"/dashboard"} render = {props => (<Dashboard {...props}/>)}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
  }
}


export default App;
