import { Avatar, Box, Grid, Typography } from "@suid/material";
import { Component } from "solid-js";
import { Comment } from "../../../types/posts";

interface Props {
  comment: Comment;
}

const PostComment: Component<Props> = ({ comment: props }) => {
    
  return (
    <>
    
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1em",
            alignItems: "baseline",
            border: "1px solid black",
            margin: "10px 0",
            padding: "10px 5px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "1em",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Avatar src={props.user.photo} />
            <Typography variant="body2" color="primary">
              {props.user.first_name}
            </Typography>
          </Box>
          <Typography variant="caption" color="secondary">
            {props.text}
          </Typography>
        </Box>
    
    </>
  );
};

export default PostComment;
