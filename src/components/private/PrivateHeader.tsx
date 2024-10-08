import { A, useLocation } from "@solidjs/router";
import { Avatar, Box, Stack, Typography, useTheme } from "@suid/material";
import { Component, createEffect, createMemo, useContext } from "solid-js";
import { WiAlien } from "solid-icons/wi";
import { deepOrange } from "@suid/material/colors";
import ThemeSwitch from "../common/ThemeSwitch";
import useAuthAppStore from "../../store/store";
import { optimizeImageUrl } from "../../services/optimizeImage";

const PrivateHeader: Component<{}> = (props) => {
  const userDetail = useAuthAppStore((s) => s.user); //optimize code

  const theme = useTheme();

  const location = useLocation();
  const pathname = createMemo(() => location.pathname);

  const mode = theme.palette.mode;

  createEffect(() => {
    document.body.className = mode === "dark" ? "dark" : "light";
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: { md: "1em", xs: "2px" },
        height: { md: "50px", xs: "50px" },
      }}
    >
      <WiAlien size={70} color="#8B9464" />
      <Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <ThemeSwitch mode={mode} />
          <A
            href="/user/home"
            style={{
              color: theme.palette.secondary.dark,
              "text-decoration": "none",
            }}
            state={{
              from: pathname(),
            }}
          >
            Home
          </A>
          <A
            href="/user/about"
            style={{
              color: theme.palette.secondary.dark,
              "text-decoration": "none",
            }}
          >
            Message
          </A>
          <A
            href="/user/add-friends"
            style={{
              color: theme.palette.secondary.dark,
              "text-decoration": "none",
            }}
          >
            Add
          </A>
          <A
            href="/user/profile"
            style={{
              "text-decoration": "none",
            }}
          >
            <Avatar
              src={optimizeImageUrl(userDetail?.photo!)}
              sx={{
                bgcolor: deepOrange[500],
                cursor: "pointer",
              }}
            >
              O
            </Avatar>
          </A>
        </Stack>
      </Box>
    </Box>
  );
};

export default PrivateHeader;
