import { Container, Skeleton, Stack } from "@suid/material";
import { Component, createResource, For, Suspense } from "solid-js";
import FriendsCard from "../../components/friends/FriendsCard";
import apiClient from "../../services/backend";

const Friends: Component<{}> = (props) => {
  // API fetch function with pagination and search
  const fetchRequestedUsers = async () => {
    const response = await apiClient.get(`/friend/myfriends`);
    return response.data;
  };

  const [friends, { refetch }] = createResource(() => fetchRequestedUsers());
  return (
    <>
      <Container>
        <Suspense
          fallback={
            <Stack direction={"column"} gap={"1em"}>
              <Skeleton
                sx={{ bgcolor: "grey.500", textAlign: "center" }}
                variant="rectangular"
                width={"90%"}
                height={70}
              />
              <Skeleton
                sx={{ bgcolor: "grey.500", textAlign: "center" }}
                variant="rectangular"
                width={"90%"}
                height={70}
              />
              <Skeleton
                sx={{ bgcolor: "grey.500", textAlign: "center" }}
                variant="rectangular"
                width={"90%"}
                height={70}
              />
            </Stack>
          }
        >
          <For each={friends()?.data}>
            {(user) => (
              <FriendsCard
                user_name={user.user_name ?? ""}
                profile={user.photo}
                first_name={user.first_name}
                last_name={user.last_name ?? ""}
                refetch={refetch}
              />
            )}
          </For>
        </Suspense>
      </Container>
    </>
  );
};

export default Friends;
