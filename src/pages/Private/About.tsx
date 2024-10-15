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
  on,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import MessageBox from "../../components/messages/MessageBox";
import MessageQueries from "../../components/messages/MessageQueries";
import Messagers from "../../components/messages/Messagers";
import apiClient from "../../services/backend";
import useAuthAppStore from "../../store/store";
import { Message } from "../../types/posts";
import DeleteOutlineRoundedIcon from "@suid/icons-material/DeleteOutlineRounded";
import socket from "../../services/socket";
import { useSearchParams } from "@solidjs/router";

const About: Component<{}> = (props) => {
  const userDetail = useAuthAppStore((s) => s.user); //optimize code

  const [searchParams, setSearchParams] = useSearchParams();
  

  const [user, setUser] = createSignal<string>(searchParams.user || "");
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

  const [readChatData, { refetch: refectRead }] = createResource(
    () => [user(), page()], // Ensure both are dependencies
    async ([user, page]) => {
      if (user) {
        return readChat();
      }
    }
  );

  const [messages, { mutate, refetch }] = createResource(
    () => [user(), page()], // Ensure both are dependencies
    async ([user, page]) => {
      if (user) {
        // return Promise.all([readChat(), fetchMessages(page)]);
        return fetchMessages(page);
      }
    }
  );

  //
  // const updateMap = readChatData()?.data?.reduce((map: any, msg: any) => {
  //   map[msg._id] = msg;
  //   return map;
  // }, {});

  // // Update the allMessages array
  // setMessagesList(
  //   messagesList()?.map((message: Message) => {
  //     const updated = updateMap[message._id];

  //     if (updated) {
  //       return {
  //         ...message,
  //         read: updated.read,
  //         updatedAt: updated.updatedAt,
  //       };
  //     }

  //     return message;
  //   })
  // );

  createEffect(
    on(user, (data) => {
      if (data) {
        setSearchParams({ user: data || "" });
      }
    })
  );

  createEffect(() => console.log("readChatData", readChatData()));

  // createEffect(() => {
  //   if (readChatData()?.data.length > 0) {
  //     // Create a lookup map for efficient updates
  //     const updateMap = readChatData()?.data?.reduce((map: any, msg: any) => {
  //       map[msg._id] = msg;
  //       return map;
  //     }, {});
  //     // Update the allMessages array
  //     setMessagesList(
  //       messagesList()?.map((message: Message) => {
  //         const updated = updateMap[message._id];
  //         if (updated) {
  //           return {
  //             ...message,
  //             read: updated.read,
  //             // updatedAt: updated.updatedAt,
  //           };
  //         }
  //         return message;
  //       })
  //     );
  //   }
  // });

  createEffect(
    on(readChatData, (data) => {
      if (data?.data.length > 0) {
        // Create a lookup map for efficient updates
        const updateMap = data.data.reduce((map: any, msg: any) => {
          map[msg._id] = msg;
          return map;
        }, {});
        // Update the allMessages array
        setMessagesList((prev) =>
          prev.map((message: Message) => {
            const updated = updateMap[message._id];
            if (updated) {
              return {
                ...message,
                read: updated.read,
              };
            }
            return message;
          })
        );
      }
    })
  );

  onMount(() => {
    const handler = (data: any) => {
      console.log("seen", data);
      const updateMap = data.data.reduce((map: any, msg: any) => {
        map[msg._id] = msg;
        return map;
      }, {});
      setMessagesList((prev) =>
        prev.map((message: Message) => {
          const updated = updateMap[message._id];
          if (updated) {
            return {
              ...message,
              read: updated.read,
            };
          }
          return message;
        })
      );
    };

    // refectRead();

    socket.on("messagesSeen", handler);

    onCleanup(() => {
      socket.off("messagesSeen", handler);
    });
  });

  createEffect(() => {
    if (user()) {
      setMessagesList([]);
      setPage(1);
      // refetch();
    }
  });

  createEffect(() => {
    if (messages()?.data) {
      setMessagesList((prev) => [...messages()?.data?.reverse(), ...prev]);
    }
  });

  const handleIncomingMessage = (message: Message) => {
    setMessagesList((prev) => [...prev, message]);
  };

  const filterDeletedMessage = (id: string) => {
    setMessagesList((prev) => prev?.filter((m) => m._id !== id));
  };

  onMount(() => {
    const handler = (data: any) => {
      console.log("Delete", data);
      filterDeletedMessage(data.data?._id);
    };

    // refectRead();

    socket.on("messagesDeleted", handler);

    onCleanup(() => {
      socket.off("messagesDeleted", handler);
    });
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
                      pagination={messages()?.pagination}
                      filterDeletedMessage={filterDeletedMessage}
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
                  <MessageBox
                    user={user()}
                    onMessageReceived={handleIncomingMessage}
                    refectRead={refectRead}
                  />
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
