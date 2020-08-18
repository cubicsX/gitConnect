import React, { Component } from 'react';
import Skilltable from './Skill_table';
import SkillForm from './Skill_Form';
import TagForm from './Tag_form';
import Tagtable from './Tag_table';
class projects extends Component {
    constructor(props) {
        super(props)
        this.state = {
            project_owener: [{ index: Math.random(), project_title: '', project_desc: '', dev_count: 0, status: '' }],
            project_contribute: [{ index: Math.random(), project_title: '', project_desc: '', total_dev: 0, status: '' }],
            editdetstate: false,
            newideastateprop: false,
            Skills: [],
            Tags: [],
        }
        this.editdetailstate = this.editdetailstate.bind(this);
        this.newideastate = this.newideastate.bind(this);
        this.removeSkill = this.removeSkill.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.newideaclose=this.newideaclose.bind(this);
        //this.projname = this.projname.bind(this);
        //this.projdesc =this.projdesc.bind(this);
        //this.giturlfun = this.giturlfun.bind(this);
    }
    editdetailstate = () => {
        this.setState({
            editdetstate: !this.state.editdetstate,
        })
    }
    newideastate = () => {
        this.setState({
            newideastateprop: !this.state.newideastateprop,
        })
    }
    newideaclose = ()=>{
        this.setState({
            newideastateprop: !this.state.newideastateprop,
            editdetstate: !this.state.editdetstate,
        })
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
    handleSubmit = Skill => {
        this.setState({ Skills: [...this.state.Skills, Skill] });
    }
    handleSubmittag = Tag => {
        this.setState({ Tags: [...this.state.Tags, Tag] });
    }

    render() {
        let comp_rend;
        if (this.state.newideastateprop) {
            comp_rend = (<>
                <h2>New Projects Details</h2>
                <button onClick={this.newideastate}>New Idea</button>
                <p>Project Name:</p><input type="text" onChange={this.newprojnamefun} value ={this.state.newprojname}/><br />
                <p>Project Description:</p><input type="text" onChange={this.newprojdescfun} value ={this.state.newprojdesc} /><br />
                <p>Project Github URL:</p><input type="text"onChange={this.newgiturlfun} value ={this.state.newgiturl} /><br />
                <p>Project status:</p>
                <input type="radio" name="status" value="active" /><label for="active">active</label><br />
                <input type="radio" name="status" value="ongoing" /><label for="ongoing">ongoing</label><br />
                <input type="radio" name="status" value="hide" /><label for="hide">hide</label><br />
                <Tagtable
                    tagdata={this.state.Tags}
                    removeTag={this.removeTag}
                />
                <h3>Add New Tag</h3>
                <TagForm handleSubmittag={this.handleSubmittag} />
                <Skilltable
                    skilldata={this.state.Skills}
                    removeSkill={this.removeSkill}
                />
                <h3>Add New Skill</h3>
                <SkillForm handleSubmit={this.handleSubmit} />
                <button>Save Project Details</button>
                <button>Discard Changes</button>
                <button onClick={this.newideaclose}>close</button>
            </>)
        }
        else if (this.state.editdetstate) {
            comp_rend = (<>
                <h2>Edit Projects Details</h2>
                <button onClick={this.newideastate}>New Idea</button>
                <p>Project Name:</p><input type="text" /><br />
                <p>Project Description:</p><input type="text" /><br />
                <p>Project Github URL:</p><input type="text" /><br />
                <p>Project status:</p>
                <input type="radio" name="status" value="active" /><label for="active">active</label><br />
                <input type="radio" name="status" value="ongoing" /><label for="ongoing">ongoing</label><br />
                <input type="radio" name="status" value="hide" /><label for="hide">hide</label><br />
                <Tagtable
                    tagdata={this.state.Tags}
                    removeTag={this.removeTag}
                />
                <h3>Add New Tag</h3>
                <TagForm handleSubmittag={this.handleSubmittag} />
                <Skilltable
                    skilldata={this.state.Skills}
                    removeSkill={this.removeSkill}
                />
                <h3>Add New Skill</h3>
                <SkillForm handleSubmit={this.handleSubmit} />
                <button>Update Project Details</button>
                <button>Discard Changes</button>
                <button onClick={this.editdetailstate}>close</button>
            </>)
        }
        else {
            comp_rend = (<>
                <div>
                    <h2>Project Owner</h2>
                    <ul>
                        {this.state.project_owener.map((poc, index) =>
                            <li key={poc.index}>
                                <p>{poc.project_title}</p><br />
                                <p>{poc.project_desc}</p><br />
                                <p>{poc.dev_count}</p><br />
                                <p>Status:{poc.status}</p><br />
                                <button onClick={this.editdetailstate}>Edit details</button>
                            </li>
                        )}
                    </ul>
                </div>

                <div>
                    <h2>Project contributions</h2>
                    <ul>
                        {this.state.project_contribute.map((poc, index) =>
                            <li key={poc.index}>
                                <p>{poc.project_title}</p><br />
                                <p>{poc.project_desc}</p><br />
                                <p>{poc.total_dev}</p><br />
                                <p>Status:{poc.status}</p><br />
                                <button>see details</button>
                            </li>
                        )}
                    </ul>
                </div>
            </>)
        }
        return (
            <>
                {comp_rend}
            </>
        )
    }
}

export default projects
