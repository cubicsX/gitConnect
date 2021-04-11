import React from "react";
import "./public-profile.style.scss";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TextCard from "../../components/text-card/text-card.component";
import CustomButton from "../../components/custom-button/custom-button.component";
import CardGrid from "../../components/cardgrid/cardgrid.component";
import CardList from "../../components/cardlist/cardlist.component";
import Card from "../../components/card/card.component";
import ProjectCardView from "../../components/projectcardview/projectcardview.component";
import VerticalScroll from "../../components/vertical-scroll/vertical-scroll.component";
import SkillCard from "../../components/skill-card/skill-card.component";
import CustomButtonCard from "../../components/custom-button-card/custom-button-card.component";
import FormInput from "../../components/form-input/form-input.component";
import CancelButton from "../../components/cancel-button/cancel-button.component";

import AWSSVG from "../../components/skill-card/programing-language-logos/aws.svg";
import AndroidSVG from "../../components/skill-card/programing-language-logos/android.svg";
import AngularjsSVG from "../../components/skill-card/programing-language-logos/angularjs.svg";
import ApacheSVG from "../../components/skill-card/programing-language-logos/apache.svg";
import AppceleratorSVG from "../../components/skill-card/programing-language-logos/appcelerator.svg";
import AtomSVG from "../../components/skill-card/programing-language-logos/atom.svg";
import BabelSVG from "../../components/skill-card/programing-language-logos/babel.svg";
import BackBonejsSVG from "../../components/skill-card/programing-language-logos/backbonejs.svg";
import BitBucketSVG from "../../components/skill-card/programing-language-logos/bitbucket.svg";
import BootStrapSVG from "../../components/skill-card/programing-language-logos/bootstrap.svg";
import CSVG from "../../components/skill-card/programing-language-logos/c.svg";
import CodeIgniterSVG from "../../components/skill-card/programing-language-logos/codeigniter.svg";
import CPlusPlusSVG from "../../components/skill-card/programing-language-logos/cplusplus.svg";
import CSharpSVG from "../../components/skill-card/programing-language-logos/csharp.svg";
import CSS3SVG from "../../components/skill-card/programing-language-logos/css3.svg";
import PythonSVG from "../../components/skill-card/programing-language-logos/python.svg";
import JavaSVG from "../../components/skill-card/programing-language-logos/java.svg";
import SwiftSVG from "../../components/skill-card/programing-language-logos/swift.svg";
import FlutterSVG from "../../components/skill-card/programing-language-logos/flutter.svg";
import DartSVG from "../../components/skill-card/programing-language-logos/dart.svg";
import PerlSVG from "../../components/skill-card/programing-language-logos/perl.svg";
import RubySVG from "../../components/skill-card/programing-language-logos/ruby.svg";
import RustSVG from "../../components/skill-card/programing-language-logos/rust.svg";
import DockerSVG from "../../components/skill-card/programing-language-logos/docker.svg";
import KubernatesSVG from "../../components/skill-card/programing-language-logos/kubernates.svg";
import HtmlSVG from "../../components/skill-card/programing-language-logos/html.svg";
import JavaScriptSVG from "../../components/skill-card/programing-language-logos/javascript.svg";
import ReactjsSVG from "../../components/skill-card/programing-language-logos/reactjs.svg";
import NodejsSVG from "../../components/skill-card/programing-language-logos/nodejs.svg";
import PHPSVG from "../../components/skill-card/programing-language-logos/php.svg";
import OtherSVG from "../../components/skill-card/programing-language-logos/other.svg";

import GithubSVG from "../../media/github.svg";
import LinkedinSVG from "../../media/linkedin.svg";
import StackoverflowSVG from "../../media/stackoverflow.svg";
import PlusSVG from "../../media/plus.svg";
import BookmarkCard from "../../components/bookmark-card/bookmark-card.component";
import ContributionCard from "../../components/contribution-card/contribution-card.component";
import axios from "axios";
import { BASE_URL } from "../../constant";

