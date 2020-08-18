import React from 'react';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Tablebody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
const TableHeader = () => {
    return (
            <h1>Your Skill</h1>
    );
}
const TableBody = props => {
    const rows = props.skilldata.map((row, index) => {
        return (
                <TableRow>
                    <TableCell>{row.skill}</TableCell>
                    <TableCell><button onClick={() => props.removeSkill(index)} class='btn'>Delete</button></TableCell>
                </TableRow>
        );
    });

    return <tbody>{rows}</tbody>;
}
function Skill_table(props) {
    const { skilldata, removeSkill } = props;
    return (
        <div>
            <table>
                <TableHeader />
                <TableBody skilldata={skilldata} removeSkill={removeSkill} />
            </table>
        </div>
    )
}

export default Skill_table
