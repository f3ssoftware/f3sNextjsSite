

interface BoxTopicProps {
    backgroundImage: string;
    title: string;
    description: string;
}

export function BoxTopic({ backgroundImage, title, description }: BoxTopicProps) {
    return <div style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover', // Ensures the image covers the entire box
        backgroundPosition: 'center', // Centers the image within the box
        backgroundRepeat: 'no-repeat', // Prevents the image from repeating
        width: '48vw',
        height: '50vh', // Adjust this based on your design needs
        padding: '5%',
        color: 'white',
        display: 'flex', // Helps center the content inside
        flexDirection: 'row',
        justifyContent: 'center',
        marginRight: '3px',
        marginTop: '3px'
    }}>
        <div style={{
            display: 'flex',
            flexDirection: 'column-reverse',
        }}>
            <a style={{ textAlign: 'center', fontSize: ' 24px' }}>{description}</a>
            <a style={{ color: '#FB993E', textAlign: 'center', fontSize: ' 40px' }}>{title}</a>
        </div>
    </div>
}