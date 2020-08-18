import React, { Component } from 'react';
import Skilltable from './Skill_table';
import SkillForm from './Skill_Form';
import axios from 'axios';
class edit_profile extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            Skills:this.props.skill,
            linkedin: '',
        }
        this.removeSkill = this.removeSkill.bind(this);
        this.handlelinkedin = this.handlelinkedin.bind(this);
        this.savedetails = this.savedetails.bind(this);
        this.discardchanges = this.discardchanges.bind(this);
        this.editprofile = this.editprofile.bind(this);
        this.updategitprofile = this.updategitprofile(this);
    }
    handlelinkedin = event => {
        this.setState({
            linkedin: event.target.value
        })
    }
    editprofile =(event)=>{
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
    updategitprofile = () =>{
        let server = axios.create({
            baseURL: 'http://localhost:9000/api',
        })
        server.get('/user/update-github')
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
    handleSubmit = Skill => {
        this.setState({ Skills: [...this.state.Skills, Skill] });
    }
    savedetails = (event) => {
        event.preventDefault()
        let server = axios.create({
            baseURL: 'http://localhost:9000/api',
        })
        let data = {'linkedInProfile': this.state.linkedin, 'skills': this.state.Skills }
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
    discardchanges = (event) => {
        this.setState({
            linkedin: '',
            Skills: []
        })
    }
    
    render() {
        return (
            <>
            <h2>Edit Your Profile</h2>
            <button onClick={this.updategitprofile}>Ubdate Github Details</button><br />
            <h3>Linked IN Profile:</h3>
            <input type="text" onChange={this.handlelinkedin} value={this.state.linkedin} /><br />
            <Skilltable
                skilldata={this.state.Skills}
                removeSkill={this.removeSkill} />
            <SkillForm handleSubmit={this.handleSubmit} />
            <button onClick={this.savedetails}>Save Details</button>
            <button onClick={this.discardchanges}>Discard Changes</button>
            <button onClick={this.editprofile}>Close</button>
            </>
        )
    }
}

export default edit_profile
