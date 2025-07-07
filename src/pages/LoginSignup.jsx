import React, { useEffect, useState } from "react";
import { useDispatch,useSelector } from 'react-redux'
import "../css/LoginSignup.css";
import { login, sendOtp, signup } from "../redux/slice/authSlice";

const LoginSignupToggle = () => {
    const dispatch = useDispatch();
    const LoginStore = useSelector((store)=>store?.auth);
    const [isSignup, setIsSignup] = useState(false);
    const [showOtpField, setShowOtpField] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        otp: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    console.log('LoginStore',LoginStore)

    const handleSendOtp = (e) => {
        e.preventDefault();
        console.log("Sending OTP to:", { email: formData.email, name: formData.name });
        dispatch(sendOtp({ email: formData.email, name: formData.name }));
        setShowOtpField(true)
    };

    const handleSignup = (e) => {
        e.preventDefault();
        // Make API call to send OTP to email
        console.log("Sending OTP to:", formData.email);
        dispatch(signup(formData));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // Login API call
        console.log("Logging in:", formData);
        dispatch(login(formData));
    };

    useEffect(()=>{
        if(LoginStore?.user?.message){
            alert(LoginStore?.user?.message)
        }
    },[LoginStore?.user?.message])

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>{isSignup ? "Sign Up" : "Log In"}</h2>
                <form>
                    {isSignup && !showOtpField && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {!showOtpField && (
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    )}
                    {isSignup ? (
                        showOtpField ? (
                            <>
                                <input
                                    type="text"
                                    name="otp"
                                    placeholder="Enter OTP"
                                    value={formData.otp}
                                    onChange={handleChange}
                                    required
                                />
                                <button onClick={handleSignup}>Verify OTP</button>
                            </>
                        ) : (
                            <button onClick={handleSendOtp}>Send OTP</button>
                        )
                    ) : (
                        <button onClick={handleLogin}>Login</button>
                    )}
                </form>
                <p className="toggle-link">
                    {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                    <span onClick={() => {
                        setIsSignup(!isSignup);
                        setShowOtpField(false);
                    }}>
                        {isSignup ? "Log In" : "Sign Up"}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LoginSignupToggle;
