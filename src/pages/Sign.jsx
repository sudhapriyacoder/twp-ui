import React from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import { setUser } from "../store/userSlice";
import { Box } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import { useDispatch } from "react-redux";

const AuthUI = ({ onLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleLogin = async (credentialResponse) => {
    const token = credentialResponse.credential;
    console.log("Google Credential Response:", credentialResponse);

    try {
      const res = await axiosInstance.post(`/api/auth/google`, { token });
      
      const decoded = jwtDecode(res.data.token);
      localStorage.setItem("token", res.data.token);

      // Save user in redux
      dispatch(setUser({ id: decoded.id, email: decoded.email }));

      // Optionally call onLogin callback if you use it
      if (onLogin) onLogin(decoded);

      // Redirect to dashboard
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
            border: '2px solid #fff',
          }}
      >
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => console.log("Google Login Failed")}
        />
          {/* Example: Add a TextField for email/password login if needed */}
          {/* <TextField label="Email" variant="outlined" fullWidth sx={{ mt: 2, input: { color: '#fff' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#fff' } }, '& .MuiInputLabel-root': { color: '#fff' } }} /> */}
      </Box>
    </Box>
  );
};

export default AuthUI;
