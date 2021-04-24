import "./App.css"
import Header from "./components/header/header.component"
import PageNotFound from "./pages/404Page/404Page.component"
import UserProfile from "./pages/user-profile/user-profile.component"
import UserProject from "./pages/user-project/user-project.component"
import Notification from "./pages/notification/notification.component"
import SearchPage from "./pages/search-page/search-page.component"
import MainPage from "./pages/main-page/main-page.component"
import React, { useState } from "react"
import { BASE_URL } from "./constant"
import { Switch, BrowserRouter as Router, Route, Redirect } from "react-router-dom"
import axios from "axios"
import PublicProfile from "./pages/public-profile/public-profile.component"
import { setUpNotificationFlow } from "./utils/InitializeFireabse"

{
	/* < Route {...rest} component={(props) => (
  auth ? (
    
    // <Component {...props} />
  ) : (
      

      // <Redirect to="/" />
    )
)
} /> */
}
function PrivateRoute({ auth, component: Component, ...rest }) {
	return (
		<Route
			{...rest}
			render={(props) =>
				auth === true ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: "/",
						}}
					/>
				)
			}
		/>
	)
}
class App extends React.Component {
	constructor() {
		super()
		this.state = {
			login: false,
		}
		this.signOut = this.signOut.bind(this)
	}
	async signOut() {
		const response = await axios({
			method: "POST",
			url: `${BASE_URL}/signout`,
			withCredentials: true,
		})
		this.setState({
			login: false,
		})
	}
	async componentDidMount() {
		const response = await axios({
			method: "POST",
			url: `${BASE_URL}/page-validation`,
			withCredentials: true,
		})
		if (response.data.status === "OK") {
			// to initialize firebase for notification
			setUpNotificationFlow()
      axios({
        method: "GET",
        withCredentials: true,
        url: `${BASE_URL}/firebase-view`,
      })
			setInterval(() => {
				axios({
					method: "GET",
					withCredentials: true,
					url: `${BASE_URL}/firebase-view`,
				})
			}, 20000)
			this.setState({
				login: true,
			})
		} else if (response.data.status === "ERROR") {
			//
			this.setState({
				login: false,
			})
		}
	}

	renderPage() {
		return (
			<Router>
				<Header signOut={this.signOut} />
				<br />
				<br />
				<Switch>
					<Route exact path="/">
						<MainPage />
					</Route>
					<PrivateRoute auth={this.state.login} exact path="/search" component={SearchPage} />
					<PrivateRoute auth={this.state.login} exact path="/profile" component={UserProfile} />
					<PrivateRoute auth={this.state.login} exact path="/projects" component={UserProject} />
					<PrivateRoute auth={this.state.login} exact path="/notifications" component={Notification} />
					<PrivateRoute auth={this.state.login} exact path="/public-profile/:user_id" component={PublicProfile} />
					<Route component={PageNotFound} />
				</Switch>
			</Router>
		)
	}

	render() {
		return <div className="App">{this.renderPage()}</div>
	}
}

export default App
