import { BoxTopic } from "./box-topic";
import './about.css'
import {useTranslations} from 'next-intl';

export default function About() {

    const t = useTranslations(); 
    
    return <section className="about-section">
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: '1%'
        }}>
            <BoxTopic title={t('SOTFWARE_DEVELOPMENT')} description={t('WE_ARE')} backgroundImage="/img/imac_vscode.png"></BoxTopic>
            <BoxTopic title={t('COMMUNITY_SUPPORT')} description={t('OUR_FOCUS')} backgroundImage="/img/auditorium.png"></BoxTopic>
            <BoxTopic title={t('GAMES')} description={t('GAME_SCENARIO')} backgroundImage="/img/videogame.png"></BoxTopic>
            <BoxTopic title={t('NETWORKING')} description={t('WE_CONNECT')} backgroundImage="/img/meeting.png"></BoxTopic>
        </div>
    </section >
}