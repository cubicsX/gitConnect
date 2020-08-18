import React, { Component } from 'react';
import Skilltable from './Skill_table';
import SkillForm from './Skill_Form';
import TagForm from './Tag_form';
import Tagtable from './Tag_table';
import axios from 'axios';
class newidea extends Component {
    constructor(props) {
        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        let separator = '-'
        let todate = `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`;
        super(props)
        this.state = {
            Skills: [],
            Tags: [],
            status:'',
            newprojname:'',
            newprojdesc:'',
            newgiturl:'',
            date:todate,
        }
        this.removeSkill = this.removeSkill.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.newprojnamefun = this.newprojnamefun.bind(this);
        this.newprojdescfun = this.newprojdescfun.bind(this);
        this.newgiturlfun = this.newgiturlfun.bind(this);
        this.submitdetails = this.submitdetails.bind(this);
        this.handlechangeradio = this.handlechangeradio.bind(this);
        this.resetDetails = this.resetDetails.bind(this);
    }
    removeSkill = index => {
        let sk = this.state.Skills
        this.setState({
            Skills: sk.filter((sk, i) => {
                return i !== index;
            })
        });
    }
    removeTag = index => {
        let tg = this.state.Tags
        this.setState({
            Tags: tg.filter((tg, i) => {
                return i !== index;
            })
        });
    }
    handlechangeradio = (event)=>{
        this.setState({
            status:event.target.value
        })
    }
    newprojnamefun =(event)=>{
        this.setState({
            newprojname:event.target.value
        })
    }
    newprojdescfun =(event)=>{
        this.setState({
            newprojdesc:event.target.value
        })
    }
    newgiturlfun = (event) =>{
        this.setState({
            newgiturl:event.target.value
        })
    }
    handleSubmit = Skill => {
        this.setState({ Skills: [...this.state.Skills, Skill] });
    }
    handleSubmittag = Tag => {
        this.setState({ Tags: [...this.state.Tags, Tag] });
    }
    submitdetails = ()=>{
       let  projectData = {
           projectTitle:this.state.newprojname, 
           shortDesc:this.state.newprojdesc,
           githubRepo:this.state.newgiturl,
           status:this.state.status,
           tags:this.state.Tags,
           skillsRequired:this.state.Skills,
           postDate:new Date()
       }
        let server = axios.create({
            baseURL:'http://localhost:9000/api',
          })
        console.log(server.post('/project/addproject',projectData)
        .then((res)=>{
            if (res.status ===200) {
                alert('Success')
            }
       })
        .catch(err=>{
            window.alert(err)
        }))
        
        }
    resetDetails = ()=>{
    }
    render() {
        return (
                <>
                <h2>New Projects Details</h2>
                <p>Project Name:</p><input type="text" onChange={this.newprojnamefun} value ={this.state.newprojname}/><br />
                <p>Project Description:</p><input type="text" onChange={this.newprojdescfun} value ={this.state.newprojdesc} /><br />
                <p>Project Github URL:</p><input type="text"onChange={this.newgiturlfun} value ={this.state.newgiturl} /><br />
                <p>Project status:</p>
                <div onChange={this.handlechangeradio}>
                <input type="radio" name="status" value='active'  /><label for="active">active</label><br />
                <input type="radio" name="status" value='ongoing'/><label for="ongoing">ongoing</label><br />
                <input type="radio" name="status" value='hide' /><label for="hide">hide</label><br />
                </div>
                <Tagtable
                    tagdata={this.state.Tags}
                    removeTag={this.removeTag}
                />
                <TagForm handleSubmittag={this.handleSubmittag} />
                <Skilltable
                    skilldata={this.state.Skills}
                    removeSkill={this.removeSkill}
                />
                <SkillForm handleSubmit={this.handleSubmit} />
                <label>Your project post date</label> {this.state.date}
                <button type='button' onClick={this.submitdetails}>Save Project Details</button>
                <button type='button' onClick={this.resetDetails}>Discard Changes</button>
            </>
        )
    }
}
export default newidea
