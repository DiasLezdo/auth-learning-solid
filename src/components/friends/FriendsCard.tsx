import { Avatar, Button, Grid, Paper, Typography } from "@suid/material";
import { deepOrange } from "@suid/material/colors";
import { Component } from "solid-js";
import { AiOutlineMessage } from "solid-icons/ai";
import { VsPreview } from "solid-icons/vs";
import { useNavigate } from "@solidjs/router";
import { VsDiffRemoved } from "solid-icons/vs";
import apiClient from "../../services/backend";

interface Props {
  user_name: string;
  profile: string;
  first_name: string;
  last_name: string;
  refetch: () => void;
}

const FriendsCard: Component<Props> = (props) => {
  const navigate = useNavigate();

  const handleRemoveFriend = async () => {
    try {
      const res = await apiClient.post("/friend/remove-friend", {
        friend_user_name: props.user_name,
      });
      if (res.status == 200) {
        props.refetch();
      }
    } catch (error) {
      console.error(error);
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
          <Grid item md={1} xs={1}>
            <Avatar
              sx={{ bgcolor: deepOrange[500] }}
              variant="square"
              alt={props.first_name}
              src={props.profile}
            />
          </Grid>
          <Grid item md={5} xs={5} direction={"column"}>
            <Typography variant="subtitle2" color="primary">
              {props.first_name + " " + props.last_name}
            </Typography>
            <Typography variant="overline" color="primary">
              {props.user_name}
            </Typography>
          </Grid>

          <Grid
            item
            md={6}
            xs={6}
            container
            justifyContent="flex-end"
            direction={"row"}
          >
            <Button
              onClick={handleRemoveFriend}
              startIcon={<VsDiffRemoved />}
              sx={{ marginRight: "5px" }}
              color="error"
            >
              Remove
            </Button>
            <Button
              onClick={() => navigate(`/user/friend/${props.user_name}`)}
              startIcon={<VsPreview />}
              sx={{ marginRight: "5px" }}
            >
              View
            </Button>
            <Button
              //   onClick={() => handleClickDeclined(props.user_name)}
              startIcon={<AiOutlineMessage />}
              sx={{ marginRight: "5px" }}
              color="secondary"
            >
              Message
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default FriendsCard;
