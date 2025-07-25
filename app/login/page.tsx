"use client";
import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  useLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/lib/store/authApi";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setAuth } from "@/lib/store/authSlice";
import AuthRedirect from "@/components/Authroute/AuthRedirect";
import StudentFormBanner from "@/components/StudentFormBanner/StudentFormBanner";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
const [errors, setErrors] = useState<{ phoneNumber?: string; otp?: string }>({});
  const [serviceId, setServiceId] = useState("");
  const [form, setForm] = useState({ phoneNumber: "", otp: "" });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" as "success" | "error" | "info",
  });

  const [login] = useLoginMutation();
  const [sendOtp] = useSendOtpMutation();
  const [verifyOtp] = useVerifyOtpMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  // Only allow numbers for 'phoneNumber' and 'otp'
  const numericFields = ["phoneNumber", "otp"];
  const newValue = numericFields.includes(name) ? value.replace(/\D/g, "") : value;

  setForm((prev) => ({ ...prev, [name]: newValue }));
};

const validateOtp = () => {
  const newErrors: typeof errors = {};
  if (!form.otp) {
    newErrors.otp = "OTP is required";
  } else if (!/^\d{6}$/.test(form.otp)) {
    newErrors.otp = "OTP must be exactly 6 digits";
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
const validatePhoneNumber = () => {
  const newErrors: typeof errors = {};
  const phoneRegex = /^[6-9]\d{9}$/; // Valid Indian mobile number

  if (!form.phoneNumber) {
    newErrors.phoneNumber = "Phone number is required";
  } else if (!phoneRegex.test(form.phoneNumber)) {
    newErrors.phoneNumber = "Enter a valid 10-digit Indian phone number";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleLogin = async () => {
     if (!validatePhoneNumber()) return;
    try {
      setLoading(true);
      const res = await login({ phoneNumber: form.phoneNumber }).unwrap();
      if (res.success) {
        
        // await sendOtp({ phoneNumber: form.phoneNumber }).unwrap();
         setServiceId(res.sessionId)
        setStep(2);
        setSnackbar({ open: true, message: "OTP sent", severity: "success" });
      } else {
        setSnackbar({ open: true, message: res.message, severity: "error" });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err?.data?.message || "Login failed",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
     if (!validateOtp()) return;
    try {
      setLoading(true);
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

        setSnackbar({
          open: true,
          message: "Login Successful!",
          severity: "success",
        });

        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setSnackbar({
          open: true,
          message: res.message || "Invalid OTP",
          severity: "error",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err?.data?.message || "Verification failed",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthRedirect>
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
      sx={{ maxWidth: 400, width: "100%", mx: "auto"}}
      className="bg-white p-6 rounded-sm"
    >
      <Typography variant="h5" className="text-black">
        Login
      </Typography>
      {step === 1 ? (
        <>
          <TextField
            name="phoneNumber"
            label="Phone Number"
            fullWidth
            value={form.phoneNumber}
            margin="normal"
            required
            onChange={handleChange}
             error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
          />
          <Typography variant="body2" className="text-black" align="right" sx={{ mt: 1 }}>
           {" Don't have an account?"}{" "}
            <Button variant="text" onClick={() => router.push("/signup")}>
              Sign up
            </Button>
          </Typography>
          <Button
            onClick={handleLogin}
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Send OTP"}
          </Button>
        </>
      ) : (
        <>
          <TextField
            name="otp"
            label="Enter OTP"
            fullWidth
            value={form.otp}
            margin="normal"
            required
             error={!!errors.otp}
                helperText={errors.otp}
            onChange={handleChange}
          />
          <Button
            onClick={handleVerify}
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Verify OTP"}
          </Button>
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
        </Box>
    </Box>
    </AuthRedirect>
  );
}
