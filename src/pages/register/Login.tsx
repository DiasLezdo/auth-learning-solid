import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@suid/material";
import { Component, createSignal, useContext } from "solid-js";
import { BiSolidLogInCircle } from "solid-icons/bi";
import { Visibility, VisibilityOff } from "@suid/icons-material";
import AuthBtn from "../../components/common/AuthBtn";
import toast from "solid-toast";
import useAuthAppStore from "../../store/store";
import { useNavigate } from "@solidjs/router";
import apiClient from "../../services/backend";
import PrivacyTipRoundedIcon from "@suid/icons-material/PrivacyTipRounded";

const Login: Component<{}> = (props) => {
  const [showPassword, setShowPassword] = createSignal(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword());
  const handleMouseDownPassword = (event: Event) => event.preventDefault();

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
      }
      // toast.success(value().email);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "10vh",
      }}
    >
      {/* <Typography variant="h1" color="primary">
        Hello Login
      </Typography>
      <Typography variant="h1" color="primary">
        Current Theme: {theme().palette.mode}
      </Typography>

      <div>
        <h1>Theme {theme().palette.mode}</h1>
        <button onClick={() => changeTheme("light")}>Light Theme</button>
        <button onClick={() => changeTheme("dark")}>Dark Theme</button>
        <button onClick={() => changeTheme("red")}>Red Theme</button>
        <button onClick={() => changeTheme("blue")}>Blue Theme</button>
        <button onClick={() => changeTheme("green")}>Green Theme</button>
      </div> */}
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
    </Box>
  );
};

export default Login;
