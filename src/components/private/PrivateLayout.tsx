import { Box } from "@suid/material";
import { ParentComponent } from "solid-js";
import PrivateHeader from "./PrivateHeader";
import useAuthAppStore from "../../store/store";
import { useNavigate } from "@solidjs/router";

const PrivateLayout: ParentComponent<{}> = (props) => {
  const userFromStore = useAuthAppStore((s) => s.user); //optimize code

  const navigate = useNavigate();

  if (!userFromStore?._id) {
    navigate(`/`);
    return null; // Prevent rendering children if user is not authenticated yet.
  }

  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      <PrivateHeader />
      {props.children}
    </Box>
  );
};

export default PrivateLayout;
