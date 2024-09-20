import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@suid/material";
import { Component, createEffect, createSignal, Show } from "solid-js";
import { AiOutlineFieldNumber } from "solid-icons/ai";
import { Visibility, VisibilityOff } from "@suid/icons-material";
import toast from "solid-toast";
import apiClient from "../../services/backend";
import { useNavigate } from "@solidjs/router";

const ForgotPassword: Component<{}> = (props) => {
  const [type, setType] = createSignal<"email" | "otp" | "password">("email");
  const [value, setValue] = createSignal<string>("");
  const [showPassword, setShowPassword] = createSignal(false);
  const [loading, setLoading] = createSignal<boolean>(false);
  const [user, setUser] = createSignal<{
    _id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  }>();

  const handleClickShowPassword = () => setShowPassword(!showPassword());
  const handleMouseDownPassword = (event: Event) => event.preventDefault();

  createEffect(() => {
    if (!user()?._id) {
      setType("email");
    }
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: MouseEvent | KeyboardEvent) => {
    e.preventDefault();

    if (type() == "email") {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!value() || !emailPattern.test(value())) {
        return toast.error("Enter a valid email address");
      }
      setLoading(true);
      try {
        const res = await apiClient.post(`/forgotPassword`, {
          email: value(),
        });
        console.log("res", res);
        if (res.status == 200) {
          toast.success(res?.data?.message);
          setUser(res.data?.data);
          setType("otp");
          setValue("");
        } else {
          toast.error(res?.data?.message);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setLoading(false);
      }
    } else if (type() == "password") {
      if (value().length < 8) {
        return toast.error(
          "Enter a valid Password should be at least 8 characters"
        );
      }
      setLoading(true);
      try {
        const res = await apiClient.post(
          `/forgotPassword/change/${user()?._id}`,
          {
            newpassword: value(),
          }
        );
        console.log("res", res);
        if (res.status == 200) {
          toast.success(res?.data?.message);
          setUser(res.data?.user);
          setType("email");
          setValue("");
          navigate("/");
        } else {
          toast.error(res?.data?.message);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setLoading(false);
      }
    } else if (type() == "otp") {
      if (!value()) {
        return toast.error("Enter a valid OTP");
      }
      setLoading(true);
      try {
        const res = await apiClient.post(
          `/forgotPassword/verify/${user()?._id}`,
          {
            email: user()?.email,
            otp: value(),
          }
        );
        console.log("res", res);
        if (res.status == 200) {
          toast.success(res?.data?.message);
          setUser(res.data?.user);
          setType("password");
          setValue("");
        } else {
          toast.error(res?.data?.message);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setLoading(false);
      }
    } else {
      return;
    }
  };

  return (
    <>
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

            <Show
              when={type() == "password"}
              fallback={
                <TextField
                  id="outlined-basic"
                  label={type() == "otp" ? "Enter OTP" : "Enter Your Email"}
                  variant="outlined"
                  type={type() == "otp" ? "number" : "email"}
                  fullWidth
                  value={value()}
                  onChange={(e) => setValue(e.target.value)}
                />
              }
            >
              <FormControl variant="standard" fullWidth>
                <InputLabel for="standard-adornment-password">
                  Password
                </InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={showPassword() ? "text" : "password"}
                  onChange={(e) => setValue(e.target.value)}
                  value={value()}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword() ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Show>
          </CardContent>
          <CardActions
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              gap: "2em",
            }}
          >
            <Button
              variant="contained"
              disabled={loading()}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </CardActions>
        </Card>
      </Box>
    </>
  );
};

export default ForgotPassword;
