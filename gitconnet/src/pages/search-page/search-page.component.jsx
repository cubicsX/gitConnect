import React from "react";
import "./search-page.style.scss";

import FormInput from "../../components/form-input/form-input.component";
import Card from "../../components/card/card.component";
import VerticalScroll from "../../components/vertical-scroll/vertical-scroll.component";
import CardList from "../../components/cardlist/cardlist.component";
import ProjectCardView from "../../components/projectcardview/projectcardview.component";
import CustomButton from "../../components/custom-button/custom-button.component";
import CardGrid from "../../components/cardgrid/cardgrid.component";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BASE_URL } from "../../constant";

class SearchPage extends React.Component {
  constructor() {
    super();

    this.state = {
      searchQuery: "",
      allProjects: [
        {
          user: "purvesh",
          projectTitle: "gitConnect-1",
          projectDescription: "This is small project for testing.",
          projectSkills: ["python", "aws", "babel", "aws", "babel"],
          projectGithubURL: "https://github.com/",
          bookmark: false,//aa nathi
          contribution: false,// aa nathi
        },
      ],
    };
  }

  resetKey() {
    this.state.allProjects.forEach((project, i) => {
      project.key = i + 1;
    });
  }

  async add_bookmark(id) {
    console.log(this.state.allProjects[id])

    const response = await axios({
      method: "POST",
      url: `${BASE_URL}/bookmark-view`,
      data: {
        "PROJECT_ID": this.state.allProjects[id]["_id"]
      },
      withCredentials: true
    })

    this.setState({
      "allProjects": [
        ...this.state.allProjects.slice(0, id),
        {
          ...this.state.allProjects[id],
          bookmark: !this.state.allProjects[id].bookmark,
        },
        ...this.state.allProjects.slice(id + 1),
      ],
    })
    this.trueBookmarkNotification()
  }
  async remove_bookmark(id) {
    console.log(this.state.allProjects[id])

    const response = await axios({
      method: "DELETE",
      url: `${BASE_URL}/bookmark-view`,
      data: {
        "PROJECT_ID": this.state.allProjects[id]["_id"]
      },
      withCredentials: true
    })

    this.setState({
      "allProjects": [
        ...this.state.allProjects.slice(0, id),
        {
          ...this.state.allProjects[id],
          bookmark: !this.state.allProjects[id].bookmark,
        },
        ...this.state.allProjects.slice(id + 1),
      ],
    })
    this.falseBookmarkNotification()
  }

  async add_contribution(id) {
    console.log(this.state.allProjects[id])

    const response = await axios({
      method: "POST",
      url: `${BASE_URL}/contribution-view`,
      data: {
        "PROJECT_ID": this.state.allProjects[id]["_id"],
        "OWNER_ID": this.state.allProjects[id]["owner"],
      },
      withCredentials: true
    })

    this.setState({
      "allProjects": [
        ...this.state.allProjects.slice(0, id),
        {
          ...this.state.allProjects[id],
          contribution: !this.state.allProjects[id].contribution,
        },
        ...this.state.allProjects.slice(id + 1),
      ],
    })
    this.trueRequestedNotification()
  }
  async remove_contribution(id) {
    console.log(this.state.allProjects[id])

    const response = await axios({
      method: "DELETE",
      url: `${BASE_URL}/contribution-view`,
      data: {
        "PROJECT_ID": this.state.allProjects[id]["_id"],
        "OWNER_ID": this.state.allProjects[id]["owner"],
      },
      withCredentials: true
    })

    this.setState({
      "allProjects": [
        ...this.state.allProjects.slice(0, id),
        {
          ...this.state.allProjects[id],
          contribution: !this.state.allProjects[id].contribution,
        },
        ...this.state.allProjects.slice(id + 1),
      ],
    })
    this.falseRequestedNotification()
  }

  renderBookmark = (isBookmark, projectID) => {
    var id = projectID - 1;
    if (isBookmark) {
      console.log("Key: ", id);
      return (
        <CustomButton
          title="BookMarked"
          onClick={() => this.remove_bookmark(id)}
        />
      );
    } else {
      console.log("Key: ", id);
      return (
        <CustomButton
          title="BookMark"
          onClick={() => this.add_bookmark(id)}
        />
      );
    }
  };

  renderRequested = (isRequested, projectID) => {
    var id = projectID - 1;
    if (isRequested) {
      return (
        <CustomButton
          title="Requested"
          onClick={() => this.remove_contribution(id)}
        />
      );
    } else {
      return (
        <CustomButton
          title="Do Contribution"
          onClick={() => this.add_contribution(id)}
        />
      );
    }
  };

  trueBookmarkNotification() {
    toast.success("BookMark Successfully.");
  }

  trueRequestedNotification() {
    toast.success("Requested for Contribution.");
  }

  falseBookmarkNotification() {
    toast.error("BookMark Removed.");
  }

  falseRequestedNotification() {
    toast.error("Request Removed.");
  }

  async searchQueryChange(e) {
    this.setState({
      "searchQuery": e.target.value
    })
    const response = await axios({
      method: "GET",
      url: `${BASE_URL}/search-page`,
      params: {
        "search_query": e.target.value
      },
      withCredentials: true
    })
    this.setState({
      "allProjects": response.data
    })
  }
  render() {
    toast.configure();
    const { allProjects, searchQuery } = this.state;

    // filter projects that contains searchQuery string and put search skill to
    // beginning of skills array using swapping.
    // remove the function below
    const filteredProjects = allProjects.filter((project) => {
      var element_index = project.projectSkills.indexOf(
        searchQuery.toLowerCase().trim()
      );
      console.log(element_index);
      if (element_index !== -1) {
        return ([
          project.projectSkills[0],
          project.projectSkills[element_index],
        ] = [project.projectSkills[element_index], project.projectSkills[0]]);
      }
    });

    const searchQueryLength = this.state.searchQuery.length;
    const filteredProjectLength = filteredProjects.length;

    return (
      <div className="search-page">
        <div className="search-bar">
          <FormInput
            placeholder="Search Project"
            onChange={(e) => {
              this.searchQueryChange(e)
            }}
          />
        </div>
        <br />
        <br />
        <Card>
          {searchQueryLength !== 0 ? (
            filteredProjectLength !== 0 ? (
              <VerticalScroll height="600px">
                <CardList>
                  {filteredProjects.map((project) => {
                    this.resetKey();
                    return (
                      <ProjectCardView
                        projectTitle={project.projectTitle}
                        projectDescription={project.projectDescription}
                        projectSkills={project.projectSkills}
                      >
                        <CardGrid gridColumn="1fr 1fr 1fr">
                          {this.renderBookmark(project.bookmark, project.key)}
                          <CustomButton
                            title="Github"
                            onClick={() =>
                              window.open(project.projectGithubURL, "_blank")
                            }
                          />
                          {this.renderRequested(project.contribution, project.key)}
                        </CardGrid>
                      </ProjectCardView>
                    );
                  })}
                </CardList>
              </VerticalScroll>
            ) : (
                <h2 className="search-info">No Projects Found</h2>
              )
          ) : (
              <h2 className="search-info">Search Something</h2>
            )}
        </Card>
      </div>
    );
  }
}

export default SearchPage;
