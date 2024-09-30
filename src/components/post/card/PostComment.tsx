import { Avatar, Box, Grid, IconButton, Typography } from "@suid/material";
import { Component, Show } from "solid-js";
import { Comment } from "../../../types/posts";
import DeleteForeverRoundedIcon from "@suid/icons-material/DeleteForeverRounded";
import useAuthAppStore from "../../../store/store";
import apiClient from "../../../services/backend";
import { A } from "@solidjs/router";

interface Props {
  comment: Comment;
  refetch: () => void;
  postOwner: boolean;
  user: string;
  postId: string;
}

const PostComment: Component<Props> = ({
  comment: props,
  refetch,
  postOwner,
  user,
  postId,
}) => {
  const handleDeleteComment = async (id: string, postId: string) => {
    console.log("id", id + "post" + postId);

    try {
      const response = await apiClient.delete(`/post/comment/${postId}/${id}`);
      if (response.status === 200) {
        refetch();
      }
    } catch (error) {
      console.error(error);
    }
  };

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
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
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
            <A href={`/user/friend/${props.user.user_name}`}>
              <Avatar src={props.user.photo} />
            </A>
            <Typography variant="body2" color="primary">
              {props.user.first_name}
            </Typography>
          </Box>
          <Show when={postOwner || props.user.user_name == user}>
            <IconButton
              color="primary"
              class="cursor-pointer"
              onClick={() => handleDeleteComment(props._id, postId)}
            >
              <DeleteForeverRoundedIcon />
            </IconButton>
          </Show>
        </Box>
        <Typography variant="caption" color="secondary">
          {props.text}
        </Typography>
      </Box>
    </>
  );
};

export default PostComment;
