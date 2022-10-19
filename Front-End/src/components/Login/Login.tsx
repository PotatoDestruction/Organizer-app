import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import './Login.css'
import Form from "../Form/Form";

const Login = () => {

    const [message, setMessage] = useState('')
    const navigate = useNavigate();

    return (
        <div>
            <h1 className="login">Login</h1>
            <Form fetch={(event) => {
                event.preventDefault();
                const email = document.getElementById('email1') as HTMLInputElement
                const password = document.getElementById('password1') as HTMLInputElement
                fetch('http://localhost:8079/v1/users/login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email.value,
                        password: password.value,
                    })
                })
                    .then(res => res.json())
                    .then(res => {
                        if (res.error) {
                            setMessage(res.error);
                            console.log(res.error)
                        } else {
                            setMessage('Logged in!')
                            console.log(res)
                            localStorage.setItem('token', res.token);
                            localStorage.setItem('email', res.email)
                            setTimeout((): void => {
                                navigate('/login')
                            }, 2000)
                        }
                    })
                    .catch(error => console.log(error));
            }}>

                <label>Email:</label>
                <input type="email" name="email" id="email1" required minLength={4} maxLength={30} />
                <label>Pasword:</label>
                <input type="password" name="password" id="password1" required minLength={3} maxLength={18} />
                <div>
                    <button type="submit">Register</button>
                </div>

            </Form>
            {message && <div className="message">{message}</div>}
        </div>
    )
}
export default Login;