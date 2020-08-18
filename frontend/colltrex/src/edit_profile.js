import React, { Component } from 'react';
import Skilltable from './Skill_table';
import SkillForm from './Skill_Form';
import StickyHeader from 'react-sticky-header';
import './css/header.css'
import './edit_prof.css'
import axios from 'axios';
class edit_profile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Skills: this.props.skill,
            linkedin: '',
        }
        this.removeSkill = this.removeSkill.bind(this);
        this.handlelinkedin = this.handlelinkedin.bind(this);
        this.savedetails = this.savedetails.bind(this);
        this.editprofile = this.editprofile.bind(this);
        this.updategitprofile = this.updategitprofile(this);
    }
    handlelinkedin = event => {
        this.setState({
            linkedin: event.target.value
        })
    }
    editprofile = (event) => {
        this.props.history.push('/profile')
    }
    removeSkill = index => {
        let sk = this.state.Skills
        this.setState({
            Skills: sk.filter((sk, i) => {
                return i !== index;
            })
        });
    }
    updategitprofile = () => {
        let server = axios.create({
            baseURL: 'http://localhost:9000/api',
        })
        server.get('/user/update-github')
            .then((res) => {
                if (res.status === 200) {
                    alert("Your Data is Gitup data updated successfully")
                }
            })
            .catch((err) => {
                alert("Your Data was not uploaded the err is " + err)
            })


    }
    handleSubmit = Skill => {
        this.setState({ Skills: [...this.state.Skills, Skill] });
    }
    savedetails = (event) => {
        event.preventDefault()
        let server = axios.create({
            baseURL: 'http://localhost:9000/api',
        })
        let data = { 'linkedInProfile': this.state.linkedin, 'skills': this.state.Skills }
        server.put('/user/profile', data)
            .then((res) => {
                if (res.status === 200) {
                    alert("Your Data is updated successfully")
                    this.props.history.push('/profile')
                }
            })
            .catch((err) => {
                alert("Your Data was not uploaded the err is " + err)
            })
    }

    render() {
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
                <div class="user">
                <header class="user__header">
                    <h1 class="user__title">Edit profile</h1>
                </header>
                <div class="form">
                    <h3>Linked IN Profile:</h3>
                    <div class="form__group">
                        <input type="text" onChange={this.handlelinkedin} value={this.state.linkedin} placeholder="Linkedin profile" class="form__input" />
                    </div>

                    <div class="form__group">
                        <SkillForm handleSubmit={this.handleSubmit} />
                    </div>
                    <Skilltable
                        skilldata={this.state.Skills}
                        removeSkill={this.removeSkill}
                    />
                    <button class="btn" onClick={this.savedetails}>Save Details</button>
                    <button  class="btn" onClick={this.editprofile}>Close</button>
                </div>
                </div>
            </>
        )
    }
}

export default edit_profile
