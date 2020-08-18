import React, { Component } from 'react';

class Tag_form extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             tag:'',
        }
        this.handlechange = this.handlechange.bind(this);
    }
    handlechange = event => {
        this.setState({
            tag : event.target.value,
        });
    }
    onFormSubmit = (event) => {
        event.preventDefault();
        this.props.handleSubmittag(this.state);
        this.setState(this.state);
    }
    render() {
        return (
            <>
                <form onSubmit = {this.onFormSubmit}>
                    <label for="Skill">TAG</label>
                    <input 
                        type="text"
                        name="tag"
                        id="tag"
                        value={this.state.tag}
                        onChange ={this.handlechange}/>
                    <button type='submit'>ADD TAG</button>
                </form>
            </>
        )
    }
}

export default Tag_form
