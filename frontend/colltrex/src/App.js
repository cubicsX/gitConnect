import { BrowserRouter, Switch, Route } from 'react-router-dom';
import React, { Component } from 'react';
import Loginpage from './login';
import Dashboard from './dashbord';
import Gen_prof from './general_profile'
import Projects from './projects';
import NewIdea from './newidea';
import './css/base.css';
import axios from 'axios';
import './css/header.css';
class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loggeduser_id: '',
      loadedstatus:'unloaded',
      headersize:"large",
      isMobile:false,
    }
    this.passprops = this.passprops.bind(this)
  }
  listenScrollEvent =(event)=>{
    this.setState({
        headersize:"smaller" ,
    })
    if (window.pageYOffset === 0){
        this.setState({
            headersize:"large"
        })
    }
  }
  componentDidMount(){

    this.setState({
      loadedstatus:'loaded',
  })
  
  window.addEventListener('resize', () => {
      this.setState({
          isMobile: window.innerWidth < 1200
      });
  }, false);
  window.addEventListener('scroll', this.listenScrollEvent)

  }
  passprops = (user_id, username) => {
    this.setState({
      loggeduser_id: user_id
    })
  };
  render() {
    return (
      <div className="App">
        <div className={this.state.loadedstatus}>
        <div class="DesignHolder">
          <div class="LayoutFrame">
            <header className={this.state.headersize}>
              <div class="Center">
                <div class="site-logo">
                  <h1><a href="#">Git<span>C</span>onnect</a></h1>
                </div>
                <div id={this.state.isMobile ? 'mobile_sec' : ''}>
                  <div class={this.state.isMobile ? "mobile" : ''}><i className={this.state.isMobile ? "fa fa-bars" : ''}></i><i className={this.state.isMobile ? "fa fa-times" : ''}></i></div>
                  <div class={this.state.isMobile ? "menumobile" : ''}>
                    <nav class="Navigation">
                      <ul>
                        <li class="active">
                          <a href="#home">Home</a>
                          <span class="menu-item-bg"></span>
                        </li>
                        <li>
                          <a href="#about">About</a>
                          <span class="menu-item-bg"></span>
                        </li>
                        <li>
                          <a href="#services">Services</a>
                          <span class="menu-item-bg"></span>
                        </li>
                        <li>
                          <a href="#contact">Contact</a>
                          <span class="menu-item-bg"></span>
                        </li>
                        <li>
                          <a href="/newidea">New Idea</a>
                          <span class="menu-item-bg"></span>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
                <div class="clear"></div>
              </div>
            </header>
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
        </div>
      </div>
      </div>
    );
  }
}


export default App;
