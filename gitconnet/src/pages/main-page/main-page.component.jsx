import React from "react";
import "./main-page.style.scss";

import { Link } from "react-router-dom";
import CustomButton from "../../components/custom-button/custom-button.component";

class MainPage extends React.Component {
  handleLogin() {
    let scope = "user"
    window.open(`https://github.com/login/oauth/authorize?client_id=b12992310cea8b04dcab&scope=${scope}`, "_self")
  }
  render() {
    return (
      <div className="main-page">
        <div className="main-background">
          <h1>gitConnect</h1>
        </div>
        <div className="login-button">
          <CustomButton
            title="Login"
            onClick={() => this.handleLogin()}
          />
        </div>
      </div>
    );
  }
}

export default MainPage;
