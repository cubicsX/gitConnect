import React, { Component } from 'react';
import axios from 'axios';
import StickyHeader from 'react-sticky-header';
import './css/header.css'
import './profile.css'
class general_profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: []
        }
        this.editprofile = this.editprofile.bind(this);
        console.log(this.state.user)
    }
    componentDidMount() {
        console.log('REQ')
        const t = this;
        let server = axios.create({
            baseURL: 'http://localhost:9000/api',
        })
        server.get('/user/profile')
            .then((res) => {
                console.log(res)
                let dt = []
                dt.push(res.data)
                t.setState({
                    user: dt
                }, () => this.props.prevskill(this.state.user[0].skills))
            })
            .catch(err => {
                console.log(err)
            })

    }
    editprofile = () => {
        this.props.history.push('/edit_profile')
    }
    render() {
        let comp_render
        if (this.state.user.length !== 0) {
            comp_render = (
                <>
                    <div class="profile-main">
                        <div class="profile-header">
                            <div class="user-detail">
                                <div class="user-image">
                                    <img src={this.state.user[0].avatar} alt="github_avatar" />
                                </div>
                                <div class="user-data">
                                    {this.state.user[0].name ? <h2>{this.state.user[0].name}</h2> : <h2>{this.state.user[0].username}</h2>}
                                    {this.state.user[0].linkedInProfile ? <p><h2><span class="post-label">{this.state.user[0].linkedInProfile}</span></h2></p> : null}
                                    <p><span class="post-label"> {this.state.user[0].githubProfile} </span></p>
                                </div>
                            </div>
                        </div>
                        <div class="tab-panel-main">
                            <ul class="tabs">
                                <li class="tab-link current" data-tab="Basic-detail">Profile</li>
                                <li class="tab-link current" data-tab="Edit-profile"><button onClick={this.editprofile} class="button2"> Edit profile</button></li>
                            </ul>
                            <div id="Basic-detail" class="tab-content current">
                                <div class="skill-box">
                                    <ul>
                                        <li><strong>My Core Skills:</strong></li>
                                        {this.state.user[0].skills.map((skval, index) =>
                                            <li key={index}>
                                                {skval.skill}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <div class="bio-box">
                                    <div class="heading">
                                        <p>Professional Bio
                                             <label>{this.state.user[0].githubProjects} project</label>
                                        </p>
                                    </div>
                                    <div class="desc">
                                        ore et dolore magna aliqua. Ut enim ad minim veniam,
                                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.
                                    </div>
                                </div>
                                <div class="detail-box">
                                    <p>Bookmarks of project</p>
                                    <ul class="ul-first">
                                        {this.state.user[0].bookmarks.map((skval, index) =>
                                            <li>
                                                <button key={index}>
                                                    {skval.projectTitle}
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
        else {
            console.log("nodata")
        }
        return (
            <>
                <StickyHeader
                    header={
                        <header className="smaller">
                            <div class="Center">
                                <div class="site-logo">
                                    <h1><a href="#">Git<span>C</span>onnect</a></h1>
                                </div>
                                <div id={this.state.isMobile ? 'mobile_sec' : ''}>
                                    <div class={this.state.isMobile ? "mobile" : ''}><i className={this.state.isMobile ? "fa fa-bars" : ''}></i><i className={this.state.isMobile ? "fa fa-times" : ''}></i></div>
                                    <div class={this.state.isMobile ? "menumobile" : ''}>
                                        <nav class="Navigation">
                                            <ul>
                                                <li>
                                                    <a href="/projectdisplay">Project Details</a>
                                                    <span class="menu-item-bg"></span>
                                                </li>
                                                <li>
                                                    <a href="/profile">Profile</a>
                                                    <span class="menu-item-bg"></span>
                                                </li>
                                                <li>
                                                    <a href="/dashboard">Dashboard</a>
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
                    }
                ></StickyHeader><br /><br /><br /><br /><br />
                {comp_render}
            </>
        )
    }
}

export default general_profile
