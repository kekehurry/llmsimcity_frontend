"use client";
import styles from '../styles/control.module.css';
import axios from 'axios';
import { useState, useEffect,useRef, use } from 'react';
import Slider from  '@mui/material/Slider';

export default function Control({
    pharseResponse,
    setParams,
    setLoading,
    setStepCount,
    setDuration,
    params,
    serverUrl,
    time,
    stepCount,
    duration
    }) {


    //Animation for auto step
    const [running, setRunning] = useState(false);
    const [interval, setInterval] = useState(null);
    const isExecutingRef = useRef(false);
    useEffect(() => {
        const animate1 = () => {
            if (running) {
                stepModel();
            }
        };
        if (!running) {
            clearInterval(interval);
            return;
        }
        setInterval(setInterval(animate1, duration-500));
        return () => { clearInterval(interval); }
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

    //Set Params
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
    const [isSidebarVisible, setSidebarVisibility] = useState(false);
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 's') {
                setSidebarVisibility(prevIsSidebarVisible => !prevIsSidebarVisible);
            } 
            if (event.key==='8'){
                startModel();
            }
            if (event.key==='9'){
                window.location.reload();
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
                <h1>Urban Simulator</h1>
                <p>ABM developed by city science group</p>
                <span className={styles.time}>{time}</span>
            </div>
            <div className={styles.sidebarBody}>
                <h2> Model Params</h2>
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
                <h2> Control Params</h2>
                <span className={styles.inputLabel}>duration</span>
                <Slider
                    aria-label="Duration"
                    defaultValue={2000}
                    valueLabelDisplay="auto"
                    step={500}
                    marks
                    min={1000}
                    max={5000}
                    sx={{
                        height: "6px",
                        color: 'rgb(242, 0, 117)',
                        '& .MuiSlider-thumb': {
                            width: "12px",
                            height: "12px"
                          },
                        '& .MuiSlider-rail': {
                            height: "5px"
                        },
                        '& .MuiSlider-track': {
                            height: "5px"
                        },
                      }}
                    onChange={(event) => {
                        setDuration(event.target.value);}}
                />
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
