import { Component, Show } from "solid-js";
import { createSignal, JSX } from "solid-js";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  Stack,
  Box,
  CircularProgress,
} from "@suid/material";
import UploadIcon from "@suid/icons-material/Upload";
import AddPhotoAlternateIcon from "@suid/icons-material/AddPhotoAlternate";
import PublicRoundedIcon from "@suid/icons-material/PublicRounded";
import VpnLockRoundedIcon from "@suid/icons-material/VpnLockRounded";
import AttachFileRoundedIcon from "@suid/icons-material/AttachFileRounded";
import AddPostInput from "./add/AddPostInput";
import useAuthAppStore from "../../store/store";
import apiClient from "../../services/backend";
import toast from "solid-toast";

const AddPost: Component<{}> = (props) => {
  const userDetail = useAuthAppStore((s) => s.user); //optimize code

  const [text, setText] = createSignal("");
  const [isPublic, setIsPublic] = createSignal(true);
  const [file, setFile] = createSignal<File | null>(null);
  const [preview, setPreview] = createSignal<string | null>(null);

  const [loading, setLoading] = createSignal<boolean>(false);

  // Handle file input change and generate a preview
  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const selectedFile = target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileURL = URL.createObjectURL(selectedFile);
      setPreview(fileURL);
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!text() && !file()) {
      return;
    }
    const formData = new FormData();
    formData.append("content", text().trim());
    formData.append("isPublic", isPublic() ? "isPublic" : "");

    // If there's a profile picture (file) selected, append it to formData
    const fileMedia = file();
    if (fileMedia) {
      formData.append("media", fileMedia); // "profile_picture" is the key expected by the backend
    }
    setLoading(true);
    try {
      const res = await apiClient.post("/post/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // This ensures the server knows you're sending FormData
        },
      });
      console.log("res", res);
      if (res.status == 200) {
        toast.success(res?.data?.message);
        console.log("res.data", res.data);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
      setFile(null);
      setText("");
      setPreview(null);
    }
  };

  return (
    <>
      <div
        style={{
          padding: "20px",
          display: "flex",
          "justify-content": "center",
        }}
      >
        <Card sx={{ width: "100%" }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              Upload Form
            </Typography>
            <form>
              <div
                style={{
                  "margin-bottom": "20px",
                  display: "flex",
                  "flex-direction": "row",
                  "justify-content": "center",
                  "align-items": "center",
                  gap: "1em",
                }}
              >
                <Avatar src={userDetail?.photo} />
                <AddPostInput setText={setText} text={text()} />
              </div>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Stack direction={"row"} gap={2}>
                  <label class="cursor-pointer">
                    <AddPhotoAlternateIcon color="primary" />
                    <input
                      type="file"
                      accept="image/*,video/*"
                      hidden
                      onChange={handleFileChange}
                    />
                  </label>
                  <Show
                    when={isPublic()}
                    fallback={
                      <VpnLockRoundedIcon
                        color="primary"
                        class="cursor-pointer"
                        onClick={() => setIsPublic(true)}
                      />
                    }
                  >
                    <PublicRoundedIcon
                      color="primary"
                      class="cursor-pointer"
                      onClick={() => setIsPublic(false)}
                    />
                  </Show>
                </Stack>
                {file() && (
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<AttachFileRoundedIcon />}
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                  >
                    Remove File
                  </Button>
                )}
                <Button
                  variant="contained"
                  component="label"
                  startIcon={
                    loading() ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CircularProgress color="secondary" size={30} />
                      </Box>
                    ) : (
                      <UploadIcon />
                    )
                  }
                  onClick={handleSubmit}
                  disabled={loading()}
                >
                  <Show
                    when={loading()}
                    fallback={`Publish ${isPublic() ? "public" : "private"} `}
                  >
                    Loading....
                  </Show>
                </Button>
              </Box>

              {preview() && (
                <div style={{ "margin-top": "20px", "text-align": "center" }}>
                  {file()?.type.startsWith("image/") ? (
                    <img
                      src={preview()!}
                      alt="Preview"
                      style={{
                        "max-height": "300px",
                        width: "100%",
                        "max-width": "100%",
                        height: "auto",
                        "object-fit": "contain",
                      }}
                    />
                  ) : (
                    <video
                      src={preview()!}
                      controls
                      style={{
                        width: "100%",
                        "max-width": "100%",
                        height: "auto",
                        "max-height": "300px",
                        "object-fit": "contain",
                      }}
                    ></video>
                  )}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AddPost;
