import { Box } from "@suid/material";
import { ParentComponent } from "solid-js";
import Header from "./Header";

const Layout: ParentComponent = (props) => {
  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      <Header />
      {props.children}
    </Box>
  );
};

export default Layout;
