import React, { Component } from 'react';
import './Display.css';
class login extends Component {
    constructor(props) {
        super(props)
        this.state = {
             islogged:true
        }
        this.handleloginstatus =this.handleloginstatus.bind(this)
    }

    handleloginstatus = (event) => {
        //check for responce status ...here in this function and then update the islogged state
        if (this.state.islogged){
            this.props.history.push("/dashboard")
        }
        else{
            alert("Sorry invalid")
            this.props.history.push("/")
        }
    }
    render() {
        return (
            <div>
            <div className="row">
                <br/>
                <div className="column side">
                    <fon2> <h2 className="fon2">Our work</h2></fon2>
                        <p><fon>Lorem ipsum dolor sit amet, consectetur adipiscing elit..</fon></p>
                </div>
  
                <div className="column middle">
                    <fon2> <h2 className="fon2">Welcome !</h2></fon2>
                    <fon> <p><h4>We are here for you to solve your problem by helping you search your problem.In life you might not get chance to select the problem which you want to deal but we give you platform to search problem you want to work on solve it with all your desired  interest so get ready and connect with us</h4></p></fon>
                </div>
            </div>

        <div className="column.side">
            <fon2><h3 className="fon2">Start Exploring</h3></fon2>
            <p><button onClick={this.handleloginstatus}>Connect with <i className="fa fa-github"></i></button> </p>
        </div>
    </div>        )
    }
}
export default login
