import React, { Component } from 'react';

class Skill_Form extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             skill:'',
        }
        this.handlechange = this.handlechange.bind(this)
    }
    handlechange = event => {
        this.setState({
            skill : event.target.value
        });
    }
    onFormSubmit = (event) => {
        event.preventDefault();
        this.props.handleSubmit(this.state);
        this.setState(this.state);
    }
    render() {
        return (
            <>
                <form onSubmit = {this.onFormSubmit}>
                    <label for="Skill">Skill</label>
                    <input 
                        type="text"
                        name="skill"
                        id="skill"
                        value={this.state.skill}
                        onChange ={this.handlechange}/>
                    <button type='submit'>ADD SKILL</button>
                </form>
            </>
        )
    }
}

export default Skill_Form
