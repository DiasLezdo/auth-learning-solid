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

// Type for the user object inside the post
interface User {
  first_name: string;
  last_name: string;
  user_name: string;
  photo: string; // URL to profile picture
}

// Type for comments (if needed)
interface Comment {
  user: User;
  text: string;
  createdAt: string;
  photo: string; // URL to profile picture
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

const Posts: Component<{}> = (props) => {
  const fetchPosts = async (page: number, limit: number) => {
    const response = await apiClient.get(`/post/all`, {
      params: { page, limit, isPublic: true },
    });

    return response.data;
  };

  const limit = 10;

  const [page, setPage] = createSignal(1);
  const [postsLists, setPostsLists] = createSignal<Post[]>([]);

  const [posts] = createResource(
    () => ({ page: page() }),
    async ({ page }) => fetchPosts(page, limit)
  );

  createEffect(() => {
    if (posts()?.data) {
      if (page() === 1) {
        setPostsLists(posts()?.data);
      } else {
        setPostsLists((prev) =>
          [...prev, ...posts()!.data].filter(
            (value, index, self) =>
              index ===
              self.findIndex((obj) => obj.user_name === value.user_name)
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
                  likes={user.likes}
                  comments={user.comments}
                  createdAt={user.createdAt}
                  updatedAt={user.updatedAt}
                  isLiked
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
