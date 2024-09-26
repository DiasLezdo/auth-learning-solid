import { Component, createEffect, createSignal } from "solid-js";
import { Box, Container, Typography } from "@suid/material";
import { useLocation } from "@solidjs/router";
import AddPost from "../../components/post/AddPost";
import Posts from "../../components/post/Posts";

const Home: Component<{}> = (props) => {
  const location = useLocation();

  // get state from URL
  createEffect(() => console.log("location", location.state));

  const [trigger, setTrigger] = createSignal(false);

  createSignal(() =>
    setTimeout(() => {
      return setTrigger(false);
    }, 100)
  );

  return (
    <Container>
      <AddPost setTrigger={setTrigger} />
      <Posts trigger={trigger()} />
    </Container>
  );
};

export default Home;
