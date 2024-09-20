import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Slide,
  TextField,
  Typography,
} from "@suid/material";
import {
  Component,
  createSignal,
  JSXElement,
  Show,
  useContext,
} from "solid-js";
import { BiSolidLogInCircle } from "solid-icons/bi";
import { Visibility, VisibilityOff } from "@suid/icons-material";
import AuthBtn from "../../components/common/AuthBtn";
import toast from "solid-toast";
import useAuthAppStore from "../../store/store";
import { A, useNavigate } from "@solidjs/router";
import apiClient from "../../services/backend";
import PrivacyTipRoundedIcon from "@suid/icons-material/PrivacyTipRounded";
import { TransitionProps } from "@suid/material/transitions/transition";

const Transition = function Transition(
  props: TransitionProps & {
    children: JSXElement;
  }
) {
  return <Slide direction="up" {...props} />;
};

const Login: Component<{}> = (props) => {
  const [showPassword, setShowPassword] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword());
  const handleMouseDownPassword = (event: Event) => event.preventDefault();

  const [open, setOpen] = createSignal(false);
  const [mfa, setMfa] = createSignal("");

  const [authCode, setAuthCode] = createSignal<{
    id: string;
    mfa: number;
  }>(
    {} as {
      id: string;
      mfa: number;
    }
  );

  const handleClickOpen = (val: { id: string; mfa: number }) => {
    setAuthCode(val);
    setOpen(true);
  };

  const handleClose = () => {
    toast("Need code", {
      icon: <PrivacyTipRoundedIcon color="primary" />,
      position: "top-right",
    });
  };

  const setUserToStore = useAuthAppStore((s) => s.addUser); //optimize code

  const [value, setValue] = createSignal({
    email: "diazantony9997@gmail.com",
    password: "Test@12",
  });

  const userFromStore = useAuthAppStore((s) => s.user); //optimize code

  const navigate = useNavigate();
  if (userFromStore?._id) {
    navigate(`/user/home`);
    return null; // Prevent rendering children if user is not authenticated yet.
  }

  const submitForm = async (event: MouseEvent) => {
    event.preventDefault();
    if (value().email.length < 3) {
      toast.error("Enter Valid Email");
      return;
    }
    if (value().password.length < 8) {
      toast.error("Enter Valid Password");
      return;
    }
    try {
      // multiple api with one request if anyone fail all api would fails
      // const p = Promise.all([
      //   apiClient.post("/login", value()),
      //   apiClient.post("/logi", value()),
      // ]);

      // p.then((r) => console.log("r", r));

      const res = await apiClient.post("/login", value());
      if (res.status == 307) {
        toast(res?.data?.message, {
          icon: <PrivacyTipRoundedIcon color="primary" />,
          position: "top-right",
        });
        return navigate("/otp", {
          replace: true,
          state: {
            user: res.data?.user, //_id
          },
        });
      } else if (res.status == 200) {
        setUserToStore(res.data?.user);
        toast.success(res?.data?.message);
        navigate(`/user/home`, { replace: true });
      } else if (res.status == 202) {
        toast(res?.data?.message, {
          icon: <PrivacyTipRoundedIcon color="primary" />,
          position: "top-right",
        });
        handleClickOpen(res.data.data);
      }
      // toast.success(value().email);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleVerify2f = async () => {
    if (!authCode().id) {
      return;
    }
    setLoading(true);
    if (authCode().mfa == 1) {
      try {
        const res = await apiClient.post(`/verify/${authCode().id}`, {
          otp: mfa(),
        });
        console.log("res", res);
        if (res.status == 200) {
          toast.success(res?.data?.message);
          setUserToStore(res?.data?.user);
          // localStorage.setItem("user", JSON.stringify(res?.user));
          navigate("/user/profile", {
            replace: true,
          });
        } else {
          toast.error(res?.data?.message);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await apiClient.post(`/mfaUpdate/2fa/verify`, {
          token: mfa(),
          id: authCode().id,
        });
        console.log("res", res);
        if (res.status == 200) {
          toast.success(res?.data?.message);
          setUserToStore(res?.data?.user);
          navigate(`/user/home`, { replace: true });
        } else {
          toast.error(res?.data?.message);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "10vh",
        flexDirection: "column",
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
              // flexDirection: "column",
            }}
          >
            <BiSolidLogInCircle size={50} color="#666362" />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="standard-basic"
                label="Email"
                variant="standard"
                size="small"
                type="email"
                fullWidth
                onChange={(e) =>
                  setValue((prev) => {
                    return { ...prev, email: e.target.value };
                  })
                }
                value={value().email}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="standard" size="small" fullWidth>
                <InputLabel for="standard-adornment-password">
                  Password
                </InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={showPassword() ? "text" : "password"}
                  onChange={(e) =>
                    setValue((prev) => {
                      return { ...prev, password: e.target.value };
                    })
                  }
                  value={value().password}
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
            </Grid>
            <Grid item xs={12}>
              <Typography color="text.primary" sx={{ fontSize: "14px" }}>
                Forgot{" "}
                <A
                  href="/forgot"
                  style={{
                    "text-decoration": "none",
                  }}
                  activeClass="none"
                >
                  Password?
                </A>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: "2em",
          }}
        >
          <Button variant="contained" onClick={submitForm}>
            Submit
          </Button>
          <AuthBtn />
        </CardActions>
      </Card>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "5em",
          marginTop: ".3em",
        }}
      >
        <A
          href="/privacy"
          style={{
            "text-decoration": "none",
          }}
        >
          Privacy & Policy
        </A>
        <A
          href="/terms"
          style={{
            "text-decoration": "none",
          }}
        >
          Terms & Conditions
        </A>
      </Box>
      <Dialog
        fullWidth={true}
        TransitionComponent={Transition}
        maxWidth={"xs"}
        open={open()}
        onClose={handleClose}
      >
        <DialogTitle>
          MFA Code for {authCode().mfa == 1 ? "Email" : "Auth APP"}
        </DialogTitle>
        <DialogContent
          sx={{
            margin: "1em",
            padding: "1em",
            paddingTop: "1em !important",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Code"
            variant="outlined"
            type="number"
            fullWidth
            value={mfa()}
            onChange={(e) => setMfa(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Show
            when={loading()}
            fallback={
              <Button variant="outlined" onClick={handleVerify2f}>
                Enter
              </Button>
            }
          >
            <CircularProgress color="secondary" size={20} />
          </Show>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
