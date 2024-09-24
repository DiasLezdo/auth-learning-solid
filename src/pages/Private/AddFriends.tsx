import {
  Box,
  Container,
  Drawer,
  Skeleton,
  Stack,
  Typography,
} from "@suid/material";
import {
  Component,
  createEffect,
  createResource,
  createSignal,
  onCleanup,
  Show,
  For,
  Suspense,
} from "solid-js";
import AddHeader from "../../components/addFriend/AddHeader";
import FriendCard from "../../components/addFriend/FriendCard";
import RequestCard from "../../components/addFriend/RequestCard";
import apiClient from "../../services/backend";

interface AddFriendsProps {
  user_name: string;
  photo: string;
  first_name: string;
  last_name: string;
}

const AddFriends: Component<{}> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);

  // API fetch function with pagination and search
  const fetchUsers = async (page: number, limit: number, search?: string) => {
    const response = await apiClient.get(`/friend/all`, {
      params: { page, limit, search },
    });
    return response.data; // Expecting { data: [...], pagination: { totalPages, currentPage } }
  };

  const limit = 10; // Number of users per page

  // Signals for storing users, page, and search term
  const [page, setPage] = createSignal(1);
  const [usersList, setUsersList] = createSignal<AddFriendsProps[]>([]);
  const [searchTerm, setSearchTerm] = createSignal(""); // Signal for the search input

  // Create resource to fetch users with pagination and search
  const [users] = createResource(
    () => ({ page: page(), search: searchTerm() }), // Track both page and search term
    async ({ page, search }) => fetchUsers(page, limit, search)
  );

  // Effect to append users when new data is fetched
  createEffect(() => {
    if (users()?.data) {
      if (page() === 1 || searchTerm()) {
        setUsersList(users()?.data); // Reset the list when on the first page
      } else {
        setUsersList((prev) =>
          [...prev, ...users()!.data].filter(
            (value, index, self) =>
              index ===
              self.findIndex((obj) => obj.user_name === value.user_name)
          )
        ); // Append new users to the existing list work here!!!
        // setUsersList(users()?.data);
      }
    }
  });

  // Infinite scroll handler
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 2 &&
      !users.loading && // Only load more if not currently loading
      users()?.pagination?.currentPage < users()?.pagination?.totalPages // Check if more pages are available
    ) {
      setPage(page() + 1); // Increment page number to load new users
    }
  };

  // Attach scroll event listener on mount and clean up on unmount
  window.addEventListener("scroll", handleScroll);
  onCleanup(() => window.removeEventListener("scroll", handleScroll));

  // GET REQUESTED USERS

  // const [data, { mutate, refetch }] = createResource(getQuery, fetchData); mutate we can update directly state of data in that createResource method
  // examplees:update state ui fastly and it will automatically update after fetch data , possible only if we didn't put loading (big loader[condition based view])

 
  // API fetch function with pagination and search
  const fetchRequestedUsers = async () => {
    const response = await apiClient.get(`/friend/requestes`);
    return response.data;
  };

  const [requestedUsers, { refetch }] = createResource(
    () => isOpen() && fetchRequestedUsers()
  );

  createEffect(() => {
    if (isOpen()) {
      refetch();
    }
  });

  createEffect(() => {
    console.log("requestedUsers", requestedUsers());
  });
  return (
    <>
      <Container maxWidth="md">
        <AddHeader
          setIsOpen={setIsOpen}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm()}
        />

        {/* Display fetched users dynamically */}
        <For each={usersList()}>
          {(user) => (
            <FriendCard
              user_name={user.user_name ?? ""}
              profile={user.photo}
              first_name={user.first_name}
              last_name={user.last_name ?? ""}
            />
          )}
        </For>

        {/* Loading spinner */}
        <Show when={users.loading}>
          <p>Loading more users...</p>
        </Show>

        {/* No more users message */}
        <Show
          when={
            !users.loading &&
            users()?.pagination?.currentPage >= users()?.pagination?.totalPages
          }
        >
          <p>No more users to load</p>
        </Show>
      </Container>

      {/* Drawer with Request Cards */}
      <Drawer open={isOpen()} onClose={() => setIsOpen(false)}>
        <Box sx={{ width: 550 }}>
          <Typography variant="h6" color="secondary" margin={2}>
            Requests
          </Typography>
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
            <For each={requestedUsers()?.data}>
              {(user) => (
                <RequestCard
                  user_name={user.user_name ?? ""}
                  profile={user.photo}
                  first_name={user.first_name}
                  last_name={user.last_name ?? ""}
                />
              )}
            </For>
          </Suspense>
        </Box>
      </Drawer>
    </>
  );
};

export default AddFriends;
