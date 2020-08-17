import React, { Component } from 'react';
import Skilltable from './Skill_table';
import SkillForm from './Skill_Form';
import axios from 'axios';
class general_profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_id:this.props.univ_userid,
            Skills: [],
            avatra_imgsrc: '',
            editprofilestate: false,
            linkedin: '',
            user:[]

        }
        this.editprofile = this.editprofile.bind(this);
        this.removeSkill = this.removeSkill.bind(this);
        this.handlelinkedin = this.handlelinkedin.bind(this);
        this.savedetails = this.savedetails.bind(this);
        this.discardchanges = this.discardchanges.bind(this);
    }
    componentDidMount(){
        axios.post('/getuser',{user_id:this.state.user_id})
        .then(res=>{
            if (res.status ==='success'){
                //userdata object
            }   
        })
        this.state.user[0].map((skill_val)=>
            this.state.Skills.push({skill:skill_val})
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
                        <h1>General Details</h1>
                        <img src={this.state.user[0].avatar} alt="github_avatar" />
                        <h2>Name:</h2>&lt;{this.state.user[0].name}&gt;<br />
                        <h2>username:</h2>&lt;{this.state.user[0].username}&gt;<br />
                        <h2>email ID:</h2>&lt;{this.state.user[0].email}&gt;<br />
                        <h2>github Profile:</h2>&lt;{this.state.user[0].githubProfile}&gt;<br />
                        <h2>linked_in Profile:</h2>&lt;{this.state.user[0].linkedInProfile}&gt;<br />
                        <h2>Skills</h2>
                        <ul>
                            {this.state.Skills.map((skval, index) =>
                                <li key={index}>
                                    {skval.skill}
                                </li>
                            )}
                        </ul>
                        <button onClick={this.editprofile}>Edit Profile</button>
                    </>
                )
        }
        return (
            <div className="General-Profile">
                {comp_render}
            </div>
        )
    }
}

export default general_profile
