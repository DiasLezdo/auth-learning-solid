import { Avatar, Box, Button, Grid, Paper, Typography } from "@suid/material";
import { deepOrange } from "@suid/material/colors";
import { Component, createSignal } from "solid-js";
import { BsPersonFillAdd } from "solid-icons/bs";
import apiClient from "../../services/backend";
import toast from "solid-toast";
import { A } from "@solidjs/router";

interface Props {
  user_name: string;
  profile: string;
  first_name: string;
  last_name: string;
}

const FriendCard: Component<Props> = (props) => {
  // access if he friend or not , based on user profile api

  const [requested, setRequested] = createSignal(false);
  const [loading, setLoading] = createSignal(false);

  const handleClick = async (user_name: string) => {
    // call api to add friend
    setLoading(true);
    try {
      const res = await apiClient.post("/friend/friend-request-sent", {
        friend_user_name: user_name,
      });
      if (res.status == 200) {
        toast.success(res?.data?.message);
        setRequested(true);
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
            <A
              href={"/user/friend/" + props.user_name}
              style={{
                "text-decoration": "none",
              }}
            >
              <Avatar
                sx={{ bgcolor: deepOrange[500] }}
                variant="square"
                alt={props.first_name}
                src={props.profile}
              />
            </A>
          </Grid>
          <Grid item md={8} xs={6} direction={"column"}>
            <Typography variant="subtitle2" color="primary">
              {props.first_name + " " + props.last_name}
            </Typography>
            <Typography variant="overline" color="primary">
              {props.user_name}
            </Typography>
          </Grid>
          <Grid item md={3} xs={4} container justifyContent="flex-end">
            <Button
              onClick={() => handleClick(props.user_name)}
              startIcon={<BsPersonFillAdd />}
              sx={{ marginRight: "5px" }}
              disabled={requested() || loading()}
            >
              {loading()
                ? "Loading..."
                : requested()
                ? "Requested"
                : "Add Chunk"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default FriendCard;
