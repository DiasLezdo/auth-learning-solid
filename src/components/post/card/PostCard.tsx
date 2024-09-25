import { createSignal, Show } from "solid-js";
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
} from "@suid/material";
import ThumbUpIcon from "@suid/icons-material/ThumbUp";
import CommentIcon from "@suid/icons-material/Comment";
import ShareIcon from "@suid/icons-material/Share";
import { A } from "@solidjs/router";

// Type for the user object inside the post
interface User {
  first_name: string;
  last_name: string;
  user_name: string;
  photo: string;
}

// Type for comments (if needed)
interface Comment {
  user: User;
  text: string;
  createdAt: string;
  photo: string;
}

// Main Post interface
interface Post {
  _id: string; // MongoDB generates a string ID
  user: User;
  content: string;
  mediaType: "image" | "video" | null; // Enum for mediaType
  mediaUrl: string; // URL to media (image/video)
  isPublic: boolean; // Privacy setting
  likes: string[]; // Array of user IDs (for simplicity, represented as strings)
  comments: Comment[]; // Array of comments
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isLiked: boolean;
}

const PostCard = (props: Post) => {
  // State signals for like, comment visibility, and comment input
  const [liked, setLiked] = createSignal(false);
  const [showCommentSection, setShowCommentSection] = createSignal(false);
  const [comment, setComment] = createSignal("");

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
              href={`/user/profile/${props.user.user_name}`}
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
              placeholder="Write a comment..."
              value={comment()}
              onInput={(e) => setComment((e.target as HTMLInputElement).value)}
              sx={{ marginBottom: "10px" }}
            />
            <Button
              variant="contained"
              onClick={() => alert("Comment Posted!")}
            >
              Post Comment
            </Button>
          </CardContent>
        </Card>
      </Show>
    </Card>
  );
};

export default PostCard;
