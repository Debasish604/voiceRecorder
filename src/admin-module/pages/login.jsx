import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../style/Login.css';
import { apiService } from '../../service/api-service';
import SimpleBackdrop from "../../scenes/global/Loader";

function AdminLogin() {
    const [userName, setuserName] = useState("");
    const [password, setpassword] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        const formData = new FormData();
        formData.append('userName', userName);
        formData.append('password', password);

        try {
            setLoading(true);
            const apiData = await apiService.login(formData);
            // console.log('API Response:', apiData);

            if (apiData.status === 'success') {
                localStorage.setItem('apiData', JSON.stringify(apiData));
                localStorage.setItem('jwttoken', apiData.token);
                localStorage.setItem('Name', apiData.data[0].Name);

                toast.success(apiData.msg, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light"
                });

                setTimeout(() => {
                    navigate('/user-access');
                }, 1000);
            } else {
                toast.error(apiData.msg, {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        } catch (error) {
            console.error(error.msg);
            toast.error('An unexpected error occurred. Please try again later.', {
                position: toast.POSITION.TOP_CENTER
            });
        }
        finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="App">
            <div className="loginContainerSecondHalf">
                <section>
                    <h1 style={{ fontSize: 28, color: '#004b66' }} >DIT Admin Login</h1>
                    <div className="from_style">
                        <label className='form_label' >Username</label>
                        <input
                            type="text"
                            className="form_control"
                            name="userName"
                            value={userName}
                            onChange={(e) => setuserName(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <label className='form_label'>Password</label>
                        <input
                            type="password"
                            className="form_control"
                            name="password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>

                    <button onClick={handleLogin} className="loginBtn">Login</button>

                    <ToastContainer
                        position="top-center"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        toastStyle={{ width: 'auto' }}
                        theme="light" />
                </section>
            </div>
            <SimpleBackdrop open={loading} handleClose={() => { }} size={80} />
        </div>
    );
}

export default AdminLogin;