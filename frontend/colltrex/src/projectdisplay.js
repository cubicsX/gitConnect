import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import StickyHeader from 'react-sticky-header';
import './css/header.css'
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 354,
    },
    media: {
        height: 140,
    },

}));
class projectdisplay extends Component {
    constructor(props) {
        super(props)

        this.state = {
            classes: useStyles,
            showowner: true,
            showcollobarator: false,
            owner: [
                {
                    _id: "5f3b9b0fc92d900f910cd259",
                    projectTitle: "New Project 1",
                    shortDesc: "React Website",
                    githubRepo: "http://projectuser.com",
                    status: "active",
                    tags: [
                        {
                            "tag": "nothing"
                        }
                    ],
                    skillsRequired: [
                        {
                            "skill": "node"
                        },
                        {
                            "skill": "python"
                        },
                        {
                            "skill": "machine learning"
                        },
                        {
                            "skill": "django"
                        }
                    ],
                    postDate: "2020-08-18T09:10:39.249Z",
                    developer: [
                        {
                            "userId": "5f3b648d3b5caed4fc82a7d3",
                            "authority": "owner",
                            "role": "empty",
                            "status": "accepted",
                            "username": "umang25011"
                        },
                        {
                            "userId": "5f3b76f82a46a843c4d3ed4e",
                            "authority": "contributer",
                            "role": "developer",
                            "username": "umang25011",
                            "status": "accepted"
                        }
                    ]
                }

            ],
            collaborator: [],
            incomerequest: [],
            rejectedrequest: [],
            acceptedrequest: [],
            pendingrequest: []
        }
        this.handleclick = this.handleclick.bind(this)
        this.handlerequest = this.handlerequest.bind(this)
    }
    handlerequest = (event)=>{
        let server = axios.create({
            baseURL: 'http://localhost:9000/api',
        })
        server.post('/project/requests',{userId:event.currentTarget.id,_id:event.currentTarget.name,status:event.currentTarget.className})
            .then((res) => {
                if(res.status===200){
                    window.alert("success")
                }

            })
            .catch(err => {
                window.alert(err)
            });
    }
    handleclick = (event) => {
        this.setState({
            showowner: !(this.state.showowner),
            showcollobarator: !(this.state.showcollobarator)
        })
    }
    componentDidMount() {
        let t = this;
        let server = axios.create({
            baseURL: 'http://localhost:9000/api',
        })
        server.post('/project/get-projects')
            .then((res) => {
                this.setState({
                    owner: res.data[0],
                    collaborator: res.data[1],
                });

            })
            .catch(err => {
                window.alert(err)
            });
    }

    render() {
        let owner_redner;
        let coll_render;
        let df = false;
        if (this.state.owner.length !== 0) {
            owner_redner = (
                <>
                    <h2>The List of Oweners Project </h2>
                    {this.state.owner.map(items =>
                        (
                            <Card className={this.state.classes.root}>
                                <CardActionArea>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            <div><div><lable>Project Title</lable> :  {items.projectTitle}</div><div><lable>Project Status</lable> :  {items.status}</div></div>
                                        </Typography>
                                    </CardContent>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            Project Description
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary" component="p">
                                            {items.shortDesc}
                                        </Typography>
                                    </CardContent>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            <lable>Project GitHub Repo Link</lable> : {items.githubRepo}
                                        </Typography>
                                    </CardContent>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            <lable>Number Of Developers</lable> : {items.developer.length}
                                        </Typography>
                                    </CardContent>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            <TableContainer component={Paper}>
                                                <Table aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>REQUIRED SKILLS </TableCell>
                                                            {items.skillsRequired.map(sk => <TableCell>{sk.skill}</TableCell>)}
                                                        </TableRow>
                                                    </TableHead>
                                                </Table>
                                            </TableContainer>
                                        </Typography>
                                    </CardContent>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            <TableContainer component={Paper}>
                                                <Table aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Associated Tags</TableCell>
                                                            {items.tags.map(sk => <TableCell>{sk.tag}</TableCell>)}
                                                        </TableRow>
                                                    </TableHead>
                                                </Table>
                                            </TableContainer>
                                        </Typography>
                                    </CardContent>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            <TableContainer component={Paper}>
                                                <Table aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>User Name</TableCell>
                                                            <TableCell>Status</TableCell>
                                                            <TableCell>Buttons</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    {items.developer.map(sk => (
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell>{sk.username}</TableCell>
                                                                <TableCell>{sk.status}</TableCell>
                                                                <TableCell>{sk.status === 'pending' ? <> <button id={sk.userId} name={items._id} className="accepted"  onClick={this.handlerequest} >Accept</button> {'  '} <button  id={sk.userId} name={items._id} className="rejected"  onClick={this.handlerequest}>Reject</button> </> : null}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    ))}
                                                </Table>
                                            </TableContainer>
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))}
                </>
            )
        }
        else {
            owner_redner = (
                <>
                    <h2>The List of Oweners Project </h2>
                    <h3>Theer Are No project To List You Can Start contributing now</h3>
                </>
            )
        }

        if (this.state.collaborator.length !== 0) {
            coll_render = (
                <>
                    <h2>The List of Collobrator Project </h2>
                    {this.state.collaborator.map(items =>
                        (
                            <Card className={this.state.classes.root}>
                                <CardActionArea>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            <div><div><lable>Project Title</lable> :  {items.projectTitle}</div><div><lable>Project Status</lable> :  {items.status}</div></div>
                                        </Typography>
                                    </CardContent>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            Project Description
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary" component="p">
                                            {items.shortDesc}
                                        </Typography>
                                    </CardContent>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            <lable>Project GitHub Repo Link</lable> : {items.githubRepo}
                                        </Typography>
                                    </CardContent>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            <lable>Number Of Developers</lable> : {items.developer.length}
                                        </Typography>
                                    </CardContent>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            <TableContainer component={Paper}>
                                                <Table aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>REQUIRED SKILLS </TableCell>
                                                            {items.skillsRequired.map(sk => <TableCell>{sk.skill}</TableCell>)}
                                                        </TableRow>
                                                    </TableHead>
                                                </Table>
                                            </TableContainer>
                                        </Typography>
                                    </CardContent>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            <TableContainer component={Paper}>
                                                <Table aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Associated Tags</TableCell>
                                                            {items.tags.map(sk => <TableCell>{sk.tag}</TableCell>)}
                                                        </TableRow>
                                                    </TableHead>
                                                </Table>
                                            </TableContainer>
                                        </Typography>
                                    </CardContent>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            <TableContainer component={Paper}>
                                                <Table aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>User Name</TableCell>
                                                            <TableCell>Status</TableCell>
                                                            <TableCell>Buttons</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    {items.developer.map(sk => (
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell>{sk.userId}</TableCell>
                                                                <TableCell>{sk.status}</TableCell>
                                                                <TableCell>{sk.status === 'accepted' ? <> <button>Accept</button> {'  '} <button>Reject</button> </> : null}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    ))}
                                                </Table>
                                            </TableContainer>
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))}
                </>
            )
        }
        else {
            coll_render = (
                <>
                    <h2>The List of Collobrators Project </h2>
                    <h3>Theer Are No project To List You Can Start contributing now</h3>
                </>
            )
        }


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
                                                    <a href="/profile">Profile</a>
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
                {owner_redner}
                {coll_render}
            </>
        )
    }
}

export default projectdisplay
