"use client";
import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useSignupMutation, useVerifyOtpMutation } from "@/lib/store/authApi";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import AuthRedirect from "@/components/Authroute/AuthRedirect";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setAuth } from "@/lib/store/authSlice";
import StudentFormBanner from "@/components/StudentFormBanner/StudentFormBanner";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    otp: "",
  });
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({
    open: false,
    message: "",
    severity: "info" as "success" | "error" | "info",
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const [signup] = useSignupMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  // Only allow numbers for 'phoneNumber' and 'otp'
  const numericFields = ["phoneNumber", "otp"];
  const newValue = numericFields.includes(name) ? value.replace(/\D/g, "") : value;

  setForm((prev) => ({ ...prev, [name]: newValue }));
};

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email)) newErrors.email = "Invalid email";
    if (!form.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    else if (!phoneRegex.test(form.phoneNumber))
      newErrors.phoneNumber = "Enter a valid 10-digit Indian phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.otp.trim()) newErrors.otp = "OTP is required";
    else if (!/^\d{6}$/.test(form.otp)) newErrors.otp = "OTP must be 6 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateStep1()) return;
    setLoading(true);
    try {
      const res = await signup(form).unwrap();
      if (res.success) {
        setServiceId(res.sessionId)
        setStep(2);
        setFeedback({
          open: true,
          message: res.message || "OTP sent!",
          severity: "success",
        });
      }
    } catch (err: unknown) {
      let errorMessage = "Something went wrong";

      if (err && typeof err === "object" && "data" in err) {
        const errorData = (err as FetchBaseQueryError).data as {
          message?: string;
        };
        errorMessage = errorData?.message || errorMessage;
      }

      setFeedback({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    try {
      const res = await verifyOtp({
        phoneNumber: form.phoneNumber,
        otp: form.otp,
        sessionId:serviceId
      }).unwrap();
      if (res.success && res.token) {
        const decodedUser = jwtDecode(res.token);

        // Store in sessionStorage
        sessionStorage.setItem("access_token", res.token);
        sessionStorage.setItem("user", JSON.stringify(decodedUser));

        // Store in Redux
        dispatch(setAuth({ token: res.token, user: decodedUser }));

        setFeedback({
          open: true,
          message: "Signup Successful!",
          severity: "success",
        });

        setTimeout(() => {
          router.push("/user/form");
        }, 1000);
      } else {
        setFeedback({
          open: true,
          message: res.message || "Invalid OTP",
          severity: "error",
        });
      }
    } catch (err: unknown) {
      let errorMessage = "Something went wrong";

      if (err && typeof err === "object" && "data" in err) {
        const errorData = (err as FetchBaseQueryError).data as {
          message?: string;
        };
        errorMessage = errorData?.message || errorMessage;
      }

      setFeedback({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthRedirect>
      <>
        {loading && <Loader />}
         <Box sx={{ display: "flex", height: "100vh", flexDirection: { xs: "column", md: "row" } }}>
                <StudentFormBanner />
                 <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 3,
                  }}
                >
        <Box
          sx={{ maxWidth: 400, mx: "auto"}}
          className="bg-white p-6 rounded-sm"
        >
          <Typography variant="h5" className="text-black font-bold">
            Signup
          </Typography>
          {step === 1 ? (
            <>
              <TextField
                name="name"
                label="Name"
                value={form.name}
                fullWidth
                margin="normal"
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={form.email}
                margin="normal"
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                name="phoneNumber"
                label="Phone Number"
                value={form.phoneNumber}
                fullWidth
                margin="normal"
                onChange={handleChange}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
              />
              <Typography
                variant="body2"
                className="text-black"
                align="right"
                sx={{ mt: 1 }}
              >
                {" Already have a account?"}{" "}
                <Button variant="text" onClick={() => router.push("/login")}>
                  Login
                </Button>
              </Typography>
              <Button onClick={handleSignup} variant="contained" fullWidth>
                Signup & Send OTP
              </Button>
            </>
          ) : (
            <>
              <TextField
                name="otp"
                label="Enter OTP"
                value={form.otp}
                fullWidth
                margin="normal"
                onChange={handleChange}
                 error={!!errors.otp}
                helperText={errors.otp}
              />
              <Button onClick={handleVerify} variant="contained" fullWidth>
                Verify OTP
              </Button>
            </>
          )}
        </Box>
        </Box>
        </Box>

        <Snackbar
          open={feedback.open}
          autoHideDuration={3000}
          onClose={() => setFeedback({ ...feedback, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            severity={feedback.severity}
            onClose={() => setFeedback({ ...feedback, open: false })}
          >
            {feedback.message}
          </Alert>
        </Snackbar>
      </>
    </AuthRedirect>
  );
}