class PublicProfile extends React.Component {
  constructor(props) {

    super(props);

    this.state = {
      isEdit: false,
      username: "",
      userid: "",
      email: "",
      avatar: "",
      githubURL: "",
      linkedinURL: "",
      stackoverflowURL: "",
      tempSkill: "",
      skills: [],
      bookmarks: [],
      contributions: [],
    };
  }

  successNotification() {
    toast.success("Successfully Saved");
  }

  removeNotification() {
    toast.error("Bookmark Removed.");
  }
  async componentDidMount() {
    const response = await axios({
      method: "GET",
      url: `${BASE_URL}/user-view`,
      params: {
        "user_id": this.props.match.params["user_id"]
      },
      withCredentials: true
    })
    let user_dict = response.data
    for (let index = 0; index < user_dict["skills"].length; index++) {
      let ele = user_dict["skills"][index]
      user_dict["skills"][index] = this.mapSkill(ele)
    }
    this.setState({
      username: user_dict["username"],
      userid: user_dict["userid"],
      email: user_dict["email"],
      avatar: user_dict["avatar"],
      githubURL: user_dict["githubURL"],
      linkedinURL: user_dict["linkedinURL"],
      stackoverflowURL: user_dict["stackoverflowURL"],
      skills: user_dict["skills"],
      bookmarks: user_dict["bookmarks"],
      contributions: user_dict["contributions"],
    })
  }

  async save_details() {
    const response = await axios({
      method: "PUT",
      data: {
        "username": this.state.username,
        "userid": this.state.userid,
        "email": this.state.email,
        "avatar": this.state.avatar,
        "githubURL": this.state.githubURL,
        "linkedinURL": this.state.linkedinURL,
        "stackoverflowURL": this.state.stackoverflowURL,
        "skills": this.state.skills,
      },
      withCredentials: true,
      url: `${BASE_URL}/user-view`
    })
    this.setState({ isEdit: false });

    this.successNotification();
  }

  async remove_bookmark(id) {
    const bookmark_response = await axios({
      method: "DELETE",
      url: `${BASE_URL}/bookmark-view`,
      data: this.state.bookmarks[id],
      withCredentials: true
    })
    const response = await axios({
      method: "GET",
      url: `${BASE_URL}/user-view`,
      withCredentials: true
    })
    let user_dict = response.data
    for (let index = 0; index < user_dict["skills"].length; index++) {
      let ele = user_dict["skills"][index]
      user_dict["skills"][index] = this.mapSkill(ele)
    }
    this.setState({
      username: user_dict["username"],
      userid: user_dict["userid"],
      email: user_dict["email"],
      avatar: user_dict["avatar"],
      githubURL: user_dict["githubURL"],
      linkedinURL: user_dict["linkedinURL"],
      stackoverflowURL: user_dict["stackoverflowURL"],
      skills: user_dict["skills"],
      bookmarks: user_dict["bookmarks"],
      contributions: user_dict["contributions"],
    })
    // this.setState({
    //   bookmarks: this.state.bookmarks.filter(
    //     (removeBookmark) => {
    //       return (
    //         removeBookmark.projectTitle !==
    //         bookmark.projectTitle
    //       );
    //     }
    //   ),
    // });
    this.removeNotification();
  }

  renderSaveButton() {
    toast.configure();
    if (this.state.isEdit) {
      return (
        <CustomButton
          title="Save"
          onClick={() => {
            this.save_details()
          }}
        />
      );
    } else {
      return (
        <CustomButton
          title="Edit Profile"
          onClick={() => {
            this.setState({ isEdit: true });
          }}
        />
      );
    }
  }

  socials(url) {

  }

  resetKey() {
    this.state.skills.forEach((skill, i) => {
      skill.key = i + 1;
    });
  }

