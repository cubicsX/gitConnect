import {BrowserRouter , Switch ,Route} from 'react-router-dom';
import Loginpage from './login';
import Dashboard from './dashbord';
import React, { Component } from 'react';
import 'react-sticky-header/styles.css';
class App extends Component {
  render() {
    return (
      <div className="App">
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
