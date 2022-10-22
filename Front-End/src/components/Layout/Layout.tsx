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

    const token: string | null = localStorage.getItem("token");
    const user_name: string | null = localStorage.getItem('user_name');

    useEffect(() => {
        if (token && user_name) {
            setStatus('on');
            setUser(user_name);
        } else {
            setStatus('');
            setUser('')
        }
    }, [token, user_name])

    const logout = (): void => {
        localStorage.clear();
        setTimeout(() => {
            setStatus('');
            navigate('/login')
        }, 1000)
    }

    return (
        <div>
            <header>
                <Link className='logo' to='/register'>
                    <h1  onClick={(): void => {
                        localStorage.clear();
                    }} >EventOrganizer</h1>
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

                        {token && <div className="h-link" onClick={() => {
                            navigate('/participants')
                        }}>Participants</div>}

                    </div>
                    <div className='user-status'>
                        <div className='statusWrap'>{status ? <div className='online'>Online</div> : <div className='offline'>Offline</div>}</div>

                        <div className='userName'>{status ? <div>Hi, <span className='online-user'>{user}</span><div className="logout-wrap"><span onClick={() => logout()} className="logout">Logout</span></div></div> : ''}</div>
                    </div>
                </div>
            </header>
            {children}
            <footer>© 2022 Potatus Fritus, Inc.</footer>
        </div>
    )
}

export default Layout;