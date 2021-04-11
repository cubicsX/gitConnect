import React from "react";
import "./user-project.style.scss";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Select from "react-select";

import TextCard from "../../components/text-card/text-card.component";
import CustomButton from "../../components/custom-button/custom-button.component";
import CardGrid from "../../components/cardgrid/cardgrid.component";
import CardList from "../../components/cardlist/cardlist.component";
import Card from "../../components/card/card.component";
import ProjectCardView from "../../components/projectcardview/projectcardview.component";
import VerticalScroll from "../../components/vertical-scroll/vertical-scroll.component";
import SkillCard from "../../components/skill-card/skill-card.component";
import FormInput from "../../components/form-input/form-input.component";
import ProjectEditSkill from "../../components/project-edit-skill/project-edit-skill.component";
import CancelButton from "../../components/cancel-button/cancel-button.component";
import FormTextbox from "../../components/form-textbox/form-textbox.component";
import FormTextArea from "../../components/form-textarea/form-textarea.component";
import axios from "axios";
import { BASE_URL } from "../../constant";

const customStyles = {
  menu: (provided, state) => ({
    ...provided,
    width: state.selectProps.width,
    borderBottom: "1px dotted pink",
    color: state.selectProps.menuColor,
    padding: 20,
  }),

  control: (_, { selectProps: { width } }) => ({
    width: width,
  }),

  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";

    return { ...provided, opacity, transition };
  },
};

class UserProject extends React.Component {
  constructor(props) {
    super();

    this.state = {
      isAddProject: false,
      isEditProject: false,
      editProjectKey: null,
      tempSkill: "",
      newProjectTitle: "",
      newProjectDescription: "",
      newOpenings: "",
      newProjectSkills: [],
      selectedOption: null,
      github_projects: [
        { value: "project-1", label: "project-1" },
        { value: "project-2", label: "project-2" },
        { value: "project-3", label: "project-3" },
        { value: "project-4", label: "project-4" },
        { value: "project-5", label: "project-5" },
        { value: "project-6", label: "project-6" },
        { value: "project-7", label: "project-7" },
      ],
      projects: [],
    };
  }
  async componentDidMount() {
    const response = await axios({
      method: "GET",
      url: `${BASE_URL}/fetch-project-list`,
      withCredentials: true
    })

    this.setState({
      "github_projects": response.data
    })
    const list_project = await axios({
      method: "get",
      url: `${BASE_URL}/list-project`,
      withCredentials: true,
    })
    this.setState({
      "projects": list_project.data
    })

  }
  async save_details() {
    const response = await axios({
      method: "POST",
      url: `${BASE_URL}/project`,
      data: {
        "projectTitle": this.state.newProjectTitle,
        "projectDescription": this.state.newProjectDescription,
        "projectSkills": this.state.newProjectSkills,
        "projectOpenings": this.state.newOpenings,
      },
      withCredentials: true
    })
    this.setState({
      isAddProject: false,
      projects: this.state.projects,
      newProjectTitle: "",
      newProjectDescription: "",
      newProjectSkills: [],
      newOpenings: "",
    });
    const list_project = await axios({
      method: "get",
      url: `${BASE_URL}/list-project`,
      withCredentials: true,
    })
    this.setState({
      "projects": list_project.data
    })
    this.successNotification();
  }
  async update_details(id) {
    const response = await axios({
      method: "PUT",
      url: `${BASE_URL}/project`,
      data: this.state.projects[id],
      withCredentials: true
    })
    this.setState({ "isEditProject": false })
    this.successNotification();
  }
  async remove_details(id) {

    const response = await axios({
      method: "DELETE",
      url: `${BASE_URL}/project`,
      data: {
        "_id": this.state.projects[id]["_id"],
      },
      withCredentials: true
    })
    const list_project = await axios({
      method: "get",
      url: `${BASE_URL}/list-project`,
      withCredentials: true,
    })
    this.setState({
      "projects": list_project.data
    })
    this.removeNotification()
  }

  resetKey() {
    this.state.projects.forEach((project, i) => {
      project.key = i + 1;
    });
  }

  removeProject = (id) => {
    this.setState({
      projects: this.state.projects.filter((project) => {
        return project.key !== id;
      }),
    });
  };

  addSkill = (id) => {
    this.state.projects[id].projectSkills.unshift(this.state.tempSkill);
    this.setState(({ projects }) => ({
      projects: [
        ...projects.slice(0, id),
        {
          ...projects[id],
          projectSkills: this.state.projects[id].projectSkills,
        },
        ...projects.slice(id + 1),
      ],
      tempSkill: "",
    }));
  };

