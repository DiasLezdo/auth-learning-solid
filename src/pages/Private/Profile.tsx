import { Box, Button, Card, Container, Grid, Typography } from "@suid/material";
import { Component, ErrorBoundary } from "solid-js";
import useAuthAppStore from "../../store/store";
import { useNavigate } from "@solidjs/router";
import apiClient from "../../services/backend";
import toast from "solid-toast";
import Details from "../../components/profile/Details";
import Settings from "../../components/profile/Settings";
import MyPosts from "../../components/profile/MyPosts";

const Profile: Component<{}> = (props) => {
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
      {/* <Typography variant="h1" color="primary">
        Profile : {userDetail?.first_name}
      </Typography>
      <Button variant="outlined" color="warning" onClick={handleLogout}>
        Logout
      </Button> */}
      <Card
        sx={{
          padding: "1em",
          margin: "1em 0",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Details />
          </Grid>
          <Grid item xs={12} md={4}>
            <ErrorBoundary
              fallback={(err) => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5" color="error">
                    Error Occurred{" "}
                    <Typography variant="caption">
                      {" "}
                      Error: {err.message}
                    </Typography>
                  </Typography>
                </Box>
              )}
            >
              <Settings handleLogout={handleLogout} />
            </ErrorBoundary>
          </Grid>
        </Grid>
      </Card>
      <Container maxWidth="md">
        <MyPosts />
      </Container>
    </>
  );
};

export default Profile;
