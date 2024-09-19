import { Component } from "solid-js";
import googleIcon from "../../assets/auth/google-color-svgrepo-com.svg";
import twitter from "../../assets/auth/twitter-svgrepo-com.svg";
import github from "../../assets/auth/github-svgrepo-com.svg";
import { Button, Grid } from "@suid/material";
import apiClient, { API_BACKEND } from "../../services/backend";

const AuthBtn: Component<{}> = (props) => {
  const oauth = async (url: string) => {
    window.location.href = API_BACKEND + "/auth/" + url;
  };

  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item md={4} xs={12} container justifyContent="center">
        <Button variant="outlined" onClick={() => oauth("google")}>
          <img
            src={googleIcon}
            alt="google"
            height={20}
            width={20}
            style={{ "padding-right": "10px", scale: "1.0" }}
          />{" "}
          Google
        </Button>
      </Grid>
      <Grid item md={4} xs={12} container justifyContent="center">
        <Button variant="outlined" onClick={() => oauth("twitter")}>
          <img
            src={twitter}
            alt="twitter"
            height={20}
            width={20}
            style={{ "padding-right": "10px", scale: "1.0" }}
          />
          Twitter
        </Button>
      </Grid>
      <Grid item md={4} xs={12} container justifyContent="center">
        <Button variant="outlined" onClick={() => oauth("github")}>
          <img
            src={github}
            alt="github"
            height={20}
            width={20}
            style={{ "padding-right": "10px", scale: "1.0" }}
          />
          Github
        </Button>
      </Grid>
    </Grid>
  );
};

export default AuthBtn;
