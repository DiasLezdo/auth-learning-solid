import { Avatar, Grid, Paper, Stack, Typography } from "@suid/material";
import { Component, createEffect } from "solid-js";

interface UserProfile {
  bio: string;
  first_name: string;
  last_name: string;
  photo: string; // URL for the photo
  user_name: string;
}

const UserDetails: Component<UserProfile> = (props) => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: "1em" }}>
            <Stack direction="column" spacing={2} alignItems="center">
              <Avatar
                alt="Remy Sharp"
                src={props?.photo}
                sx={{
                  width: { md: 150, sm: 80, xs: 56 },
                  height: { md: 150, sm: 80, xs: 56 },
                }}
              />
              <Typography variant="h6" color="secondary">
                {props?.first_name} {props?.last_name}
              </Typography>

              <Typography variant="button" color="secondary">
                {props?.user_name}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ padding: "1em" }}>
            <Stack direction="column" spacing={2} alignItems="center">
              <Typography variant="button" color="secondary">
                Bio
              </Typography>
              <Typography variant="caption" color="secondary">
                {props?.bio}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default UserDetails;
