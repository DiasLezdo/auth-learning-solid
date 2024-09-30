import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@suid/material";
import {
  Component,
  createEffect,
  createResource,
  createSignal,
  ErrorBoundary,
  Show,
} from "solid-js";
import PostCard from "./card/PostCard";
import apiClient from "../../services/backend";
import { useNavigate, useParams } from "@solidjs/router";
import EditRoadRoundedIcon from "@suid/icons-material/EditRoadRounded";
import DeleteForeverRoundedIcon from "@suid/icons-material/DeleteForeverRounded";
import DangerousIcon from "@suid/icons-material/Dangerous";
import toast from "solid-toast";
import useAuthAppStore from "../../store/store";

const PostDetails: Component<{}> = (props) => {
  const userDetail = useAuthAppStore((s) => s.user); //optimize code

  const [modal, setModal] = createSignal<
    { id: string; content: string; isPublic: boolean } | string | boolean
  >(false);

  const [content, setContent] = createSignal("");
  const [isPublic, setIsPublic] = createSignal(false);
  const [loading, setLoading] = createSignal(false);

  // Ensure proper type narrowing and access
  createEffect(() => {
    const modalValue = modal();
    if (typeof modalValue === "object" && "content" in modalValue) {
      setContent(modalValue.content);
      setIsPublic(modalValue.isPublic);
    } else {
      setContent(""); // Optionally reset content if modal is not an object
      setIsPublic(true); // Optionally reset content if modal is not an object
    }
  });

  createEffect(() => {
    console.log("modal()", modal());
    console.log("isPublic()", isPublic());
  });

  const params = useParams();
  const navigate = useNavigate();

  const postId = params.postId;

  const fetchPost = async () => {
    const response = await apiClient.get(`/post/postdetails/${postId}`);

    return response.data;
  };

  const [post, { refetch }] = createResource(fetchPost);

  createEffect(() => {
    if (post.error) {
      console.error("Error fetching post:", post.error);
    } else {
      console.log("Post data:", post());
    }
  });

  const handleEdit = async () => {
    setLoading(true);
    try {
      const response = await apiClient.put(`/post/edit/${postId}`, {
        content: content(),
        isPublic: isPublic() ? "isPublic" : "",
      });

      if (response.status === 200) {
        setModal(false);
        refetch();
      }
    } catch (error) {
      console.error("Error editing post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      const response = await apiClient.delete(`/post/delete/${postId}`);
      if (response.status === 200) {
        toast.success("Post deleted successfully");
        navigate("/user/home");
      }
    } catch (error) {
      console.error("Error delete post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card sx={{ width: "100%", marginTop: "1em" }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Container maxWidth="md">
            <Show when={userDetail?.user_name === post()?.user?.user_name}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1em",
                }}
              >
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<EditRoadRoundedIcon />}
                  onClick={() => {
                    setModal({
                      id: post()?._id ?? "",
                      content: post()?.content ?? "",
                      isPublic: post()?.isPublic ?? false,
                    });
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<DeleteForeverRoundedIcon />}
                  onClick={() => {
                    setModal(post()._id ?? "");
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Show>

            <Show
              when={!post.loading}
              fallback={<LinearProgress color="secondary" />}
            >
              <ErrorBoundary
                fallback={(err, reset) => (
                  <div style={{ color: "red" }} onClick={reset}>
                    {console.log("err", err)}
                    {err.response?.data?.message || "Unknown error"}
                  </div>
                )}
              >
                <PostCard
                  _id={post()?._id}
                  user={post()?.user}
                  content={post()?.content}
                  mediaType={post()?.mediaType}
                  mediaUrl={post()?.mediaUrl}
                  isPublic={post()?.isPublic}
                  isLiked={post()?.isLiked}
                  // comments={user.comments}
                  createdAt={post()?.createdAt}
                  updatedAt={post()?.updatedAt}
                  likes={post()?.likes}
                  hideView={true}
                />
              </ErrorBoundary>
            </Show>
          </Container>
        </CardContent>
      </Card>
      <Dialog
        fullWidth={true}
        maxWidth={"xs"}
        open={modal() ? true : false}
        onClose={() => setModal(false)}
      >
        <DialogTitle>
          Edit post (
          <Typography variant="caption" color="primary">
            Note<sup style={{ color: "red" }}>*</sup>: Post Not editable
          </Typography>
          )
        </DialogTitle>
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
          <Show
            when={typeof modal() !== "object"}
            fallback={
              <>
                <TextField
                  id="outlined-multiline-static"
                  label="Content"
                  multiline
                  rows={4}
                  value={content()}
                  onChange={(e) => setContent(e.target.value)}
                />
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <Typography>Private</Typography>
                  <Switch
                    checked={isPublic()}
                    inputProps={{ "aria-label": "ant design" }}
                    onChange={(event, check) =>
                      setIsPublic(check ? true : false)
                    }
                  />
                  <Typography>Public</Typography>
                </Stack>
              </>
            }
          >
            <DangerousIcon
              color="primary"
              sx={{
                fontSize: "5rem",
              }}
            />

            <Typography variant="subtitle1" color="primary">
              Are you sure?
            </Typography>
          </Show>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="outlined"
            onClick={typeof modal() === "object" ? handleEdit : handleDelete}
            disabled={loading()}
          >
            {loading()
              ? "Loading..."
              : typeof modal() === "object"
              ? "Submit"
              : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostDetails;
