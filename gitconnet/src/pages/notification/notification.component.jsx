import React from "react";
import "./notification.style.scss";

import CardGrid from "../../components/cardgrid/cardgrid.component";
import CustomButton from "../../components/custom-button/custom-button.component";
import TextCard from "../../components/text-card/text-card.component";
import Card from "../../components/card/card.component";
import VerticalScroll from "../../components/vertical-scroll/vertical-scroll.component";
import ProjectCardView from "../../components/projectcardview/projectcardview.component";
import CardList from "../../components/cardlist/cardlist.component";
import CollabrationNotificationCard from "../../components/collabration-notification-card/collabration-notification-card.component";
import ContributionNotificationCard from "../../components/contribution-notification-card/contribution-notification-card.component";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BASE_URL } from '../../constant'

class Notification extends React.Component {
  constructor() {
    super();

    this.state = {
      collaborations: [],
      contributions: []
    };
  }
  async componentDidMount() {
    const response = await axios({
      method: "GET",
      url: `${BASE_URL}/notification-view`,
      withCredentials: true
    })
    this.setState({
      "collaborations": response.data["collaborations"],
      "contributions": response.data["contributions"]
    })
  }
  async acceptCollaboration(id) {
    const accept_collaboration = await axios({
      method: "POST",
      url: `${BASE_URL}/notification-view`,
      data: {
        "data": this.state.collaborations[id - 1],
        "status": "accept"
      },
      withCredentials: true
    })
    const response = await axios({
      method: "GET",
      url: `${BASE_URL}/notification-view`,
      withCredentials: true
    })
    this.setState({
      "collaborations": response.data["collaborations"],
      "contributions": response.data["contributions"]
    })
    toast.success("You find a Collabrator!!");
  }

  async rejectCollaboration(id) {
    const reject_collaboration = await axios({
      method: "POST",
      url: `${BASE_URL}/notification-view`,
      data: {
        "data": this.state.collaborations[id - 1],
        "status": "reject"
      },
      withCredentials: true
    })
    const response = await axios({
      method: "GET",
      url: `${BASE_URL}/notification-view`,
      withCredentials: true
    })
    this.setState({
      "collaborations": response.data["collaborations"],
      "contributions": response.data["contributions"]
    })
    toast.error("Collaboration Request Rejected.");
  }

  removeNotification() {
    toast.error("Notification Removed from Tray.");
  }

  resetCollaborationKey() {
    this.state.collaborations.forEach((collaborations, i) => {
      collaborations.key = i + 1;
    });
  }

  resetContributionKey() {
    this.state.contributions.forEach((contribution, i) => {
      contribution.key = i + 1;
    });
  }


  async removeContributionProject(id) {
    const remove_contribution = await axios({
      method: "DELETE",
      url: `${BASE_URL}/contribution-view`,
      data: {
        "PROJECT_ID": this.state.contributions[id - 1]["project_id"],
        "OWNER_ID": this.state.contributions[id - 1]["project_owner"],
      },
      withCredentials: true
    })
    const response = await axios({
      method: "GET",
      url: `${BASE_URL}/notification-view`,
      withCredentials: true
    })
    this.setState({
      "collaborations": response.data["collaborations"],
      "contributions": response.data["contributions"]
    })
    toast.error("Notification Removed from Tray.");
  };

  render() {
    toast.configure();
    return (
      <div className="notification">
        <TextCard text="Notifications" />
        <br />
        <br />
        <CardGrid gridColumn="1fr 1fr">
          <Card>
            <h2 className="inner-header">Collabration Requests</h2>
            <VerticalScroll height="520px">
              <CardList>
                {
                  (this.resetCollaborationKey(),
                    this.state.collaborations.map((collaborations) => (
                      <CollabrationNotificationCard
                        user={collaborations.user}
                        requestedProject={collaborations.requestedProject}
                      >
                        <CustomButton
                          title="Accept"
                          onClick={() => (
                            this.acceptCollaboration(collaborations.key)
                          )}
                        />
                        <CustomButton
                          title="Reject"
                          onClick={() => (
                            this.rejectCollaboration(collaborations.key)
                          )}
                        />
                      </CollabrationNotificationCard>
                    )))
                }
              </CardList>
            </VerticalScroll>
          </Card>
          <Card>
            <h2 className="inner-header">Contribution Requests</h2>
            <VerticalScroll height="520px">
              <CardList>
                {
                  (this.resetContributionKey(),
                    this.state.contributions.map((contribution) => (
                      <ContributionNotificationCard
                        requestedProject={contribution.requestedProject}
                        status={contribution.status}
                      >
                        <CustomButton
                          title="Remove"
                          onClick={() => (
                            this.removeContributionProject(contribution.key)
                          )}
                        />
                      </ContributionNotificationCard>
                    )))
                }
              </CardList>
            </VerticalScroll>
          </Card>
        </CardGrid>
      </div>
    );
  }
}

export default Notification;
