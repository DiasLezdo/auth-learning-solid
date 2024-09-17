import { Component, createEffect } from "solid-js";
import { Box, Typography } from "@suid/material";
import { useLocation } from "@solidjs/router";

const Home: Component<{}> = (props) => {
  const location = useLocation();

  // get state from URL
  createEffect(() => console.log("location", location.state));

  return (
    <Box>
      <Typography variant="h1">Hello Home</Typography>
    </Box>
  );
};

export default Home;
