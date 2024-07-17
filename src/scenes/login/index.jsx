import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../style/Login.css';
import { apiService } from '../../service/api-service';
import Footer from '../../components/components/Footer';
import pwcLogo from '../../assets/image/pwc_logo.png';
import pwcCog from '../../assets/image/cognxio1.png';
import Checkbox from '@mui/material/Checkbox';

function Login() {
    const [apiData, setApiData] = useState({});
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        const formData = new FormData();
        formData.append('userName', userName);
        formData.append('password', password);

        try {
            setLoading(true);
            const apiResponse = await apiService.login(formData);

            if (apiResponse.status === 'success') {
                setApiData(apiResponse);
                localStorage.setItem('apiData', JSON.stringify(apiResponse));
                localStorage.setItem('jwttoken', apiResponse.token);
                localStorage.setItem('Name', apiResponse.data[0].Name);
                sessionStorage.setItem('username', apiResponse.data[0].Name);
                sessionStorage.setItem('jwttoken', apiResponse.token);
                localStorage.setItem('accessToken', apiResponse.accessToken);
                navigate('/dashboard');
                const timeoutDuration = 2 * 60 * 60 * 1000;
                setTimeout(() => handleLogout(), timeoutDuration);
            } else {
                // Handle invalid credentials
                toast.error('Invalid credentials. Please try again.');
            }
        } catch (error) {
            // Handle errors
            console.error(error);
            toast.error('An unexpected error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    const handleLogout = () => {
        setApiData({});
        localStorage.removeItem('apiData');
        localStorage.removeItem('jwttoken');
        localStorage.removeItem('Name');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('jwttoken');
        navigate('/');
    };

    const handleRememberMeChange = (event) => {
        setRememberMe(event.target.checked);
    };

    return (
        <>
            {loading && (
                <div className="loading-spinner">
                    <div className="loader"  ></div>
                </div>
            )}

            <div className="App">
                <img src={pwcLogo} alt="logo" className='pwc-logo-login' />
                <img src={pwcCog} alt="logo" className='cog-logo-login' />
                <div className='login-text-h'>Get to the pace right away</div>
                <div className='login-cognixio-card'>
                    <div className='Sign-in'>Sign-in</div>
                    <div className='form_label' >E-Mail</div>
                    <input
                        type="text"
                        className="form_control"
                        name="userName"
                        placeholder='Your e-mail'
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <label className='form_label'>Password</label>
                    <input
                        type="password"
                        placeholder='*****'
                        className="form_control"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-label="Enter your password"
                        onKeyPress={handleKeyPress}
                    />
                    <label className="checkbox-label">
                        <Checkbox
                            checked={rememberMe}
                            onChange={handleRememberMeChange}
                            sx={{
                                color: '#FFFFFF',
                                '&.Mui-checked': {
                                    color: '#FFFFFF',
                                },
                            }}
                        />
                        <span className='remember-me'> Remember me</span>
                    </label>
                    <div>
                        <button onClick={handleLogin} className="loginBtn" disabled={loading}>
                          Sign-in
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Login;