  renderGeneralProfile() {
    if (this.state.isEdit) {
      return (
        <div className="edit-profile">
          <VerticalScroll height="450px">
            <div className="edit-username">
              <div className="edit-username-title">
                <Card>
                  <span>
                    <b>Name</b>
                  </span>
                </Card>
              </div>
              <div className="edit-username-value">
                <FormInput
                  placeholder="Enter Name"
                  value={this.state.username}
                  onChange={(e) => {
                    this.setState({ username: e.target.value });
                  }}
                />
              </div>
            </div>
            <br />
            <div className="edit-avatar">
              <div className="edit-avatar-title">
                <Card>
                  <span>
                    <b>Avatar</b>
                  </span>
                </Card>
              </div>
              <div className="edit-avatar-value">
                <FormInput
                  placeholder="Enter Avatar URL"
                  value={this.state.avatar}
                  onChange={(e) => {
                    this.setState({ avatar: e.target.value });
                  }}
                />
              </div>
            </div>
            <br />
            <div className="edit-email">
              <div className="edit-email-title">
                <Card>
                  <span>
                    <b>Email</b>
                  </span>
                </Card>
              </div>
              <div className="edit-email-value">
                <FormInput
                  placeholder="Enter Email ID"
                  value={this.state.email}
                  onChange={(e) => {
                    this.setState({ email: e.target.value });
                  }}
                />
              </div>
            </div>
            <br />
            <div className="edit-github">
              <div className="edit-github-title">
                <Card>
                  <span>
                    <b>Github</b>
                  </span>
                </Card>
              </div>
              <div className="edit-github-value">
                <FormInput
                  placeholder="Github User ID"
                  value={this.state.githubURL}
                  onChange={(e) => {
                    this.setState({ githubURL: e.target.value });
                  }}
                />
              </div>
            </div>
            <br />
            <div className="edit-linkedin">
              <div className="edit-linkedin-title">
                <Card>
                  <span>
                    <b>LinkedIN</b>
                  </span>
                </Card>
              </div>
              <div className="edit-linkedin-value">
                <FormInput
                  placeholder="LinkedIN ID"
                  value={this.state.linkedinURL}
                  onChange={(e) => {
                    this.setState({ linkedinURL: e.target.value });
                  }}
                />
              </div>
            </div>
            <br />
            <div className="edit-stackoverflow">
              <div className="edit-stackoverflow-title">
                <Card>
                  <span>
                    <b>Stackoverflow</b>
                  </span>
                </Card>
              </div>
              <div className="edit-stackoverflow-value">
                <FormInput
                  placeholder="StackOverflow ID"
                  value={this.state.stackoverflowURL}
                  onChange={(e) => {
                    this.setState({ stackoverflowURL: e.target.value });
                  }}
                />
              </div>
            </div>
            <br />
          </VerticalScroll>
        </div>
      );
    } else {
      return (
        <div className="display-profile">
          <div className="user-avatar">
            <Card>
              <img src={this.state.avatar} alt="avatar" />
            </Card>
          </div>
          <br />
          <br />
          {/* <VerticalScroll height="250px"> */}
          <div className="username">
            <div className="username-title">
              <Card>
                <span>
                  <b>Name</b>
                </span>
              </Card>
            </div>
            <div className="username-value">
              <Card>
                <span>{this.state.username}</span>
              </Card>
            </div>
          </div>
          <br />
          <div className="userid">
            <div className="userid-title">
              <Card>
                <span>
                  <b>UserID</b>
                </span>
              </Card>
            </div>
            <div className="userid-value">
              <Card>
                <span>{this.state.userid}</span>
              </Card>
            </div>
          </div>
          <br />
          <div className="user-email">
            <div className="user-email-title">
              <Card>
                <span>
                  <b>Email</b>
                </span>
              </Card>
            </div>
            <div className="user-email-value">
              <Card>
                <span>{this.state.email}</span>
              </Card>
            </div>
          </div>
          {/* </VerticalScroll> */}
          <br />
          <br />
          <div className="modify-grid">
            <CardGrid gridColumn="1fr 1fr 1fr">
              <CustomButtonCard
                classname="github-social"
                imageURL={GithubSVG}
                imageText="github"
                url={this.state.githubURL}
              />
              <CustomButtonCard
                classname="linkedin-social"
                imageURL={LinkedinSVG}
                imageText="linkedin"
                url={this.state.linkedinURL}
              />
              <CustomButtonCard
                classname="stackoverflow-social"
                imageURL={StackoverflowSVG}
                imageText="stackoverflow"
                url={this.state.stackoverflowURL}
              />
            </CardGrid>
          </div>
        </div>
      );
    }
  }


