import { A, useLocation } from "@solidjs/router";
import { Avatar, Box, Stack, Typography, useTheme } from "@suid/material";
import { Component, createEffect, createMemo, useContext } from "solid-js";
import { WiAlien } from "solid-icons/wi";
import { deepOrange } from "@suid/material/colors";
import ThemeSwitch from "../common/ThemeSwitch";


const PrivateHeader: Component<{}> = (props) => {
  const theme = useTheme();

  

  const location = useLocation();
  const pathname = createMemo(() => location.pathname);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: { md: "1em", xs: "2px" },
        height: { md: "50px", xs: "30px" },
      }}
    >
      <WiAlien size={70} color="#8B9464" />
      <Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <ThemeSwitch />
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
            href="/user/profile"
            style={{
              "text-decoration": "none",
            }}
          >
            <Avatar
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