  removeSkill = (remove_skill, id) => {
    this.setState(({ projects }) => ({
      projects: [
        ...projects.slice(0, id),
        {
          ...projects[id],
          projectSkills: this.state.projects[id].projectSkills.filter((skill) => {
            return skill !== remove_skill;
          }),
        },
        ...projects.slice(id + 1),
      ],
    }));
  };

  editProjectDetails = (id) => {
    return (
      <div className="edit-project-section">
        <br />
        <CardGrid gridColumn="1fr 1fr">
          <Card>
            <VerticalScroll height="500px">
              <div className="title-section">
                <div className="title-card">
                  <Card>
                    <h3>Title</h3>
                  </Card>
                </div>
                <div className="title-input">
                  <FormInput
                    placeholder="Enter Title"
                    value={this.state.projects[id].projectTitle}
                  // onChange={(e) => {
                  //   this.setState(({ projects }) => ({
                  //     projects: [
                  //       ...projects.slice(0, id),
                  //       {
                  //         ...projects[id],
                  //         projectTitle: e.target.value,
                  //       },
                  //       ...projects.slice(id + 1),
                  //     ],
                  //   }));
                  // }}
                  />
                </div>
              </div>
              <br />
              <br />
              <div className="discription-section">
                <div className="discription-card">
                  <Card>
                    <h3>Description</h3>
                  </Card>
                </div>
                <div className="discription-input">
                  <FormTextArea
                    placeholder="Enter Description"
                    value={this.state.projects[id].projectDescription}
                    onChange={(e) => {
                      this.setState(({ projects }) => ({
                        projects: [
                          ...projects.slice(0, id),
                          {
                            ...projects[id],
                            projectDescription: e.target.value,
                          },
                          ...projects.slice(id + 1),
                        ],
                      }));
                    }}
                  />
                </div>
              </div>
              <br />
              <br />
              <div className="opening-section">
                <div className="opening-card">
                  <Card>
                    <h3>Openings</h3>
                  </Card>
                </div>
                <div className="opening-input">
                  <FormInput
                    placeholder="Enter Project Opening"
                    value={this.state.projects[id].projectOpenings}
                    onChange={(e) => {
                      this.setState(({ projects }) => ({
                        projects: [
                          ...projects.slice(0, id),
                          {
                            ...projects[id],
                            projectOpenings: e.target.value,
                          },
                          ...projects.slice(id + 1),
                        ],
                      }));
                    }}
                  />
                </div>
              </div>
            </VerticalScroll>
          </Card>
          <Card>
            <h2 className="inner-header">Required Skill</h2>
            <div className="add-new-skill">
              <div className="add-new-skill-input">
                <FormInput
                  placeholder="Skill"
                  value={this.state.tempSkill}
                  onChange={(e) => {
                    this.setState({ tempSkill: e.target.value });
                  }}
                />
              </div>
              <CustomButton
                title="Add Skill"
                onClick={() => this.addSkill(id)}
              />
            </div>
            <br />
            <br />
            <div className="user-project-edit-skill">
              <VerticalScroll height="300px">
                <CardGrid gridColumn="1fr 1fr 1fr">
                  {this.state.projects[id].projectSkills.map((skill) => {
                    return (
                      <ProjectEditSkill skill={skill}>
                        <CancelButton
                          onClick={() => this.removeSkill(skill, id)}
                        />
                      </ProjectEditSkill>
                    );
                  })}
                </CardGrid>
              </VerticalScroll>
            </div>
          </Card>
        </CardGrid>
        <br />
        <div className="custom-save">
          <CustomButton
            title="Save Details"
            onClick={() => {
              this.update_details(id)
            }}
          />
        </div>
        <br />
      </div>
    );
  };

  selectProject = (selectedOption) => {
    this.setState({ newProjectTitle: selectedOption.value });
  };