  mapSkill = (skill) => {
    var logosDict = {
      amazon: ["aws", "web services", "amazon web services", "webservices"],
      angularjs: ["angular", "angularjs"],
      apache: ["apache", "apache web"],
      appcelerator: ["appcelerator"],
      atom: ["atom", "atom code", "atom editor"],
      babel: ["babel"],
      backbonejs: ["backbonejs"],
      bitbucket: ["bitbucket"],
      bootstrap: ["bootstrap"],
      c: ["c", "c language"],
      codeigniter: ["codeigniter"],
      cplusplus: ["cplusplus", "c++", "cpp"],
      csharp: ["csharp", "c#"],
      css3: ["css", "css3"],
      python: ["python", "python2", "python3", "python3.x"],
      java: ["java"],
      android: ["android", "android studio"],
      swift: ["swift", "iOS"],
      flutter: ["flutter"],
      dart: ["dart"],
      perl: ["perl"],
      ruby: ["ruby"],
      rust: ["rust"],
      docker: ["docker", "container"],
      kubernates: ["kubernates"],
      html: ["html", "html5"],
      javascript: ["javascript"],
      reactjs: ["reactjs", "reactJS"],
      nodejs: ["node", "nodejs", "nodeJS"],
      php: ["php"],
    };
    var logoURL = OtherSVG;
    var logoName = "other";
    for (var key in logosDict) {
      if (logosDict[key].includes(skill)) {
        var logoName = key;
      }
    }

    //use  switch case insted of if-else
    if (logoName === "amazon") {
      logoURL = AWSSVG;
    }
    if (logoName === "angularjs") {
      logoURL = AngularjsSVG;
    }
    if (logoName === "apache") {
      logoURL = ApacheSVG;
    }
    if (logoName === "appcelerator") {
      logoURL = AppceleratorSVG;
    }
    if (logoName === "atom") {
      logoURL = AtomSVG;
    }
    if (logoName === "babel") {
      logoURL = BabelSVG;
    }
    if (logoName === "backbonejs") {
      logoURL = BackBonejsSVG;
    }
    if (logoName === "bitbucket") {
      logoURL = BitBucketSVG;
    }
    if (logoName === "bootstrap") {
      logoURL = BootStrapSVG;
    }
    if (logoName === "c") {
      logoURL = CSVG;
    }
    if (logoName === "codeigniter") {
      logoURL = CodeIgniterSVG;
    }
    if (logoName === "cplusplus") {
      logoURL = CPlusPlusSVG;
    }
    if (logoName === "csharp") {
      logoURL = CSharpSVG;
    }
    if (logoName === "css3") {
      logoURL = CSS3SVG;
    }
    if (logoName === "python") {
      logoURL = PythonSVG;
    }
    if (logoName === "java") {
      logoURL = JavaSVG;
    }
    if (logoName === "android") {
      logoURL = AndroidSVG;
    }
    if (logoName === "swift") {
      logoURL = SwiftSVG;
    }
    if (logoName === "flutter") {
      logoURL = FlutterSVG;
    }
    if (logoName === "dart") {
      logoURL = DartSVG;
    }
    if (logoName === "perl") {
      logoURL = PerlSVG;
    }
    if (logoName === "ruby") {
      logoURL = RubySVG;
    }
    if (logoName === "rust") {
      logoURL = RustSVG;
    }
    if (logoName === "docker") {
      logoURL = DockerSVG;
    }
    if (logoName === "kubernates") {
      logoURL = KubernatesSVG;
    }
    if (logoName === "html") {
      logoURL = HtmlSVG;
    }
    if (logoName === "javascript") {
      logoURL = JavaScriptSVG;
    }
    if (logoName === "reactjs") {
      logoURL = ReactjsSVG;
    }
    if (logoName === "nodejs") {
      logoURL = NodejsSVG;
    }
    if (logoName === "php") {
      logoURL = PHPSVG;
    }

    return {
      imageText: skill,
      imageURL: logoURL,
    }
  };


