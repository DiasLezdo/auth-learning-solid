import { Component, createEffect, createResource, For } from "solid-js";
import MessageUsers from "./MessageUsers";
import apiClient from "../../services/backend";

interface Props2 {
  setUser: (value: string) => void;
}

const Messagers: Component<Props2> = (props) => {
  const fetchRequestedUsers = async () => {
    const response = await apiClient.get(`/friend/myfriends`);
    return response.data;
  };

  // Temprory for here we need to relif the backend condition only friends can conversation
  const [friends, { refetch }] = createResource(() => fetchRequestedUsers());

  createEffect(() => console.log("friends", friends()));

  return (
    <>
      <For each={friends()?.data}>
        {(user) => (
          <MessageUsers
            user_name={user.user_name}
            profile={user.photo}
            first_name={user.first_name}
            last_name={user.last_name}
            setUser={props.setUser}
          />
        )}
      </For>
    </>
  );
};

export default Messagers;
