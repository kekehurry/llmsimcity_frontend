"use client";
import styles from '../styles/control.module.css';
import axios from 'axios';
import { useState, useEffect,useRef, use } from 'react';

export default function Control({
    pharseResponse,
    setParams,
    setLoading,
    setStepCount,
    params,
    serverUrl,
    time,
    stepCount,
    duration
    }) {

    //Animation for traffic flow
    const [running, setRunning] = useState(false);
    const [interval, setFirstInterval] = useState(null);
    const [interval1, setSecondInterval] = useState(null);
    const [index, setIndex] = useState(0);
    const isExecutingRef = useRef(false);

    //  Animation for cache
    //  useEffect(() => {
    //     const animate = async () => {
    //     if (running){
    //         axios.get(serverUrl + "/get_step_count")
    //             .then(async (response) => {
    //                 if(response.data <= stepCount+10){
    //                     await cacheModel();
    //                 }
    //             })
    //     }
    //     };
    //     if (!running) {
    //     clearInterval(interval);
    //     return;
    //     }
    //     setFirstInterval(setInterval(animate, 100));

    //     return () => { clearInterval(interval);}
    // }, [running]);
    
    //Animation for auto step
    useEffect(() => {
        const animate1 = () => {
            if (running) {
                stepModel();
            }
        };
        if (!running) {
            clearInterval(interval1);
            return;
        }
        setSecondInterval(setInterval(animate1, duration-500));
        return () => { clearInterval(interval1); }
    }, [running, stepCount]);

    //Panels
    const handleChange = (event) => {
        setParams({
            ...params,
            [event.target.id]: event.target.value
        });
    };

    //Control Buttons
    const [isActive, setIsActive] = useState(false);
    const [isResetActive, setIsRestActive] = useState(false);
    const [isSetActive, setIsSetActive] = useState(false);
    const [intervalId, setIntervalId] = useState(null);

    //Init
    useEffect(() => {
        console.log("init")
        axios.get(serverUrl + "/init")
        .then((response) => {
            pharseResponse(response.data);
            setStepCount(response.data.step_count)
        })
    }, []);
    
    //Start 
    const startModel = (event) => {
        setIsActive(true);
        setRunning(true); 
        console.log("start") 
    }
    //Stop
    const stopModel = (envent) => {
        setIsActive(false);
        setRunning(false);
        console.log("stop")
    }
    //Step
    const stepModel = async () => {
        if (isExecutingRef.current) {
            return; 
        }
        isExecutingRef.current = true;
        try {
            const response = await axios.post(serverUrl + "/step", {"step_count": stepCount});
            pharseResponse(response.data);
        } finally {
            setStepCount(preStep => preStep + 1);
            isExecutingRef.current = false;
        }
    };
    //Reset
    const resetModel = (event) => {
        stopModel();
        event.preventDefault();
        setIsRestActive(true);
        setLoading(true);
        axios.get(serverUrl + "/reset")
            .then(response => {
                pharseResponse(response.data);
                setStepCount(response.data.step_count)
                console.log("reset")
                window.location.reload();
            })
            .finally(() => {
                setLoading(false);
            }
            );
    }
    //Set
    const setModel = (event) => {
        stopModel();
        event.preventDefault();
        setIsSetActive(true);
        axios.post(serverUrl + "/reset",params)
            .then(response => {
                console.log("set&reset")
                pharseResponse(response.data);
                setStepCount(response.data.step_count)
                console.log(response.data.step_count)
                window.location.reload();
            });
    }

    //Trigger Show
    const [isSidebarVisible, setSidebarVisibility] = useState(true);
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 's') {
                setSidebarVisibility(prevIsSidebarVisible => !prevIsSidebarVisible);
            } 
        };
        document.addEventListener('keydown', handleKeyDown);
        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className={`${styles.sidebar} ${isSidebarVisible ? styles.show : ''}`}>
            <div className={styles.sidebarHeader}>
                <h1>PUB-SIM</h1>
                <p>Prosocial Urban Development</p>
                <span className={styles.time}>{time}</span>
            </div>
            <div className={styles.sidebarBody}>
                <h2> Init Incentive Intensity</h2>
                <form>
                    {
                        Object.keys(params).map((k) => (
                            <div key={k}>
                                <span className={styles.inputLabel}>{k}</span>
                                <input className={styles.inputBox} type="text" defaultValue={params[k]} onChange={handleChange} />
                            </div>
                        ))
                    }
                </form>
                <button className={styles.activeButton} id="start" onClick={startModel}>Start</button>
            </div>
            <div className={styles.sidebarFooter}>
                <div className={styles.left}>
                    <button className={isSetActive? styles.activeButton:styles.button} id="set" onClick={setModel}>Set</button>
                    <button className={styles.button} id="stop" onClick={stopModel}>Stop</button>
                </div>
                <div className={styles.right}>
                    <button className={styles.button} id="step" onClick={stepModel}>Step</button>
                    <button className={isResetActive? styles.activeButton : styles.button} id="reset" onClick={resetModel}>Reset</button>
                </div>
                
            </div>
        </div>
    );
}
