import { Card, CardContent, Container } from "@suid/material";
import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  onCleanup,
  Show,
} from "solid-js";
import PostCard from "./card/PostCard";
import apiClient from "../../services/backend";
import { Post } from "../../types/posts";

// Type for the user object inside the post

interface Props {
  trigger: boolean;
}

const Posts: Component<Props> = (props) => {
  const fetchPosts = async (page: number, limit: number) => {
    const response = await apiClient.get(`/post/all`, {
      params: { page, limit, isPublic: true },
    });

    return response.data;
  };

  const limit = 10;

  const [page, setPage] = createSignal(1);
  const [postsLists, setPostsLists] = createSignal<Post[]>([]);

  const [posts, { refetch }] = createResource(
    () => ({ page: page() }),
    async ({ page }) => fetchPosts(page, limit)
  );

  createEffect(() => {
    if (props.trigger) {
      setPage(1);
      refetch();
    }
  });

  createEffect(() => {
    if (posts()?.data) {
      if (page() === 1) {
        setPostsLists(posts()?.data);
      } else {
        setPostsLists((prev) =>
          [...prev, ...posts()!.data].filter(
            (value, index, self) =>
              index === self.findIndex((obj) => obj._id === value._id)
          )
        );
      }
    }
  });

  // Infinite scroll handler
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 2 &&
      !posts.loading &&
      posts()?.pagination?.currentPage < posts()?.pagination?.totalPages
    ) {
      setPage(page() + 1);
    }
  };

  window.addEventListener("scroll", handleScroll);
  onCleanup(() => window.removeEventListener("scroll", handleScroll));

  return (
    <>
      <Card sx={{ width: "100%", marginTop: "1em" }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Container maxWidth="xs">
            <For each={postsLists()}>
              {(user) => (
                <PostCard
                  _id={user._id}
                  user={user.user}
                  content={user.content}
                  mediaType={user.mediaType}
                  mediaUrl={user.mediaUrl}
                  isPublic={user.isPublic}
                  isLiked={user.isLiked}
                  // comments={user.comments}
                  createdAt={user.createdAt}
                  updatedAt={user.updatedAt}
                  likes={user.likes}
                />
              )}
            </For>

            {/* Loading spinner */}
            <Show when={posts.loading}>
              <p>Loading more Posts...</p>
            </Show>

            {/* No more users message */}
            <Show
              when={
                !posts.loading &&
                posts()?.pagination?.currentPage >=
                  posts()?.pagination?.totalPages
              }
            >
              <p>No more Posts to load</p>
            </Show>
          </Container>
        </CardContent>
      </Card>
    </>
  );
};

export default Posts;
