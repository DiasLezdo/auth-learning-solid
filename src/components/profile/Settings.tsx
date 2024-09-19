import { Button, Paper, Stack, Typography } from "@suid/material";
import { Component } from "solid-js";
import useAuthAppStore from "../../store/store";

interface Props {
  handleLogout: () => void;
}

const Settings = (props: Props) => {
  const userDetail = useAuthAppStore((s) => s.user); //optimize code

  return (
    <>
      <Paper sx={{ padding: "1em" }}>
        <Stack direction="column" spacing={2}>
          <Button
            variant="outlined"
            color="warning"
            onClick={props.handleLogout}
          >
            Logout
          </Button>
          <Typography variant="subtitle2" color="secondary">
            {userDetail?.account_type}
          </Typography>
          <Typography variant="button" color="secondary">
            MFA
          </Typography>
        </Stack>
      </Paper>
    </>
  );
};

export default Settings;
