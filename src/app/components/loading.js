import { useState, useEffect } from 'react';
import styles from '../styles/loading.module.css'; 

const Loading = ({loading}) => {
    return (
        <div>
        {loading && 
            <div className={styles.container}>
                <div className={styles.loading}></div>
            </div>
        }
        </div>
    );
};

export default Loading;