import { useState, useEffect } from 'react';
import styles from '../styles/loading.module.css'; 

const Loading = ({loading}) => {
    useEffect(() => {
        const updateLogo = () =>{
            let image = document.querySelector('img[alt="AnythingLLM Logo"]');
            if (image) {
                image.src = "/logo.svg";
            }
        }
        const timer = setInterval(() => {updateLogo();}, 10);
        return () => {
            clearInterval(timer);
        };
    }, []);
    return (
        <div>
        <script
        data-embed-id="bda572d1-01ed-416c-8c32-a4923375c5e0"
        data-base-api-url="http://localhost:3001/api/embed"
        src="http://localhost:3001/embed/anythingllm-chat-widget.min.js"
        data-button-color = "#F20075"
        data-greeting = "Hi, I'm Miya, an AI assistant created by City Science. How can I help you today?"
        >
        </script>
        {loading && 
            <div className={styles.container}>
                <div className={styles.loading}></div>
            </div>
        }
        </div>
    );
};

export default Loading;