import { Avatar, Box, Grid, Paper, Stack, Typography } from "@suid/material";
import { Component } from "solid-js";
import useAuthAppStore from "../../store/store";
import ThemeSelector from "../common/ThemeSelector";

const Details: Component<{}> = (props) => {
  const userDetail = useAuthAppStore((s) => s.user); //optimize code
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: "1em" }}>
            <Stack direction="column" spacing={2} alignItems="center">
              <Avatar
                alt="Remy Sharp"
                src={userDetail?.photo}
                sx={{
                  width: { md: 150, sm: 80, xs: 56 },
                  height: { md: 150, sm: 80, xs: 56 },
                }}
              />
              <Typography variant="h6" color="secondary">
                {userDetail?.first_name} {userDetail?.last_name}
              </Typography>
              <Typography variant="subtitle2" color="secondary">
                {userDetail?.email}
              </Typography>
              <Typography variant="button" color="secondary">
                {userDetail?.phone}
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
                {userDetail?.bio}
              </Typography>
              <ThemeSelector />
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Details;
