import React, { Component } from 'react';
import axios from 'axios';
import './css/header.css';
import StickyHeader from 'react-sticky-header';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 354,
    },
    media: {
        height: 140,
    },

}));

class dashbord extends Component {

    constructor(props) {
        super(props)

        this.state = {
            is_authenticated: true,//right know true but make it false onces in deploy
            is_username: '',
            project_list: [
                {
                    _id: "5f3a7be15a036f8d0c9021df",
                    projectTitle: "Test Project",
                    shortDesc: "Mahcine learning Porect",
                    githubRepo: "http://projectuser.com",
                    status: "active",
                    tags: [
                        {
                            "tag": "nothing"
                        }
                    ],
                    skillsRequired: [{ "skill": "node" }, { "skill": "python" }, { "skill": "machine learning" }],
                }
            ],
            searchtag: '',
            authority: 'collaborators',
            classes: useStyles
        }
        this.handlesearch = this.handlesearch.bind(this);
        this.handlechange = this.handlechange.bind(this);
        this.makerequest = this.makerequest.bind(this);
        this.bookmarks = this.bookmarks.bind(this);
    }

    handlesearch = (event) => {
        const t = this;
        let server = axios.create({
            baseURL: 'http://localhost:9000/api',
        })
        server.post('/project/search', { search: this.state.searchtag })
            .then((res) => {
                console.log(res);
                t.setState({
                    project_list: res.data,
                })
            })
            .catch(err => {
                window.alert(err)
            })

    }
    handlechange = (event) => {
        this.setState({
            searchtag: event.target.value
        })
    }
    makerequest = (event) => {
        //let data = { authority: this.state.authority, prjid: event.target.id }
        //make axious request for this data;
        let server = axios.create({
            baseURL: 'http://localhost:9000/api',
        })
        server.post('/project/join-project', {projectId: event.currentTarget.id})
            .then((res) => {
                if (res.status === 200) {
                    window.alert("Request made successfully")
                }
            })
            .catch(err => {
                window.alert(err)
            })
    }
    bookmarks = (event) => {
        let bookmark_data = { projectId: event.currentTarget.id, projectTitle: event.currentTarget.name }
        let server = axios.create({
            baseURL: 'http://localhost:9000/api',
        })
        server.post('/user/addbookmark', bookmark_data)
            .then((res) => {
                if (res.status === 200) {
                    window.alert("Bookmark added successfully")
                }
            })
            .catch(err => {
                window.alert(err)
            })
    }
    render() {
        return (
            <>
                <StickyHeader
                    // This is the sticky part of the header.
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
                ></StickyHeader><br/><br/><br/><br/><br/>

                <InputLabel htmlFor="component-simple">Search</InputLabel>
                <Input id="component-simple" value={this.state.searchtag} onChange={this.handlechange} />

                <form className={this.state.classes.root} noValidate autoComplete="off" >
                    <FormControl>

                        <Button onClick={this.handlesearch}>Search</Button>
                    </FormControl>
                </form>
                {this.state.project_list.map(items =>
                    (
                        <Card className={this.state.classes.root}>
                            <CardActionArea>
                                <CardMedia
                                    className={this.state.classes.media}
                                    image=""
                                    title="Contemplative Reptile"
                                />
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
                            </CardActionArea>
                            <CardActions>
                                <Button onClick={this.makerequest} id={items._id} size="Large" color="primary">
                                    Make Request
                            </Button>
                                <Button onClick={this.bookmarks} id={items._id} name={items.projectTitle} size="Large" color="primary">
                                    Bookmarks
                            </Button>
                            </CardActions>
                        </Card>
                    ))}
            </>
        )
    }
}

export default dashbord
