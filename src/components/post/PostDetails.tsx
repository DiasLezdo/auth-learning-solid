import {
  Card,
  CardContent,
  CircularProgress,
  Container,
  LinearProgress,
} from "@suid/material";
import {
  Component,
  createEffect,
  createResource,
  ErrorBoundary,
  Show,
} from "solid-js";
import PostCard from "./card/PostCard";
import apiClient from "../../services/backend";
import { useParams } from "@solidjs/router";

const PostDetails: Component<{}> = (props) => {
  const params = useParams();

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

  return (
    <>
      <Card sx={{ width: "100%", marginTop: "1em" }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Container maxWidth="md">
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
    </>
  );
};

export default PostDetails;
