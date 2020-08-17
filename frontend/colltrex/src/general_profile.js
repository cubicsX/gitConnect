import React, { Component } from 'react';
import Skilltable from './Skill_table';
import SkillForm from './Skill_Form';
import axios from 'axios';
import './profile.css'
class general_profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Skills: [],
            avatra_imgsrc: '',
            editprofilestate: false,
            linkedin: '',
            user: []
        }
        this.editprofile = this.editprofile.bind(this);
        this.removeSkill = this.removeSkill.bind(this);
        this.handlelinkedin = this.handlelinkedin.bind(this);
        this.savedetails = this.savedetails.bind(this);
        this.discardchanges = this.discardchanges.bind(this);
    }
    componentDidMount() {
        const t = this;
        let server = axios.create({
            baseURL: 'http://localhost:9000/api',
        })
        server.get('/user/profile')
            .then((res) => {
                t.setState({
                    user: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })
        this.state.user.map((skill_val) =>
            this.state.Skills.push({ skill: skill_val })
        )
    }
    handlelinkedin = event => {
        this.setState({
            linkedin: event.target.value
        })
    }
    editprofile = () => {
        //This open the state of edit profile.
        this.setState({
            editprofilestate: !this.state.editprofilestate,
        });
    }
    removeSkill = index => {
        let sk = this.state.Skills
        this.setState({
            Skills: sk.filter((sk, i) => {
                return i !== index;
            })
        });
    }

    handleSubmit = Skill => {
        this.setState({ Skills: [...this.state.Skills, Skill] });
    }
    savedetails = (event) => {
        event.preventDefault()
        let data = { 'link_id': this.state.linkedin, 'skills': this.state.Skills }
        axios.post('/updateprofile', data)
            .then((res) => {
                if (res === '200') {
                    alert("Your Data is updated successfully")
                    this.setState({
                        editprofilestate: !this.state.editprofilestate
                    })
                }
            })
            .catch((err) => {
                alert("Your Data was not uploaded the err is " + err)
            })
    }
    discardchanges = (event) => {
        this.setState({
            linkedin: '',
            Skills: []
        })
    }
    render() {
        let comp_render;
        if (this.state.editprofilestate) {
            comp_render = (
                <>
                    <h2>Edit Your Profile</h2>
                    <button>Ubdate Github Details</button><br />
                    <h3>Linked IN Profile:</h3>
                    <input type="text" onChange={this.handlelinkedin} value={this.state.linkedin} /><br />
                    <h3>Your Skills:</h3>
                    <Skilltable
                        skilldata={this.state.Skills}
                        removeSkill={this.removeSkill}
                    />
                    <h3>Add New Skill</h3>
                    <SkillForm handleSubmit={this.handleSubmit} />
                    <button onClick={this.savedetails}>Save Details</button>
                    <button onClick={this.discardchanges}>Discard Changes</button>
                    <button onClick={this.editprofile}>Close</button>

                </>
            )


        }
        else {
            comp_render =
                (
                    <>
                        <div class="gen_body">
                            <div class="profile-main">
                                <div class="profile-header">
                                    <div class="user-detail">
                                        <div class="user-image">
                                            <img src={this.state.user[0].avatar} alt="github_avatar" />
                                        </div>
                                        <div class="user-data">
                                            <h2>{this.state.user[0].name}</h2>
                                            <p><span class="post-label">{this.state.user[0].linkedInProfile}</span></p>
                                            <p><span class="post-label"> {this.state.user[0].githubProfile} </span></p>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-panel-main">
                                    <ul class="tabs">
                                        <li class="tab-link current" data-tab="Basic-detail">Profile</li>
                                        <li class="tab-link current" data-tab="Edit-profile"><button2 onClick={this.editprofile} class="button2"> <a href="">Edit Profile</a></button2></li>
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
							                <label>{this.state.user[0].githubProjects} project</label></p>
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
                                                                {skval.bookmark}
                                                            </button>
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>

                                    </div>

                                </div>

                            </div>
                        </div>
                    </>
                )
        }
        return (
            <>
                {comp_render}
            </>
        )
    }
}

export default general_profile
