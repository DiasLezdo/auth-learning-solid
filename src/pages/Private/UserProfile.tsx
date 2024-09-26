import { Card, Container } from "@suid/material";
import { Component, createEffect, createResource } from "solid-js";
import UserDetails from "../../components/userProfile/UserDetails";
import UserPosts from "../../components/userProfile/UserPosts";
import apiClient from "../../services/backend";
import { useNavigate, useParams } from "@solidjs/router";
import useAuthAppStore from "../../store/store";

const UserProfile = () => {
  const params = useParams();
  const navigate = useNavigate();

  console.log("params", params.user_name);

  const userDetail = useAuthAppStore((s) => s.user); //optimize code

  if (userDetail?.user_name == params.user_name) {
    return navigate("/user/profile");
  }
  const fetchUser = async () => {
    const response = await apiClient.get(`/getOtheruser/${params.user_name}`);

    return response.data;
  };

  const [user] = createResource(fetchUser);

  createEffect(() => console.log("first", user()));

  return (
    <>
      <Card
        sx={{
          padding: "1em",
          margin: "1em 0",
        }}
      >
        <UserDetails
          bio={user()?.bio || ""}
          first_name={user()?.first_name || ""}
          last_name={user()?.last_name || ""}
          photo={user()?.photo || ""}
          user_name={user()?.user_name || ""}
        />
      </Card>
      <Container maxWidth="md">
        <UserPosts user_name={params.user_name || ""} />
      </Container>
    </>
  );
};

export default UserProfile;
