import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../app/tasks.module.css'



const CodePage = () => {
    const router = useRouter();
    const { code } = router.query;
    const [phrases, setPhrases] = useState([]);
    const [isValidCode, setIsValidCode] = useState(false);
    const [updateFlag, setUpdateFlag] = useState(false);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [failedTasks, setFailedTasks] = useState([]);


    const validCodes = [
        "776349",
        "122185",
        "339259",
        "237137",
        "453786",
        "386803",
        "585368",
        "128842",
        "246207",
        "684182",
        "834024",
        "859596",
        "527275",
        "132182",
        "714231",
        "830020",
        "118105",
        "500919",
        "348144",
        "780447",
        "821485",
        "273700",
        "722545",
        "920632",
        "892741",
        "722447",
        "906912",
        "704648",
        "783090",
        "310429",
    ];


    useEffect(() => {
        if (code && validCodes.includes(code)) {
            setIsValidCode(true);
            fetch(`/${code}.txt`)
                .then((response) => response.text())
                .then((text) => {
                    setPhrases(text.split('\n').filter(line => line.trim() !== ''));
                })
                .catch((error) => {
                    console.error('Error fetching the text file:', error);
                    setIsValidCode(false);
                });
            fetch(`/${code}_success.txt`)
                .then(response => response.text())
                .then(text => setCompletedTasks(text.split('\n').filter(line => line.trim() !== '')))
                .catch(error => console.error('Error fetching completed tasks:', error));

            fetch(`/${code}_fail.txt`)
                .then(response => response.text())
                .then(text => setFailedTasks(text.split('\n').filter(line => line.trim() !== '')))
                .catch(error => console.error('Error fetching failed tasks:', error));
        }
    }, [code, updateFlag]);

    const handleDelete = async (index) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                const response = await fetch('/api/deleteTask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code, index }),
                });

                const result = await response.json();
                if (response.ok) {
                    setPhrases((prevPhrases) => prevPhrases.filter((_, i) => i !== index));
                    setUpdateFlag((prev) => !prev);
                } else {
                    console.error('Failed to delete the task:', result.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const handleSuccess = async (index) => {
        if (window.confirm('Are you sure you want to mark this task as completed?')) {

            try {
                const response = await fetch('/api/completeTask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code, index }),
                });

                if (response.ok) {
                    console.log("Task completed successfully");
                    setUpdateFlag((prev) => !prev);
                } else {
                    console.error('Failed to complete the task');
                }
            } catch (error) {
                console.error('Error completing task:', error);
            }
        };
    }

    const handleFail = async (index) => {
        if (window.confirm('Are you sure you want to mark this task as failed?')) {

            try {
                const response = await fetch('/api/failTask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code, index }),
                });

                if (response.ok) {
                    console.log("Task marked as failed");
                    setUpdateFlag((prev) => !prev);
                } else {
                    console.error('Failed to mark the task as failed');
                }
            } catch (error) {
                console.error('Error failing task:', error);
            }
        };
    }

    if (!isValidCode) {
        return <div>Invalid code or file not found.</div>;
    }

    return (
        <main className={styles.main}>
            <div>
                <h1>Tasks for user {code}</h1>
                <div>
                    {phrases.map((phrase, index) => (
                        <div className={styles.container} key={index}>
                            <p className={styles.text}>{phrase}{' '}</p>
                            <div className={styles.btncont}>
                                <button onClick={() => handleSuccess(index)} className={styles.btnsucc}>Success</button>
                                <button onClick={() => handleFail(index)} className={styles.btnfail}>Fail</button>
                                <button onClick={() => handleDelete(index)} className={styles.btndel}>Replace</button>
                            </div>
                        </div>
                    ))}
                </div>
                <h2>Completed Tasks:</h2>
                <div>
                    {completedTasks.map((phrase, index) => (
                        <div className={styles.container} key={index}>
                            <p className={styles.text}>{phrase}{' '}</p>

                        </div>
                    ))}
                </div>

                <h2>Failed Tasks:</h2>
                <div>
                    {failedTasks.map((task, index) => (
                        <div className={styles.container} key={index}>
                            <p className={styles.text}>{task}{' '}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default CodePage;
