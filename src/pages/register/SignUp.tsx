import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@suid/material";
import { Component, createEffect, createSignal } from "solid-js";
import { FaBrandsRedditAlien } from "solid-icons/fa";
import { Visibility, VisibilityOff } from "@suid/icons-material";
import AuthBtn from "../../components/common/AuthBtn";
import toast from "solid-toast";
import { API_BACKEND } from "../../services/backend";
import PrivacyTipRoundedIcon from "@suid/icons-material/PrivacyTipRounded";
import { useNavigate } from "@solidjs/router";
import useAuthAppStore from "../../store/store";

const SignUp: Component = () => {
  const [showPassword, setShowPassword] = createSignal(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword());
  const handleMouseDownPassword = (event: MouseEvent) => event.preventDefault();

  const navigate = useNavigate();

  const userFromStore = useAuthAppStore((s) => s.user); //optimize code

  if (userFromStore?._id) {
    navigate(`/user/home`);
    return null; // Prevent rendering children if user is not authenticated yet.
  }

  const [value, setValue] = createSignal({
    first_name: "Mariano",
    last_name: "Diaz",
    email: "diazantony9997@gmail.com",
    password: "Test@123",
  });

  const [error, setError] = createSignal({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleInputChange = (field: string, input: string) => {
    setValue((prev) => ({ ...prev, [field]: input }));

    // Reset error when input is corrected
    setError((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const submitForm = async (event: MouseEvent) => {
    event.preventDefault();

    let hasError = false;
    const errors = { first_name: "", last_name: "", email: "", password: "" };

    if (value().first_name.length < 3) {
      errors.first_name = "First name must be at least 3 characters long.";
      hasError = true;
    }

    if (value().last_name.length < 3) {
      errors.last_name = "Last name must be at least 3 characters long.";
      hasError = true;
    }

    if (!validateEmail(value().email)) {
      errors.email = "Enter a valid email address.";
      hasError = true;
    }

    if (!validatePassword(value().password)) {
      errors.password =
        "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.";
      hasError = true;
    }

    setError(errors);

    if (!hasError) {
      try {
        const response = await fetch(`${API_BACKEND}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value()),
        });

        const res = await response.json(); // Parse the response data as JSON

        // can use but below we use 307 (check purpose that's why)
        // if (!response.ok) {
        //   return toast.error(res.message);
        // }

        if (response.status == 400) {
          return toast.error(res.message);
        }

        if (response.status == 307) {
          toast(res?.message, {
            icon: <PrivacyTipRoundedIcon color="primary" />,
            position: "top-right",
          });
          navigate("/otp", {
            replace: true,
            state: {
              user: res.data, //_id
            },
          });
        } else if (response.status == 201) {
          toast.success(res?.message);
          navigate("/otp", {
            replace: true,
            state: {
              user: res.data, //_id
            },
          });
        }
      } catch (error) {
        // Handle errors (network errors, JSON parsing errors, etc.)
        if (error instanceof SyntaxError) {
          toast.error("Failed to parse response. Please try again.");
        } else if (error instanceof Error) {
          // Catch fetch errors (e.g., network issues, timeout)
          toast.error(error.message || "An error occurred.");
        } else {
          toast.error("An unknown error occurred");
        }
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
      }}
    >
      <Card
        sx={{ gap: "1em", padding: "2em", width: { md: "700px", xs: "100%" } }}
      >
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
            <FaBrandsRedditAlien size={50} color="#666362" />
          </Box>
          <Grid container spacing={4}>
            <Grid item md={6} xs={12}>
              <TextField
                id="first-name"
                label="First Name"
                variant="standard"
                size="small"
                type="text"
                fullWidth
                value={value().first_name}
                onChange={(e) =>
                  handleInputChange(
                    "first_name",
                    (e.target as HTMLInputElement).value
                  )
                }
                error={Boolean(error().first_name)}
                helperText={error().first_name}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                id="last-name"
                label="Last Name"
                variant="standard"
                size="small"
                type="text"
                fullWidth
                value={value().last_name}
                onChange={(e) =>
                  handleInputChange(
                    "last_name",
                    (e.target as HTMLInputElement).value
                  )
                }
                error={Boolean(error().last_name)}
                helperText={error().last_name}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                id="email"
                label="Email"
                variant="standard"
                size="small"
                type="email"
                fullWidth
                value={value().email}
                onChange={(e) =>
                  handleInputChange(
                    "email",
                    (e.target as HTMLInputElement).value
                  )
                }
                error={Boolean(error().email)}
                helperText={error().email}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl
                variant="standard"
                size="small"
                fullWidth
                error={Boolean(error().password)}
              >
                <InputLabel for="standard-adornment-password">
                  Password
                </InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={showPassword() ? "text" : "password"}
                  value={value().password}
                  onChange={(e) =>
                    handleInputChange(
                      "password",
                      (e.target as HTMLInputElement).value
                    )
                  }
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
                {Boolean(error().password) && (
                  <FormHelperText>{error().password}</FormHelperText>
                )}
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

export default SignUp;
