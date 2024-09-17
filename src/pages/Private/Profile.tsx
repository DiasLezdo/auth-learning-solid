import { Button, Typography } from "@suid/material";
import { Component } from "solid-js";
import useAuthAppStore from "../../store/store";
import { useNavigate } from "@solidjs/router";
import apiClient from "../../services/backend";
import toast from "solid-toast";

const Profile: Component<{}> = (props) => {
  const userDetail = useAuthAppStore((s) => s.user); //optimize code

  const removeUser = useAuthAppStore((s) => s.removeUser);

  // console.log("userDetails", userDetail);
  // console.log("plainState", plainState);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await apiClient.get("/logout");
      if (res.status == 200) {
        console.log("res", res);
        toast.success(res.data.message);
        removeUser(); // Ensure null or plain object
        navigate("/");
        return null;
      } else {
        toast.error(res.data.message);
        return null;
      }
    } catch (error) {
      console.error("Error during logout", error);
      toast.error("Failed to logout");
      return null;
    }
  };

  return (
    <>
      <Typography variant="h1" color="primary">
        Profile : {userDetail?.first_name}
      </Typography>
      <Button variant="outlined" color="warning" onClick={handleLogout}>
        Logout
      </Button>
    </>
  );
};

export default Profile;
