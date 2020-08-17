import { BrowserRouter, Switch, Route } from 'react-router-dom';
import React, { Component } from 'react';
import Loginpage from './login';
import Dashboard from './dashbord';
import Gen_prof from './general_profile'
import Projects from './projects';
import NewIdea from './newidea';
class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loggeduser_id:false,
    }
  }
  componentDidMount(){

    this.setState({
      loadedstatus:'loaded',
  })
  
  };
  render() {
    return (
      <div className="App">
            <BrowserRouter>
              <Switch>
                <Route
                  exact
                  path={"/"}
                  render={props => (
                    <Loginpage {...props} />
                  )}
                />
                <Route exact path={"/dashboard"} render={props => (<Dashboard {...props} userid={this.passprops} />)} />
                <Route exact path={"/profile"} render={props => (<Gen_prof {...props} univ_userid={this.state.loggeduser_id} />)} />
                <Route exact path={"/project"} render={props => (<Projects {...props} univ_userid={this.state.loggeduser_id} />)} />
                <Route exact path={"/newidea"} render={props => (<NewIdea {...props} univ_userid={this.state.loggeduser_id} />)} />
              </Switch>
            </BrowserRouter>
      </div>

    );
  }
}


export default App;
