import React from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import "./header.style.scss";

import CustomButton from "../custom-button/custom-button.component";
import axios from "axios";
import { BASE_URL } from "../../constant";

const Header = (props) => {
  const history = useHistory()
  // async function signOut() {
  //   const response = await axios({
  //     method: "POST",
  //     url: `${BASE_URL}/signout`,
  //     withCredentials: true
  //   })
  //   history.push("/")
  // }
  return (
    <nav className="header">
      <div className="logo">
        <CustomButton title="GitConnect" />
      </div>
      <div className="options">
        <Link to="/search">
          <CustomButton title="Search" />
        </Link>
        <Link to="/profile">
          <CustomButton title="Profile" />
        </Link>
        <Link to="/projects">
          <CustomButton title="Project" />
        </Link>
        <Link to="/notifications">
          <CustomButton title="Notification" />
        </Link>
        <CustomButton title="Sign out" onClick={() => props.signOut()} />
      </div>
    </nav>
  );
};

export default Header;
