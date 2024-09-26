import {
  createEffect,
  createResource,
  createSignal,
  Show,
  Suspense,
} from "solid-js";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  IconButton,
  Box,
  Avatar,
  CircularProgress,
} from "@suid/material";
import ThumbUpIcon from "@suid/icons-material/ThumbUp";
import CommentIcon from "@suid/icons-material/Comment";
import ShareIcon from "@suid/icons-material/Share";
import { A } from "@solidjs/router";
import { Comment, Post } from "../../../types/posts";
import apiClient from "../../../services/backend";
import toast from "solid-toast";
import PrivacyTipRoundedIcon from "@suid/icons-material/PrivacyTipRounded";
import PostComment from "./PostComment";

// Type for the user object inside the post

const PostCard = (props: Post) => {
  // State signals for like, comment visibility, and comment input
  const [liked, setLiked] = createSignal(false);
  const [showCommentSection, setShowCommentSection] = createSignal(false);
  const [comment, setComment] = createSignal("");
  const [commentLoading, setCommentLoading] = createSignal(false);

  // get comments

  const fetchComments = async () => {
    const response = await apiClient.get(`/post/comments/${props._id}`);
    return response.data.comments;
  };

  const [comments, { refetch }] = createResource(
    () => (showCommentSection() ? props._id : null), // Trigger fetch only when showCommentSection is true
    fetchComments
  );

  const handleAddComment = async () => {
    if (!comment()) {
      return toast("Need Comment", {
        icon: <PrivacyTipRoundedIcon color="primary" />,
        position: "top-right",
      });
    }
    setCommentLoading(true);
    try {
      const response = await apiClient.post(`/post/comment/${props._id}`, {
        text: comment(),
      });
      if (response.status === 200) {
        refetch();
      }
      console.log("response", response);
    } catch (error) {
      console.log("error", error);
    } finally {
      setCommentLoading(false);
      setComment("");
    }
  };

  createEffect(() => console.log("commentsList()", comments()));

  return (
    <Card sx={{ width: "100%", margin: "20px 0" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
              gap: "1em",
            }}
          >
            <Avatar src={props.user.photo} />
            <A
              href={`/user/friend/${props.user.user_name}`}
              style={{
                color: "text.primary",
                "text-decoration": "none",
              }}
              class="text_underline"
            >
              {props.user.user_name}
            </A>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" textAlign="left">
          {props.content}
        </Typography>
        <Box width={"100%"}>
          <Show when={props.mediaUrl} fallback={<></>}>
            <Show
              when={props.mediaType == "image"}
              fallback={
                <video
                  src={props.mediaUrl}
                  controls
                  style={{
                    width: "100%",
                    "max-width": "100%",
                    height: "auto",
                    "max-height": "300px",
                    "object-fit": "contain",
                  }}
                ></video>
              }
            >
              <img
                src={props.mediaUrl}
                alt={props._id}
                style={{
                  "max-height": "300px",
                  width: "100%",
                  "max-width": "100%",
                  height: "auto",
                  "object-fit": "contain",
                  "margin-top": "0.5em",
                }}
              />
            </Show>
          </Show>
        </Box>
      </CardContent>
      <CardActions>
        <IconButton
          onClick={() => setLiked(!liked())}
          color={liked() ? "secondary" : "primary"}
        >
          {/* <ThumbUpIcon /> {liked() ? "Liked" : "Like"} */}
          <ThumbUpIcon color={liked() ? "secondary" : "primary"} />
        </IconButton>
        <IconButton
          onClick={() => setShowCommentSection(!showCommentSection())}
        >
          <CommentIcon />
        </IconButton>
        <IconButton>
          <ShareIcon />
        </IconButton>
      </CardActions>

      <Show when={showCommentSection()}>
        <Card
          sx={{
            backgroundColor: "#f5f5f5",
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <CardContent>
            <Typography variant="body1">Comments</Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Write a comment..."
              value={comment()}
              onChange={(e) => setComment((e.target as HTMLInputElement).value)}
              sx={{ marginBottom: "10px" }}
            />
            <Button
              variant="contained"
              onClick={handleAddComment}
              disabled={commentLoading()}
            >
              Add
            </Button>
            <Suspense fallback={<CircularProgress color="secondary" />}>
              {comments()?.map((e: Comment) => (
                <PostComment comment={e} />
              ))}
            </Suspense>
          </CardContent>
        </Card>
      </Show>
    </Card>
  );
};

export default PostCard;
