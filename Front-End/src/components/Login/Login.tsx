import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import './Login.css'
import Form from "../Form/Form";
import { LogType } from "./Regtype";

const Login = (): JSX.Element => {

    const [message, setMessage] = useState('')
    const [name, setName] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();

    return (
        <div>
            <h1 className="login">Login</h1>
            <Form className="def-form" fetch={(event) => {
                event.preventDefault();

                const organizerLog: LogType = {
                    user_name: name,
                    password: pass,
                }

                fetch('http://localhost:8080/v1/organizers/login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify( organizerLog )
                })
                    .then(res => res.json())
                    .then(res => {
                        if (res.loginError) {
                            setMessage(res.loginError);
                        } else {
                            setMessage('Logged in !')
                            localStorage.setItem('token', res.token);
                            localStorage.setItem('user_name', res.user_name);
                            localStorage.setItem('organizer_id', res.organizer_id);
                            setTimeout((): void => {
                                navigate('/participants');
                            }, 2000)
                        }
                    })
                    .catch(error => console.log(error));

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
                <div>
                    <button id="reg-log" type="submit">Login</button>
                </div>
            </Form>
            {message && <div className="message">{message}</div>}
        </div>
    )
}
export default Login;