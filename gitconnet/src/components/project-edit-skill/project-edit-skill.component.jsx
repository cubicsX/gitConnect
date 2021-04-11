import React from "react";
import "./project-edit-skill.style.scss";

import Card from "../card/card.component";

const ProjectEditSkill = (props) => {

  return (
    <div className="project-edit-skill">
      <Card key={props.id}>
        <span>{props.skill}</span>
        {props.children}
      </Card>
    </div>
  );
};

export default ProjectEditSkill;
