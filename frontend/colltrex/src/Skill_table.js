import React from 'react'
const TableHeader = () => {
    return (
        <thead>
            <tr>
                <th>SKILL</th>
            </tr>
        </thead>
    );
}
const TableBody = props => {
    const rows = props.skilldata.map((row, index) => {
        return (
            <tr key={index}>
                <td>{row.skill}</td>
                <td><button onClick={() => props.removeSkill(index)}>Delete</button></td>
            </tr>
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
