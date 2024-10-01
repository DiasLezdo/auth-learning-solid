import { Avatar, Box, Typography } from "@suid/material";
import { Component, createEffect, For } from "solid-js";
import { Message } from "../../types/posts";
import { optimizeImageUrl } from "../../services/optimizeImage";

interface Props {
  messages: Message[] | undefined; // Expecting an array of messages or undefined
  currentUser: string;
}

const MessageQueries: Component<Props> = (props) => {
  createEffect(() => console.log("props", props.messages));

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
      >
        {/* Render messages if they exist */}
        {props.messages && props.messages.length > 0 ? (
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
                {/* Display sender's avatar */}
                <Avatar
                  src={optimizeImageUrl(message.sender.photo)}
                  alt={message.sender.first_name}
                  sx={{ mr: 2 }}
                />
                {/* Message text and other details */}
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
                  <Typography variant="body1" fontWeight="bold">
                    {message.sender.first_name}
                  </Typography>
                  <Typography variant="body2">{message.text}</Typography>
                  <Typography variant="caption" color="text.disabled">
                    {new Date(message.createdAt).toLocaleString()}{" "}
                    {/* Format timestamp */}
                  </Typography>
                </Box>
              </Box>
            )}
          </For>
        ) : (
          <Typography>No messages found.</Typography>
        )}
      </Box>
    </>
  );
};

export default MessageQueries;
