import React from 'react';
import Card from '../card/card.component';
import './contribution-notification-card.style.scss';

const ContributionNotificationCard = (props) => {
    return(
        <div className="contribution-notification-card">
            <h2>{props.requestedProject}</h2>
            <Card>
                <span>Your Request status: <b>{props.status}</b></span>
            </Card>
            <br /><br />
            <div className="mod-button1">
                {props.children}
            </div>
        </div>
    )
}

export default ContributionNotificationCard;