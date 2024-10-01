import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Typography,
} from "@suid/material";
import { deepOrange } from "@suid/material/colors";
import { Component } from "solid-js";

import { A } from "@solidjs/router";
import { optimizeImageUrl } from "../../services/optimizeImage";

interface Props {
  user_name: string;
  profile: string;
  first_name: string;
  last_name: string;
}

interface Props2 {
  setUser: (value: string) => void;
}

const MessageUsers: Component<Props & Props2> = (props) => {
  return (
    <>
      <Paper
        sx={{ margin: "1em 0.5em", cursor: "pointer" }}
        onClick={() => props.setUser(props.user_name)}
      >
        <Grid
          container
          //   sx={{ margin: "0.5em 0.1em" }}
          direction="row"
          sx={{
            margin: "0.5em 0.1em",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.5em 0.2em",
          }}
        >
          <Grid item md={2} xs={2} justifyContent="flex-start">
            <A
              href={"/user/friend/" + props.user_name}
              style={{
                "text-decoration": "none",
              }}
            >
              <Avatar
                sx={{ bgcolor: deepOrange[500] }}
                variant="square"
                alt={props.first_name}
                src={optimizeImageUrl(props.profile)}
              />
            </A>
          </Grid>
          <Grid
            item
            md={8}
            xs={8}
            alignItems="center"
            justifyContent="flex-end"
          >
            <Typography variant="subtitle2" color="primary">
              {props.first_name}
            </Typography>
          </Grid>
          <Grid
            item
            md={2}
            xs={2}
            alignItems="center"
            justifyContent="flex-end"
          >
            Online
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default MessageUsers;
