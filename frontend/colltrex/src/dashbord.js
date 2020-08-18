import React, { Component } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from "@material-ui/core/Grid";
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
import TextField from "@material-ui/core/TextField";
import Paper from '@material-ui/core/Paper';
import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
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
