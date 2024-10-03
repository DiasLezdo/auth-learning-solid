import {
  Box,
  Card,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@suid/material";
import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  Show,
} from "solid-js";
import MessageBox from "../../components/messages/MessageBox";
import MessageQueries from "../../components/messages/MessageQueries";
import Messagers from "../../components/messages/Messagers";
import apiClient from "../../services/backend";
import useAuthAppStore from "../../store/store";
import { Message } from "../../types/posts";
import DeleteOutlineRoundedIcon from "@suid/icons-material/DeleteOutlineRounded";

const About: Component<{}> = (props) => {
  const userDetail = useAuthAppStore((s) => s.user); //optimize code

  const [user, setUser] = createSignal<string>("");
  const [messagesList, setMessagesList] = createSignal<Message[]>([]);
  const [page, setPage] = createSignal<number>(1);

  // API fetch function with pagination and search
  const fetchMessages = async (page: number | string) => {
    const response = await apiClient.get(
      `/message/${user()}?page=${page}&limit=20`
    );
    return response.data;
  };

  // API fetch function with pagination and search
  const readChat = async () => {
    const response = await apiClient.patch(`/message/${user()}/read`);
    return response.data;
  };

  // const [messages, { refetch }] = createResource(
  //   () => page() && user(),
  //   () => {
  //     if (user()) {
  //       return Promise.all([readChat(), fetchMessages(page())]);
  //     }
  //   }
  // );

  const [messages, { refetch }] = createResource(
    () => [user(), page()], // Ensure both are dependencies
    async ([user, page]) => {
      if (user) {
        return Promise.all([readChat(), fetchMessages(page)]);
      }
    }
  );

  createEffect(() => console.log("message()", messages()?.[1]?.data));
  // createEffect(() => refetch([null, fetchMessages(page())]));

  createEffect(() => {
    if (user()) {
      setMessagesList([]);
      setPage(1);
      // refetch();
    }
  });

  createEffect(() => {
    if (messages()?.[1]?.data) {
      setMessagesList((prev) => [...messages()?.[1]?.data?.reverse(), ...prev]);
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
              <Show
                when={!messages?.loading}
                fallback={
                  <Box
                    sx={{
                      minHeight: "70vh",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress size="3rem" color="primary" />
                  </Box>
                }
              >
                <Box
                  sx={{
                    minHeight: "70vh",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {messagesList().length > 0 ? (
                    <MessageQueries
                      messages={messagesList()}
                      currentUser={userDetail?.user_name ?? ""}
                      setPage={() => setPage(page() + 1)}
                      pagination={messages()?.[1]?.pagination}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: "56vh",
                        position: "absolute",
                        top: "0",
                        width: "100%",
                        padding: "1em 0.5em",
                        overflowY: "auto",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="caption" color="secondary">
                          No messages found.
                        </Typography>
                        <DeleteOutlineRoundedIcon
                          color="warning"
                          sx={{ fontSize: "5rem" }}
                        />
                      </Box>
                    </Box>
                  )}
                  <MessageBox user={user()} />
                </Box>
              </Show>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default About;