  addSkill = () => {
    var logosDict = {
      amazon: ["aws", "web services", "amazon web services", "webservices"],
      angularjs: ["angular", "angularjs"],
      apache: ["apache", "apache web"],
      appcelerator: ["appcelerator"],
      atom: ["atom", "atom code", "atom editor"],
      babel: ["babel"],
      backbonejs: ["backbonejs"],
      bitbucket: ["bitbucket"],
      bootstrap: ["bootstrap"],
      c: ["c", "c language"],
      codeigniter: ["codeigniter"],
      cplusplus: ["cplusplus", "c++", "cpp"],
      csharp: ["csharp", "c#"],
      css3: ["css", "css3"],
      python: ["python", "python2", "python3", "python3.x"],
      java: ["java"],
      android: ["android", "android studio"],
      swift: ["swift", "iOS"],
      flutter: ["flutter"],
      dart: ["dart"],
      perl: ["perl"],
      ruby: ["ruby"],
      rust: ["rust"],
      docker: ["docker", "container"],
      kubernates: ["kubernates"],
      html: ["html", "html5"],
      javascript: ["javascript"],
      reactjs: ["reactjs", "reactJS"],
      nodejs: ["node", "nodejs", "nodeJS"],
      php: ["php"],
    };
    var logoURL = OtherSVG;
    var logoName = "other";
    for (var key in logosDict) {
      if (logosDict[key].includes(this.state.tempSkill)) {
        var logoName = key;
      }
    }

    //use  switch case insted of if-else
    if (logoName === "amazon") {
      logoURL = AWSSVG;
    }
    if (logoName === "angularjs") {
      logoURL = AngularjsSVG;
    }
    if (logoName === "apache") {
      logoURL = ApacheSVG;
    }
    if (logoName === "appcelerator") {
      logoURL = AppceleratorSVG;
    }
    if (logoName === "atom") {
      logoURL = AtomSVG;
    }
    if (logoName === "babel") {
      logoURL = BabelSVG;
    }
    if (logoName === "backbonejs") {
      logoURL = BackBonejsSVG;
    }
    if (logoName === "bitbucket") {
      logoURL = BitBucketSVG;
    }
    if (logoName === "bootstrap") {
      logoURL = BootStrapSVG;
    }
    if (logoName === "c") {
      logoURL = CSVG;
    }
    if (logoName === "codeigniter") {
      logoURL = CodeIgniterSVG;
    }
    if (logoName === "cplusplus") {
      logoURL = CPlusPlusSVG;
    }
    if (logoName === "csharp") {
      logoURL = CSharpSVG;
    }
    if (logoName === "css3") {
      logoURL = CSS3SVG;
    }
    if (logoName === "python") {
      logoURL = PythonSVG;
    }
    if (logoName === "java") {
      logoURL = JavaSVG;
    }
    if (logoName === "android") {
      logoURL = AndroidSVG;
    }
    if (logoName === "swift") {
      logoURL = SwiftSVG;
    }
    if (logoName === "flutter") {
      logoURL = FlutterSVG;
    }
    if (logoName === "dart") {
      logoURL = DartSVG;
    }
    if (logoName === "perl") {
      logoURL = PerlSVG;
    }
    if (logoName === "ruby") {
      logoURL = RubySVG;
    }
    if (logoName === "rust") {
      logoURL = RustSVG;
    }
    if (logoName === "docker") {
      logoURL = DockerSVG;
    }
    if (logoName === "kubernates") {
      logoURL = KubernatesSVG;
    }
    if (logoName === "html") {
      logoURL = HtmlSVG;
    }
    if (logoName === "javascript") {
      logoURL = JavaScriptSVG;
    }
    if (logoName === "reactjs") {
      logoURL = ReactjsSVG;
    }
    if (logoName === "nodejs") {
      logoURL = NodejsSVG;
    }
    if (logoName === "php") {
      logoURL = PHPSVG;
    }

    // TODO: add reset key function, it is better than manualy set the keys. 
    this.resetKey()
    // remove key field from this dict
    this.state.skills.unshift({
      imageURL: logoURL,
      imageText: `${this.state.tempSkill}`,
    });
    // remove skill_count from state.
    this.setState({
      skills: this.state.skills,
      tempSkill: "",
    });
  };

