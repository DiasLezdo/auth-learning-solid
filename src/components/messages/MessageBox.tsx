import {
  Avatar,
  Badge,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
} from "@suid/material";
import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";
import { FiUpload } from "solid-icons/fi";
import AddPhotoAlternateRoundedIcon from "@suid/icons-material/AddPhotoAlternateRounded";
import ArticleRoundedIcon from "@suid/icons-material/ArticleRounded";
import TheatersRoundedIcon from "@suid/icons-material/TheatersRounded";
import ForwardRoundedIcon from "@suid/icons-material/ForwardRounded";
import apiClient from "../../services/backend";
import toast from "solid-toast";
import FilePresentIcon from "@suid/icons-material/FilePresent";
import BackspaceRoundedIcon from "@suid/icons-material/BackspaceRounded";
import { Message } from "../../types/posts";
import socket from "../../services/socket";

const MessageBox: Component<{
  user: string;
  onMessageReceived: (message: Message) => void;
}> = (props) => {
  const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null);
  const open = () => Boolean(anchorEl());
  const handleClose = () => setAnchorEl(null);

  const [content, setContent] = createSignal<string>("");
  const [files, setFiles] = createSignal<File[]>([]); // State to hold selected files
  const [selectedFileType, setSelectedFileType] = createSignal(""); // State to hold selected files

  // files show modal
  const [modal, setModal] = createSignal<boolean>(false);
  const [loading, setLoading] = createSignal<boolean>(false);

  // ----------------------SOCKET------------------

  // Function to handle incoming messages
  const handleIncomingMessage = (message: Message) => {
    console.log("message", message);
    props.onMessageReceived(message);
  };

  // Setup Socket.IO listeners
  onMount(() => {
    socket.on("receiveMessage", handleIncomingMessage);

    socket.on("messageSent", (confirmation) => {
      console.log("Message sent:", confirmation);
      handleIncomingMessage(confirmation);
      // Optionally, update UI if necessary
      // For example, mark message as sent
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error.message);
      toast.error(error.message);
    });
  });

  onCleanup(() => {
    socket.off("receiveMessage", handleIncomingMessage);
    socket.off("messageSent");
    socket.off("error");
  });

  // -----------------------------------------------

  const sendMessage = async () => {
    if (!props.user) {
      return toast.error("User is required.");
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("receiver_user_name", props.user);
    formData.append("text", content());

    // Append files to form data
    files().forEach((file) => {
      formData.append("files", file);
    });
    setLoading(true);
    try {
      // Send message to the server
      const res = await apiClient.post("/message/send", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 201) {
        setContent("");
        setFiles([]); // Clear files after sending
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const selectedFiles = Array.from(input.files || []).slice(0, 3); // Limit to 3 files
    setFiles(selectedFiles);
  };

  if (!props.user) {
    return <></>;
  }

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

        <IconButton
          disabled={!content() && files().length === 0}
          onClick={sendMessage}
        >
          <ForwardRoundedIcon />
        </IconButton>

        <Show
          when={!loading()}
          fallback={<CircularProgress size={20} color="primary" />}
        >
          {files()?.length < 1 ? (
            <IconButton
              title="Upload Files"
              onClick={(event) => setAnchorEl(event.currentTarget)}
              size="small"
              aria-controls={open() ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open() ? "true" : undefined}
            >
              <FiUpload />
            </IconButton>
          ) : (
            <IconButton>
              <Badge
                badgeContent={files()?.length}
                color="primary"
                onClick={() => {
                  setModal(true);
                }}
              >
                <FilePresentIcon color="action" />
              </Badge>
            </IconButton>
          )}
        </Show>

        {/* File input hidden for uploading files */}
        <input
          type="file"
          accept={`${selectedFileType()}`} // Accept images, text files, and videos
          onChange={handleFileChange}
          multiple
          style={{ display: "none" }} // Hide the default file input
          id="file-input"
        />
      </Box>

      <Menu
        anchorEl={anchorEl()}
        id="account-menu"
        open={open()}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
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
        <MenuItem
          onClick={() => {
            handleClose();
            setSelectedFileType(".jpg,.jpeg,.png");
            document.getElementById("file-input")?.click();
          }}
        >
          <ListItemIcon>
            <AddPhotoAlternateRoundedIcon fontSize="small" />
          </ListItemIcon>
          Images
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            setSelectedFileType(".txt");

            document.getElementById("file-input")?.click();
          }}
        >
          <ListItemIcon>
            <ArticleRoundedIcon fontSize="small" />
          </ListItemIcon>
          Docs
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            setSelectedFileType(".mp4");
            document.getElementById("file-input")?.click();
          }}
        >
          <ListItemIcon>
            <TheatersRoundedIcon fontSize="small" />
          </ListItemIcon>
          Videos
        </MenuItem>
      </Menu>

      {/* dialog */}
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={modal() ? true : false}
        onClose={() => setModal(false)}
      >
        <DialogContent
          sx={{
            padding: "1em",
            paddingTop: "1em !important",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5em",
          }}
        >
          <Box sx={{ padding: "0.5em" }}>
            {files().map((file) => (
              <div style={{ margin: "1em" }}>
                {file.type.includes("image") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width="100"
                    height="100"
                  />
                ) : file.type.includes("video") ? (
                  <video
                    src={URL.createObjectURL(file)}
                    width="100%"
                    height="200"
                    controls // Added controls for video playback
                  />
                ) : (
                  <Avatar
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    sx={{ width: 50, height: 50, margin: "0 5px" }}
                    variant="rounded"
                  />
                )}
                <div
                  style={{
                    display: "flex",
                    "justify-content": "space-between",
                    "align-items": "center",
                    gap: "0.5em",
                  }}
                >
                  <span
                    style={{
                      "word-break": "break-all",
                    }}
                  >
                    {file.name}{" "}
                  </span>
                  <IconButton
                    onClick={() => {
                      setFiles(files().filter((f) => f !== file));
                      if (files().length < 1) {
                        setModal(false);
                      }
                    }}
                  >
                    <BackspaceRoundedIcon />
                  </IconButton>
                </div>
              </div>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MessageBox;
