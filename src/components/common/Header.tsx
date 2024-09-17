import { Box, Typography } from "@suid/material";
import { Component, createEffect, createMemo, Show } from "solid-js";
import { WiAlien } from "solid-icons/wi";
import { A, useLocation } from "@solidjs/router";

const Header: Component<{}> = (props) => {
  const location = useLocation();
  const pathname = createMemo(() => location.pathname);

  createEffect(() => console.log("pathname()", pathname()));

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
      <Show
        when={pathname() == "/"}
        fallback={
          <Typography color="text.primary" sx={{ fontSize: "14px" }}>
            Already have an account?{" "}
            <A
              href="/"
              style={{
                "text-decoration": "none",
              }}
              activeClass="none"
            >
              Login
            </A>
          </Typography>
        }
        keyed
      >
        <Typography color="text.primary" sx={{ fontSize: "14px" }}>
          Don't Have an account?{" "}
          <A
            href="/signup"
            style={{
              "text-decoration": "none",
            }}
            activeClass="none"
          >
            SignUp
          </A>
        </Typography>
      </Show>
    </Box>
  );
};

export default Header;
