import { Avatar, Button, Grid, Paper, Typography } from "@suid/material";
import { deepOrange } from "@suid/material/colors";
import { Component } from "solid-js";
import { AiOutlineMessage } from "solid-icons/ai";
import { VsPreview } from "solid-icons/vs";
import { useNavigate } from "@solidjs/router";

interface Props {
  user_name: string;
  profile: string;
  first_name: string;
  last_name: string;
}

const FriendsCard: Component<Props> = (props) => {
  const navigate = useNavigate();

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

          <Grid
            item
            md={3}
            xs={4}
            container
            justifyContent="flex-end"
            direction={"row"}
          >
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
