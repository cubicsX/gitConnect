import React from "react";
import "./projectcardview.style.scss";

import Card from "../card/card.component";

const moreSkillTag = (total_skill) => {
  if (total_skill - 5 > 0) {
    return (
      <Card>
        <span className="project-skill">`${total_skill - 5} More`</span>
      </Card>
    );
  }
};

const ProjectCardView = (props) => {
  return (
    <div className="project-card-view">
      <h2 className="project-title">{props.projectTitle}</h2>
      <span className="project-discription">{props.projectDescription}</span>
      <br />
      <br />
      <div className="skills-block">
        {props.projectSkills.slice(0, 5).map((skill) => (
          <Card>
            <span className="project-skill">{skill}</span>
          </Card>
        ))}
        {props.projectSkills.length - 5 > 0 ? (
          <Card>
            <span className="project-skill">
              +{props.projectSkills.length - 5} More
            </span>
          </Card>
        ) : null}
      </div>
      <div className="opening-block">
        <Card>
          <span className="opening-number">
            Openings Available: {props.projectOpenings}
          </span>
        </Card>
      </div>
      <br />
      <br />
      {props.children}
    </div>
  );
};

export default ProjectCardView;
