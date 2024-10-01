import { Box, Card, Container, Grid, Typography } from "@suid/material";
import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
} from "solid-js";
import MessageUsers from "../../components/messages/MessageUsers";
import MessageBox from "../../components/messages/MessageBox";
import MessageQueries from "../../components/messages/MessageQueries";
import Messagers from "../../components/messages/Messagers";
import apiClient from "../../services/backend";
import useAuthAppStore from "../../store/store";

const About: Component<{}> = (props) => {
  const userDetail = useAuthAppStore((s) => s.user); //optimize code

  const [user, setUser] = createSignal<string>("");

  // API fetch function with pagination and search
  const fetchMessages = async () => {
    const response = await apiClient.get(`/message/${user()}`);
    return response.data;
  };

  const [messages, { refetch }] = createResource(() => {
    if (user()) {
      return fetchMessages();
    }
  });

  createEffect(() => {
    if (user()) {
      refetch();
    }
  });

  return (
    <>
      <Container maxWidth="md" sx={{ marginTop: "5em" }}>
        <Grid container>
          <Grid item md={4} xs={12} maxHeight={"70vh"} overflow="auto">
            <Messagers setUser={setUser} />
          </Grid>
          <Grid item md={8} xs={12}>
            <Card>
              <Box
                sx={{
                  minHeight: "70vh",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <MessageQueries
                  messages={messages()?.data}
                  currentUser={userDetail?.user_name ?? ""}
                />
                <MessageBox user={user()} />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default About;
