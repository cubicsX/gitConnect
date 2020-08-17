import React from 'react';

const TableHeader = () => {
    return (
        <thead>
            <tr>
                <th>Tags</th>
            </tr>
        </thead>
    );
}
const TableBody = props => {
    const rows = props.tagdata.map((row, index) => {
        return (
            <tr key={index}>
                <td>{row.tag}</td>
                <td><button onClick={() => props.removeTag(index)}>Delete</button></td>
            </tr>
        );
    });

    return <tbody>{rows}</tbody>;
}
function Tag_table(props) {
    const { tagdata, removeTag } = props;
    return (
        <div>
            <table>
                <TableHeader />
                <TableBody tagdata={tagdata} removeTag={removeTag} />
            </table>
        </div>
    )
}

export default Tag_table
