import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
} from "@suid/material";
import { Component, createSignal } from "solid-js";
import { FiUpload } from "solid-icons/fi";
import AddPhotoAlternateRoundedIcon from "@suid/icons-material/AddPhotoAlternateRounded";
import ArticleRoundedIcon from "@suid/icons-material/ArticleRounded";
import TheatersRoundedIcon from "@suid/icons-material/TheatersRounded";
import ForwardRoundedIcon from "@suid/icons-material/ForwardRounded";
import apiClient from "../../services/backend";
import toast from "solid-toast";

const MessageBox: Component<{ user: string }> = (props) => {
  const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null);
  const open = () => Boolean(anchorEl());
  const handleClose = () => setAnchorEl(null);

  const [content, setContent] = createSignal<string>("");

  const sendMessage = async () => {
    if (!props.user) {
      return toast.error("User?");
    }
    try {
      // Send message to the server
      const res = await apiClient.post("/message/send", {
        text: content(),
        receiver_user_name: props.user,
      });
      if (res.status == 201) {
        setContent("");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          position: "absolute",
          bottom: 0,
          width: "98%",
          padding: "1em 0.5em",
        }}
      >
        <TextField
          id="standard-basic"
          label=""
          variant="standard"
          placeholder="Type...."
          fullWidth
          value={content()}
          onChange={(e) => setContent(e.target.value)}
        />

        <IconButton disabled={!content()} onClick={sendMessage}>
          <ForwardRoundedIcon />
        </IconButton>
        <IconButton
          title="Account settings"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          size="small"
          //   sx={{ ml: 2, mr: 2 }}
          aria-controls={open() ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open() ? "true" : undefined}
        >
          <FiUpload />
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl()}
        id="account-menu"
        open={open()}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            ["& .MuiAvatar-root"]: {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
      >
        {/* <MenuItem>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem>
          <Avatar /> My account
        </MenuItem>
        <Divider /> */}
        <MenuItem>
          <ListItemIcon>
            <AddPhotoAlternateRoundedIcon fontSize="small" />
          </ListItemIcon>
          Images
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ArticleRoundedIcon fontSize="small" />
          </ListItemIcon>
          Docs
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <TheatersRoundedIcon fontSize="small" />
          </ListItemIcon>
          Videos
        </MenuItem>
      </Menu>
    </>
  );
};

export default MessageBox;