  removeSkillss = (id) => {

    this.setState({
      skills: this.state.skills.filter((skill) => {
        return skill.key !== id;
      }),
    });
  };

  renderSkill() {
    if (this.state.isEdit) {
      return (
        <div className="edit-skill">
          <div className="add-new-skill">
            <FormInput
              placeholder="Skill"
              value={this.state.tempSkill}
              onChange={(e) => {
                this.setState({ tempSkill: e.target.value });
              }}
            />
            <CustomButton title="Add Skill" onClick={this.addSkill} />
          </div>
          <br />
          <VerticalScroll height="380px">
            <div className="modify-grid">
              {/* call reset-key function here */}
              <CardGrid gridColumn="1fr 1fr 1fr 1fr">
                {this.resetKey(),
                  this.state.skills.map((skill) => (
                    <div className="remove-skill-card">
                      <SkillCard
                        id={skill.key}
                        imageURL={skill.imageURL}
                        imageText={skill.imageText}
                      />
                      <CancelButton
                        onClick={(e) => this.removeSkillss(skill.key)}
                      />
                    </div>
                  ))}
              </CardGrid>
            </div>
          </VerticalScroll>
        </div>
      );
    } else {
      return (
        <VerticalScroll height="450px">
          <div className="modify-grid">
            <CardGrid gridColumn="1fr 1fr 1fr 1fr">
              {this.resetKey(),
                this.state.skills.map((skill) => (
                  <SkillCard
                    id={skill.key}
                    imageURL={skill.imageURL}
                    imageText={skill.imageText}
                    isRemove="false"
                  />
                ))}
            </CardGrid>
          </div>
        </VerticalScroll>
      );
    }
  }


  render() {
    return (
      <div className="user-profile">
        <div className="profile-header">
          <TextCard text="User Profile" />
          {/* {this.renderSaveButton()} */}
        </div>
        <br />
        <br />
        <Card>
          <div className="general-section">
            <CardGrid gridColumn="1fr 1fr">
              <Card>
                <h2 className="inner-header">General Profile</h2>
                {this.renderGeneralProfile()}
              </Card>
              <Card>
                <h2 className="inner-header">Skill</h2>
                {this.renderSkill()}
              </Card>
            </CardGrid>
          </div>
          <br />
          <br />
          <div className="user-bookmark">
            <Card>
              <h2 className="inner-header">BookMark Projects</h2>
              <VerticalScroll height="300px">
                <br />
                <CardGrid gridColumn="1fr 1fr 1fr">
                  {this.state.bookmarks.map((bookmark, id) => (
                    <BookmarkCard
                      projectTitle={bookmark.projectTitle}
                      projectDescription={bookmark.projectDescription}
                    >
                      {/* <CustomButton
                        title="Remove"
                        onClick={() => {
                          this.remove_bookmark(id)
                        }}
                      /> */}
                    </BookmarkCard>
                  ))}
                </CardGrid>
              </VerticalScroll>
            </Card>
          </div>
          <br />
          <br />
          <div className="user-contribution">
            <Card>
              <h2 className="inner-header">Contributions</h2>
              <VerticalScroll height="300px">
                <br />
                <CardGrid gridColumn="1fr 1fr 1fr">
                  {this.state.contributions.map((contribution) => (
                    <ContributionCard
                      projectTitle={contribution.projectTitle}
                      projectDescription={contribution.projectDescription}
                    />
                  ))}
                </CardGrid>
              </VerticalScroll>
            </Card>
          </div>
        </Card>
      </div>
    );
  }
}

export default PublicProfile;
