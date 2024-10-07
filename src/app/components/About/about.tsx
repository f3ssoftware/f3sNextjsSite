import { BoxTopic } from "./box-topic";
import './about.css'


export default function About() {
    return <section className="about-section">
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: '1%'
        }}>
            <BoxTopic title="Software Development" description="We are dedicated to creating exceptional tools and applications tailored to the unique needs of specific business." backgroundImage="/img/imac_vscode.png"></BoxTopic>
            <BoxTopic title="Community Support" description="Our focus goes beyond development—we actively collaborate with the tech community to enhance frameworks and push the boundaries of technology." backgroundImage="/img/auditorium.png"></BoxTopic>
            <BoxTopic title="Games" description="Building technologies and infrastructure into the Game scenario" backgroundImage="/img/videogame.png"></BoxTopic>
            <BoxTopic title="Networking" description="We connect people to develop revolutionary ideas" backgroundImage="/img/meeting.png"></BoxTopic>
        </div>
    </section >
}