import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@suid/material";
import { Component, createEffect, createSignal, For, onMount } from "solid-js";
import { Message, MessageFiles, MessagePagination } from "../../types/posts";
import { optimizeImageUrl } from "../../services/optimizeImage";
import DoneRoundedIcon from "@suid/icons-material/DoneRounded";
import DoneAllRoundedIcon from "@suid/icons-material/DoneAllRounded";
import DeleteForeverRoundedIcon from "@suid/icons-material/DeleteForeverRounded";
import apiClient from "../../services/backend";

interface Props {
  messages: Message[] | undefined; // Expecting an array of messages or undefined
  currentUser: string;
  setPage: () => void;
  pagination: MessagePagination | undefined;
}

const MessageQueries: Component<Props> = (props) => {
  createEffect(() => console.log("props", props.messages));

  const [modal, setModal] = createSignal<MessageFiles>({} as MessageFiles);

  const deleteMessage = async (id: string) => {
    try {
      const response = await apiClient.delete(`/message/${id}`);
      if (response.status === 200) {
        console.log("Message deleted successfully");
        // Refetch messages after deletion
        // setMessages((prev) => prev.filter((m) => m._id!== id));
      } else {
        console.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  let boxRef!: HTMLDivElement;

  const scrollToBottom = () => {
    if (boxRef && props.pagination?.currentPage == 1) {
      boxRef.scrollTop = boxRef.scrollHeight;
    }
  };

  // On mount and when messages change, scroll to the bottom
  onMount(scrollToBottom);

  const handleScroll = () => {
    if (
      (props.pagination?.currentPage ?? 0) >=
      (props.pagination?.totalPages ?? 0)
    ) {
      return;
    } else if (boxRef.scrollTop === 0) {
      console.log("scolling", props.pagination?.currentPage);
      console.log("scolling2", props.pagination?.totalPages);

      props.setPage();
    }
  };

  return (
    <>
      <Box
        sx={{
          height: "56vh",
          position: "absolute",
          top: "0",
          width: "100%",
          padding: "1em 0.5em",
          overflowY: "auto",
        }}
        ref={boxRef}
        onScroll={handleScroll}
      >
        {/* Render messages if they exist */}
        {props.messages && props.messages.length > 0 && (
          <For each={props.messages}>
            {(message) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    message.sender.user_name === props.currentUser
                      ? "flex-end"
                      : "flex-start",
                }}
                mb={2}
              >
                <Avatar
                  src={optimizeImageUrl(message.sender.photo)}
                  alt={message.sender.first_name}
                  sx={{ mr: 2 }}
                />

                <Box
                  sx={{
                    maxWidth: "70%", // Limit message width
                    padding: "0.5em",
                    borderRadius: "10px",
                    bgcolor:
                      message.sender.user_name === props.currentUser
                        ? "primary.main"
                        : "grey.300", // Different background colors for sender and receiver
                    color:
                      message.sender.user_name === props.currentUser
                        ? "white"
                        : "black",
                    // textAlign:
                    //   message.sender.user_name === props.currentUser
                    //     ? "right"
                    //     : "left",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      {message.sender.first_name}
                    </Typography>
                    {message.sender.user_name === props.currentUser && (
                      <IconButton onClick={() => deleteMessage(message._id)}>
                        <DeleteForeverRoundedIcon
                          color="error"
                          sx={{ fontSize: "1rem", cursor: "pointer" }}
                        />
                      </IconButton>
                    )}
                  </Box>

                  <Typography variant="body2">{message.text}</Typography>
                  {message.files.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        "flex-wrap": "wrap",
                        // "flex-direction": "row",
                      }}
                    >
                      {message.files?.map((file) => (
                        <div
                          style={{
                            margin: "1px",
                            cursor: "pointer",
                          }}
                        >
                          {file?.format?.includes("image") ? (
                            <img
                              src={optimizeImageUrl(file?.url, 100, "")}
                              alt={file.original_name}
                              width="100"
                              height="100"
                              onClick={() => setModal(file)}
                            />
                          ) : file.format?.includes("video") ? (
                            <video
                              src={optimizeImageUrl(file?.url, 100, "")}
                              width="100%"
                              height="200"
                              controls // Added controls for video playback
                              onClick={() => setModal(file)}
                            />
                          ) : (
                            <Avatar
                              src={file?.url}
                              alt={file.original_name}
                              sx={{ width: 50, height: 50, margin: "0 5px" }}
                              variant="rounded"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <Typography variant="caption" color="text.disabled">
                      {new Date(message.createdAt).toLocaleString()}{" "}
                      {/* Format timestamp */}
                    </Typography>
                    {message.read ? (
                      <DoneAllRoundedIcon
                        color="secondary"
                        sx={{ fontSize: "1rem" }}
                      />
                    ) : (
                      <DoneRoundedIcon
                        color="secondary"
                        sx={{ fontSize: "1rem" }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </For>
        )}
      </Box>
      {/* dialog */}
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={modal().url ? true : false}
        onClose={() => setModal({} as MessageFiles)}
      >
        <DialogContent
          sx={{
            padding: "1em",
            paddingTop: "1em !important",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5em",
          }}
        >
          <Box sx={{ padding: "0.5em" }}>
            {modal()?.format?.includes("video") ? (
              <video
                src={modal()?.url}
                width="100%"
                height="auto"
                controls // Added controls for video playback
              />
            ) : (
              <img
                src={modal()?.url}
                alt={modal().original_name}
                width="100%"
                height="auto"
              />
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MessageQueries;
