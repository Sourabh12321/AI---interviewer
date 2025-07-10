import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from "react-router-dom";
import "../css/LoginSignup.css";
import { login, sendOtp, signup } from "../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";

const LoginSignupToggle = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const LoginStore = useSelector((store) => store?.auth);

    const [isSignup, setIsSignup] = useState(false);
    const [showOtpField, setShowOtpField] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        otp: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (isSignup && !showOtpField) {
            if (!formData.name || formData.name.trim().length < 3) {
                newErrors.name = "Name must be at least 3 characters.";
            }
        }

        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email format.";
        }

        if (!showOtpField) {
            if (!formData.password || formData.password.length < 6) {
                newErrors.password = "Password must be at least 6 characters.";
            }
        }

        if (showOtpField && isSignup && !formData.otp) {
            newErrors.otp = "OTP is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (!validate()) return;
        dispatch(sendOtp({ email: formData.email, name: formData.name }));
        setShowOtpField(true);
    };

    const handleSignup = (e) => {
        e.preventDefault();
        if (!validate()) return;
        dispatch(signup(formData));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (!validate()) return;
        dispatch(login(formData));
    };

    useEffect(() => {
        const msg = LoginStore?.user?.message;
        if (msg) {
            alert(msg);

            if (msg === "User registered successfully") {
                setIsSignup(false);
                setShowOtpField(false);
                setFormData({ name: "", email: "", password: "", otp: "" });
            }

            if (msg === "Login successful") {
                localStorage.setItem("token", LoginStore?.user?.token);
                navigate("/resume"); // Redirect after login
            }
        }
    }, [LoginStore?.user?.message]);

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>{isSignup ? "Sign Up" : "Log In"}</h2>
                <form>
                    {isSignup && !showOtpField && (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <p className="error-text">{errors.name}</p>}
                        </>
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className="error-text">{errors.email}</p>}

                    {!showOtpField && (
                        <>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && <p className="error-text">{errors.password}</p>}
                        </>
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
                                />
                                {errors.otp && <p className="error-text">{errors.otp}</p>}
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
                        setFormData({ name: "", email: "", password: "", otp: "" });
                        setErrors({});
                    }}>
                        {isSignup ? "Log In" : "Sign Up"}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LoginSignupToggle;
