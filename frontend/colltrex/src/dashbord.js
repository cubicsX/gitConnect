import React, { Component } from 'react';
import axios from 'axios';
class dashbord extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             is_authenticated:true ,//right know true but make it false onces in deploy
             is_username:'',
             project_list:[],
             searchtag:'',
             authority:'collaborators',
        }
        this.handlesearch = this.handlesearch.bind(this);
        this.handlechange = this.handlechange.bind(this);
        this.makerequest = this.makerequest.bind(this);
    }
    
    componentDidMount(){
        let server = axios.create({
            baseURL:'http://localhost:9000/api',
          })
        server.post('/user/profile')
        .then((res)=>{
            console.log(res)
        })
        .catch(err=>{
            window.alert(err)
        })
        this.props.userid(this.state.is_user_id,this.state.is_username)
    }
    handlesearch = (event)=>{
        //make a request 
        this.setState({
            project_list:'X',
        })
    }
    handlechange =(event)=>{
        this.setState({
            searchtag:event.target.value
        })
    }
    makerequest =(event)=>{
        let data = {authority:this.state.authority,prjid:event.target.id}
        //make axious request for this data;
    }
    render() {
        return (
            <div>
               <input type='text' 
               value={this.state.searchtag} 
               onChange={this.handlechange} 
               placeholder="Example python,python+react,..use only symbol(+)"/> 
               <button onClick={this.handlesearch}>Search</button>
               <button onClick = {this.makerequest} id= 'projectid'> Make Request </button>
            </div>
        )
    }
}

export default dashbord
