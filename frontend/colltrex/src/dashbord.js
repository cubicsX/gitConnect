import React, { Component } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import { spacing } from '@material-ui/system';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
const useStyles = makeStyles({
    root: {
        maxWidth: 354,
    },
    media: {
        height: 140,
    },
});
class dashbord extends Component {

    constructor(props) {
        super(props)

        this.state = {
            is_authenticated: true,//right know true but make it false onces in deploy
            is_username: '',
            project_list: [
                {
                    projectTitle: 'nma',
                    shortDesc: 'nma',
                    githubRepo: 'https://www.google.com/',
                    status: 'active',
                    tags: [{ tag: 'google' }, { tag: 'google' }, { tag: 'google' }],
                    skillsRequired: [{ skill: 'kill' }, { skill: 'kill' }]
                },
                {
                    projectTitle: 'nma',
                    shortDesc: 'nma',
                    githubRepo: 'https://www.google.com/',
                    status: 'active',
                    tags: [{ tag: 'google' }, { tag: 'google' }, { tag: 'google' }],
                    skillsRequired: [{ skill: 'kill' }, { skill: 'kill' }]
                }
            ],
            searchtag: '',
            authority: 'collaborators',
            classes: useStyles
        }
        this.handlesearch = this.handlesearch.bind(this);
        this.handlechange = this.handlechange.bind(this);
        this.makerequest = this.makerequest.bind(this);
    }

    componentDidMount() {
        this.props.userid(this.state.is_user_id, this.state.is_username)
    }
    handlesearch = (event) => {
        let server = axios.create({
            baseURL: 'http://localhost:9000/api',
        })
        server.post('/project/search', { search: this.state.searchtag })
            .then((res) => {
                console.log(res)
                this.setState({
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
        let data = { authority: this.state.authority, prjid: event.target.id }
        //make axious request for this data;
    }
    render() {


        return (
            <div mx="auto">
                <input type='text'
                    value={this.state.searchtag}
                    onChange={this.handlechange}
                    placeholder="Example python,python+react,..use only symbol(+)" />
                <button onClick={this.handlesearch}>Search</button>
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
                                            <Table  aria-label="simple table">
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
                                            <Table  aria-label="simple table">
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
                            <Button id  = {items._id} size="Large" color="primary">
                                Make Request
                            </Button>
                        </CardActions>
                    </Card>
                    ))}
            </div>
        )
    }
}

export default dashbord
