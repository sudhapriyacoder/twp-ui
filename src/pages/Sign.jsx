import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import {setUser} from "../store/userSlice";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import { useDispatch } from "react-redux";


const  AuthUI = ({ onLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [tab, setTab] = useState(0); // 0 = Sign In, 1 = Sign Up
  // const [signinData, setSigninData] = useState({ email: "", password: "" });
  // const [signupData, setSignupData] = useState({
  //   name: "",
  //   email: "",
  //   password: "",
  //   confirmPassword: "",
  // });

  // const handleTabChange = (event, newValue) => {
  //   setTab(newValue);
  // };

  // const handleSignIn = async () => {
  //   try {
  //     const res = await axiosInstance.post(`/api/auth/login`, signinData);
  //     localStorage.setItem("token", res.data.token);
  //     onLogin(jwtDecode(res.data.token));
  //   } catch (err) {
  //     console.error("Login failed", err);
  //   }
  // };

  // const handleSignUp = async () => {
  //   if (signupData.password !== signupData.confirmPassword) {
  //     alert("Passwords do not match!");
  //     return;
  //   }
  //   try {
  //     const res = await axiosInstance.post(`/api/auth/register`, signupData);
  //     localStorage.setItem("token", res.data.token);
  //     onLogin(jwtDecode(res.data.token));
  //   } catch (err) {
  //     console.error("Registration failed", err);
  //   }
  // };

  const handleGoogleLogin = async (credentialResponse) => {
    const token = credentialResponse.credential;
    console.log(credentialResponse);
    try {
      const res = await axiosInstance.post(`/api/auth/google`, { token });
      
      // onLogin(jwtDecode(res.data.token));
      // navigate('/dashboard')

      const decoded = jwtDecode(res.data.token);
      localStorage.setItem("token", res.data.token);

      // save user in redux
      dispatch(setUser({ id: decoded.id, email: decoded.email })); 

      // onLogin(decoded); 
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: 400,
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
         <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log("Google Login Failed")}
            />
        {/* <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>

        {tab === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={signinData.email}
              onChange={(e) =>
                setSigninData({ ...signinData, email: e.target.value })
              }
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={signinData.password}
              onChange={(e) =>
                setSigninData({ ...signinData, password: e.target.value })
              }
            />
            <Button variant="contained" fullWidth onClick={handleSignIn}>
              Login
            </Button>

            <Divider sx={{ my: 1 }}>OR</Divider>

            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log("Google Login Failed")}
            />
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Name"
              fullWidth
              value={signupData.name}
              onChange={(e) =>
                setSignupData({ ...signupData, name: e.target.value })
              }
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              value={signupData.confirmPassword}
              onChange={(e) =>
                setSignupData({ ...signupData, confirmPassword: e.target.value })
              }
            />
            <Button variant="contained" fullWidth onClick={handleSignUp}>
              Register
            </Button>

            <Divider sx={{ my: 1 }}>OR</Divider>

            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log("Google Login Failed")}
            />
          </Box>
        )} */}
      </Box>
    </Box>
  );
}

export default AuthUI;