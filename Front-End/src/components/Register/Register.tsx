import { useState, useEffect } from "react";
import Form from "../Form/Form";
import { useNavigate } from 'react-router-dom'
import './Register.css'

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
            <Form fetch={(event) => {
                event.preventDefault();


                console.log(name, pass, passConfirm)

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
                                    body: JSON.stringify({
                                        user_name: name,
                                        password: pass,
                                        regTime: dateTime,
                                    })
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
                        setName(newValue);
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
                    <button type="submit">Register</button>
                </div>
            </Form>

            {message.length > 1 && <div className="message">{message}</div>}
        </main>
    )
}

export default Register;