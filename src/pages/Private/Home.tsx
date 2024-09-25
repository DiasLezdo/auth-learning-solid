import { Component, createEffect } from "solid-js";
import { Box, Container, Typography } from "@suid/material";
import { useLocation } from "@solidjs/router";
import AddPost from "../../components/post/AddPost";
import Posts from "../../components/post/Posts";

const Home: Component<{}> = (props) => {
  const location = useLocation();

  // get state from URL
  createEffect(() => console.log("location", location.state));

  return (
    <Container >
      <AddPost />
      <Posts />
    </Container>
  );
};

export default Home;
