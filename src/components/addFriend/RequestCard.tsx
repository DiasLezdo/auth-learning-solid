import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Typography,
} from "@suid/material";
import { deepOrange } from "@suid/material/colors";
import { Component, createSignal } from "solid-js";
import { BsPersonFillAdd } from "solid-icons/bs";
import { IoPersonRemoveSharp } from "solid-icons/io";
import apiClient from "../../services/backend";
import toast from "solid-toast";

interface Props {
  user_name: string;
  profile: string;
  first_name: string;
  last_name: string;
}

const RequestCard: Component<Props> = (props) => {
  // access if he friend or not , based on user profile api

  // important --> disAdvantage (over render to all components)
  // we can set common loading on Add Friend page or component like   const [loading, setLoading] = createSignal<string>("");
  // inside card component just setLoading(props.user_name) then access the loading props to like props.loading==user_name?"loading":"addChunk"

  const [accepted, setAccepted] = createSignal(false);
  const [declined, setDeclined] = createSignal(false);
  const [loading, setLoading] = createSignal(false);

  const handleClickAccept = async (user_name: string) => {
    // call api to add friend
    setLoading(true);
    try {
      const res = await apiClient.post("/friend/friend-request-accept", {
        friend_user_name: user_name,
      });
      if (res.status == 200) {
        toast.success(res?.data?.message);
        setAccepted(true);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickDeclined = async (user_name: string) => {
    // call api to add friend
    setLoading(true);
    try {
      const res = await apiClient.post("/friend/friend-request-declined", {
        friend_user_name: user_name,
      });
      if (res.status == 200) {
        toast.success(res?.data?.message);
        setDeclined(true);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Paper sx={{ margin: "1em 0.5em", cursor: "pointer" }}>
        <Grid
          container
          //   sx={{ margin: "0.5em 0.1em" }}
          direction="row"
          sx={{
            margin: "0.5em 0.1em",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid item md={1} xs={2}>
            <Avatar
              sx={{ bgcolor: deepOrange[500] }}
              variant="square"
              alt={props.first_name}
              src={props.profile}
            />
          </Grid>
          <Grid item md={8} xs={6} direction={"column"}>
            <Typography variant="subtitle2" color="primary">
              {props.first_name + " " + props.last_name}
            </Typography>
            <Typography variant="overline" color="primary">
              {props.user_name}
            </Typography>
          </Grid>
          {declined() || accepted() ? (
            <Grid item md={3} xs={4} container justifyContent="flex-end">
              {accepted() && (
                <Alert variant="filled" severity="success">
                  Request accepted.
                </Alert>
              )}
              {declined() && (
                <Alert variant="filled" severity="error">
                  Request declied.
                </Alert>
              )}
            </Grid>
          ) : (
            <Grid
              item
              md={3}
              xs={4}
              container
              justifyContent="flex-end"
              direction={"row"}
            >
              <Button
                onClick={() => handleClickAccept(props.user_name)}
                startIcon={<BsPersonFillAdd />}
                sx={{ marginRight: "5px" }}
                disabled={loading()}
              >
                {loading() ? "Loading..." : "Accept"}
              </Button>
              <Button
                onClick={() => handleClickDeclined(props.user_name)}
                startIcon={<IoPersonRemoveSharp />}
                sx={{ marginRight: "5px" }}
                disabled={loading()}
              >
                {loading() ? "Loading..." : "Decline"}
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>
    </>
  );
};

export default RequestCard;
