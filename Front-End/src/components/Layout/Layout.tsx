/* eslint-disable no-lone-blocks */
/* eslint-disable react-hooks/exhaustive-deps */
import { LayoutProps } from "./LayoutTypes";
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from "react";

import './Layout.css'

const Layout = ({ children }: LayoutProps) => {

    const [user, setUser] = useState('');
    const [status, setStatus] = useState('')
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const email = localStorage.getItem('email');

    useEffect(() => {
        if (token && email) {
            setStatus('on');
            setUser(email);
            console.log(email)
        } else {
            setStatus('');
            setUser('')
        }
    }, [])

    const logout = (): void => {
        localStorage.clear();
        setTimeout(() => {
            navigate('/register')
        }, 1000)
    }

    return (
        <div>
            <header>
                <Link className='logo' to='/register'>
                    <img src='https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png' alt='logo' />
                </Link>

                <div className='links-userStatus'>
                    <div className='header-links'>

                        {!token && <div className="h-link" onClick={() => {
                            localStorage.clear();
                            navigate('/register')
                        }}>Register</div>}

                        {!token && <div className="h-link" onClick={() => {
                            localStorage.clear();
                            navigate('/login')
                        }}>Login</div>}

                    </div>
                    <div className='user-status'>
                        <div className='statusWrap'>{status ? <div className='online'>Online</div> : <div className='offline'>Offline</div>}</div>

                        <div className='userName'>{status ? <div>Hi, <span className='online-user'>{user}</span><div className="logout-wrap"><span onClick={() => logout()} className="logout">Logout</span></div></div> : ''}</div>
                    </div>
                </div>
            </header>
            {children}
            <footer>Footar</footer>
        </div>
    )
}

export default Layout;