  addNewProject = () => {
    return (
      <div className="add-project-section">
        <br />
        <CardGrid gridColumn="1fr 1fr">
          <Card>
            <VerticalScroll height="500px">
              <div className="title-section">
                <div className="title-card">
                  <Card>
                    <h3>Title</h3>
                  </Card>
                </div>
                <Select
                  className="dropdown"
                  options={this.state.github_projects}
                  onChange={this.selectProject}
                  placeholder="Select Project"
                  styles={customStyles}
                />
              </div>
              <br />
              <br />
              <div className="discription-section">
                <div className="discription-card">
                  <Card>
                    <h3>Description</h3>
                  </Card>
                </div>
                <div className="discription-input">
                  <FormTextArea
                    placeholder="Enter Discription"
                    value={this.state.newProjectDescription}
                    onChange={(e) => {
                      this.setState({ newProjectDescription: e.target.value });
                    }}
                  />
                </div>
              </div>
              <br />
              <br />
              <div className="opening-section">
                <div className="opening-card">
                  <Card>
                    <h3>Openings</h3>
                  </Card>
                </div>
                <div className="opening-input">
                  <FormInput
                    placeholder="Openings"
                    value={this.state.newOpenings}
                    onChange={(e) => {
                      this.setState({ newOpenings: e.target.value });
                    }}
                  />
                </div>
              </div>
            </VerticalScroll>
          </Card>
          <Card>
            <h2 className="inner-header">Required Skill</h2>
            <div className="add-new-skill">
              <div className="add-new-skill-input">
                <FormInput
                  placeholder="Skill"
                  value={this.state.tempSkill}
                  onChange={(e) => {
                    this.setState({ tempSkill: e.target.value });
                  }}
                />
              </div>
              <CustomButton
                title="Add Skill"
                onClick={() => {
                  this.state.newProjectSkills.unshift(this.state.tempSkill);
                  this.setState({
                    newProjectSkills: this.state.newProjectSkills,
                    tempSkill: "",
                  });
                }}
              />
            </div>
            <br />
            <br />
            <div className="user-project-edit-skill">
              <VerticalScroll height="300px">
                <CardGrid gridColumn="1fr 1fr 1fr">
                  {this.state.newProjectSkills.map((skill) => {
                    return (
                      <ProjectEditSkill skill={skill}>
                        <CancelButton
                          onClick={() => {
                            this.setState({
                              newProjectSkills: this.state.newProjectSkills.filter(
                                (newSkill) => {
                                  return newSkill !== skill;
                                }
                              ),
                            });
                          }}
                        />
                      </ProjectEditSkill>
                    );
                  })}
                </CardGrid>
              </VerticalScroll>
            </div>
          </Card>
        </CardGrid>
        <br />
        <div className="add-remove-project">
          <CardGrid gridColumn="1fr 1fr">
            <div className="custom-save">
              <CustomButton
                title="Save Details"
                onClick={() => { this.save_details() }}
              />
            </div>
            <div className="discard-save">
              <CustomButton
                title="Discard Project"
                onClick={() => {
                  this.setState({
                    isAddProject: false,
                    newProjectTitle: "",
                    newProjectDescription: "",
                    newProjectSkills: [],
                    newOpenings: "",
                  });
                  this.discardNotification();
                }}
              />
            </div>
            <br />
          </CardGrid>
        </div>
      </div>
    );
  };

  renderProjects() {
    return (
      <div className="projects-section">
        <VerticalScroll height="600px">
          <CardList>
            {
              (
                this.state.projects.map((project, project_id) => (
                  <ProjectCardView
                    projectTitle={project.projectTitle}
                    projectDescription={project.projectDescription}
                    projectSkills={project.projectSkills}
                    projectOpenings={project.projectOpenings}
                  >
                    <CardGrid gridColumn="1fr 1fr">
                      <CustomButton
                        title="Edit Details"
                        onClick={() => (
                          this.resetKey(),
                          this.setState({
                            isEditProject: true,
                            editProjectKey: project.key,
                          })
                        )}
                      />
                      <CustomButton
                        title="Remove Project"
                        onClick={() => {
                          this.resetKey();
                          this.remove_details(project_id)
                        }

                          // this.removeProject(project.key),
                          // this.removeNotification()
                        }
                      />
                    </CardGrid>
                  </ProjectCardView>
                )))
            }
          </CardList>
        </VerticalScroll>
      </div>
    );
  }

  renderChoice() {
    if (this.state.isEditProject) {
      return this.editProjectDetails(this.state.editProjectKey - 1);
    } else {
      if (this.state.isAddProject) {
        return this.addNewProject();
      } else {
        return this.renderProjects();
      }
    }
  }

  successNotification() {
    toast.success("Project Successfully Saved.");
  }

  discardNotification() {
    toast.warning("Project Details Discard.");
  }

  removeNotification() {
    toast.error("Project Removed.");
  }

  renderMainButton() {
    if (this.state.isEditProject) {
      return (
        <CustomButton
          title="Save Details"
          onClick={() => {
            this.setState({ isEditProject: false });
            this.successNotification();
          }}
        />
      );
    } else {
      if (this.state.isAddProject) {
        <CustomButton
          title="Save Details"
          onClick={() => {
            this.setState({ isAddProject: false });
            this.successNotification();
          }}
        />;
      } else {
        return (
          <CustomButton
            title="Add Project"
            onClick={() => {
              this.setState({ isAddProject: true });
            }}
          />
        );
      }
    }
  }

  render() {
    toast.configure();
    return (
      <div className="user-project">
        <div className="project-header">
          <TextCard text="Projects" />
          {this.renderMainButton()}
        </div>
        <br />
        <br />
        <Card>{this.renderChoice()}</Card>
      </div>
    );
  }
}

export default UserProject;
