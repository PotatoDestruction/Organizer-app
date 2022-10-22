import { useState, useEffect } from "react";
import Form from "../Form/Form";
import { useNavigate } from 'react-router-dom'
import './Register.css'
import { RegInfo } from "./RegisterTypes";

const Register = (): JSX.Element => {

    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [pass, setPass] = useState('');
    const [passConfirm, setPassConfirm] = useState('');
    const navigate = useNavigate();

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var dateTime = date;

    useEffect(() => {
        localStorage.clear()
    }, [])

    return (
        <main>
            <h1 className="register">Register account</h1>
            <Form className="def-form" fetch={(event) => {
                event.preventDefault();

                const organizerReg: RegInfo = {
                    user_name: name.charAt(0).toUpperCase() + name.slice(1),
                    password: pass,
                    regTime: dateTime
                }

                fetch(`http://localhost:8080/v1/organizers/${name}`)
                    .then(res => res.json())
                    .then(res => {
                        if (res.length === 0) {
                            if (pass === passConfirm) {
                                fetch('http://localhost:8080/v1/organizers/register', {
                                    method: 'POST',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify( organizerReg )
                                })
                                    .then(res => res.json())
                                    .then(res => {
                                        if (res.err) {
                                            setMessage(res.err);
                                        } else {
                                            setMessage('User created !')
                                            setTimeout((): void => {
                                                navigate('/login')
                                            }, 2000)
                                        }
                                    })
                                    .catch(error => console.log(error));
                            }else {
                                setMessage('Passwords must match !')
                            }
                        } else {
                            setMessage('This User name already exists.')
                        }
                    })
                    .catch(error => console.log(error))

            }}>
                <label>User Name:</label>
                <input type="name" name="name" required minLength={3} maxLength={25}
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        let newValue = e.target.value
                        setName(newValue.charAt(0).toUpperCase() + newValue.slice(1));
                    }}
                />
                <label>Pasword:</label>
                <input type="password" name="password" required minLength={3} maxLength={18}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        let newValue = e.target.value
                        setPass(newValue);
                    }}
                />
                <label>Please repeat your password:</label>
                <input type="password" name="password2" required minLength={3} maxLength={18}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        let newValue = e.target.value
                        setPassConfirm(newValue);
                    }}
                />
                <div>
                    <button id='reg-log' type="submit">Register</button>
                </div>
            </Form>

            {message.length > 1 && <div className="message">{message}</div>}
        </main>
    )
}

export default Register;