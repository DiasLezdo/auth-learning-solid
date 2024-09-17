import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@suid/material";
import { Component, createEffect, createMemo, createSignal } from "solid-js";
import OTPInput from "../../components/common/OtpInput";
import { AiOutlineFieldNumber } from "solid-icons/ai";
import toast from "solid-toast";
import apiClient, { API_BACKEND } from "../../services/backend";
import { useLocation, useNavigate } from "@solidjs/router";
import useAuthAppStore from "../../store/store";

interface User {
  email: string;
  first_name: string;
  last_name: string;
  _id: string;
}

const Otp: Component<{}> = (props) => {
  const [value, setValue] = createSignal("");
  const [count, setCount] = createSignal(30);
  const [resetOtp, setResetOtp] = createSignal(false); // Add reset signal

  const setUserToStore = useAuthAppStore((s) => s.addUser); //optimize code

  const handleComplete = (otp: string) => {
    // console.log("OTP Entered:", otp);
    setValue(otp);
  };

  const handleReset = () => {
    setValue(""); // Clear the OTP value in the parent component
  };

  const location = useLocation();
  const navigate = useNavigate();
  const state = createMemo(() => location.state as { user?: User });
  const { user } = state();

  createEffect(() => {
    if (!user) {
      navigate(`/`);
    }
  });

  const handleResend = async (event: MouseEvent) => {
    event.preventDefault();

    if (!user) {
      navigate(`/home`);
    }

    try {
      const res = await apiClient.post("/verify/resent", { id: user?._id });
      handleReset();
      setResetOtp(true); // Trigger OTP reset
    } catch (error) {
      console.error("An error occurred:", error);
    }

    setCount(30);
  };

  const handleOtp = async (event: MouseEvent) => {
    event.preventDefault();
    if (!user) {
      navigate(`/`);
    }
    if (value().length !== 6) {
      return toast.error("Invalid OTP");
    }
    try {
      const response = await fetch(`${API_BACKEND}/verify/${user?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ otp: value() }),
      });

      const res = await response.json(); // Parse the response data as JSON

      if (response.status == 200) {
        toast.success(res?.message);
        setUserToStore(res?.user);
        // localStorage.setItem("user", JSON.stringify(res?.user));
        navigate("/user/profile", {
          replace: true,
        });
        setResetOtp(true); // Trigger OTP reset
        handleReset();
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  createEffect(() => {
    if (count() > 0) {
      setTimeout(() => setCount(count() - 1), 1000);
    } else {
      setCount(0);
    }
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "10vh",
      }}
    >
      <Card sx={{ gap: "1em", padding: "2em" }}>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: "1em",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <AiOutlineFieldNumber size={50} color="#666362" />
          </Box>
          <Typography variant="overline" color="primary">
            ENter OTP :
          </Typography>
          <OTPInput
            length={6}
            onComplete={handleComplete}
            onReset={handleReset}
            resetSignal={resetOtp()} // Pass reset signal
          />
          <Button
            variant="outlined"
            sx={{ textTransform: "none" }}
            disabled={count() !== 0}
            onClick={handleResend}
          >
            {count() ? ` Resent ${count()}s` : "Resent"}
          </Button>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: "2em",
          }}
        >
          <Button variant="contained" onClick={handleOtp}>
            Submit
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Otp;
