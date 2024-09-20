import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@suid/material";
import { Component, createSignal, Show } from "solid-js";
import useAuthAppStore from "../../store/store";
import apiClient from "../../services/backend";
import toast from "solid-toast";
import PrivacyTipRoundedIcon from "@suid/icons-material/PrivacyTipRounded";

interface Props {
  handleLogout: () => void;
}

const Settings = (props: Props) => {
  const userDetail = useAuthAppStore((s) => s.user); //optimize code
  const setUserToStore = useAuthAppStore((s) => s.addUser); //optimize code

  const [mfa, setMfa] = createSignal<boolean>(userDetail?.mfa ? true : false);
  const [mfaType, setMfaType] = createSignal<number>(userDetail?.mfa ?? 1);
  const [loading, setLoading] = createSignal<boolean>(false);

  const [mfaModal, setMfaModal] = createSignal<boolean>(false);
  const [qrCode, setQrCode] = createSignal<{ qrCode: string; secret: string }>(
    {} as { qrCode: string; secret: string }
  );

  const handleClose = () => {
    toast("Need submition", {
      icon: <PrivacyTipRoundedIcon color="primary" />,
      position: "top-right",
    });
  };

  const mfaChange = async (value: number | null) => {
    if (value == null) {
      return;
    }
    setLoading(true);

    if (value == 2) {
      try {
        const res = await apiClient.get("/mfaUpdate/2fa/generate");
        console.log("res", res);
        if (res.status == 200) {
          toast.success(res?.data?.message);
          await setQrCode({
            qrCode: res.data?.qrCode,
            secret: res.data?.secret,
          });
          setMfaModal(true);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await apiClient.post("/mfaUpdate", { mfa: value });
        console.log("res", res);
        if (res.status == 200) {
          setUserToStore(res.data?.data?.user);
          toast.success(res?.data?.message);
          setMfaType(value);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitScan = async () => {
    if (!qrCode().secret) {
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.post("/mfaUpdate/2fa/confirm", {
        secret: qrCode().secret,
        mfa: 2,
      });
      console.log("res", res);
      if (res.status == 200) {
        toast.success(res?.data?.message);
        await setUserToStore(res.data?.user);
      }
    } catch (error) {
      console.log("error", error);
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
      setMfaModal(false);
    }
  };

  type UserData = {
    first_name: string;
    last_name: string;
    phone: string;
    bio: string;
    account_type: string;
  };

  const [editProfile, setEditProfile] = createSignal<boolean>(false);
  const [profileData, setProfileData] = createSignal<UserData>({
    first_name: userDetail?.first_name ?? "",
    last_name: userDetail?.last_name ?? "",
    phone: userDetail?.phone ?? "",
    bio: userDetail?.bio ?? "",
    account_type: userDetail?.account_type ?? "",
  });

  // profile picture
  const [profilePreview, setProfilePreview] = createSignal<
    string | undefined
  >();
  const [profilePic, setProfilePic] = createSignal<File | undefined>();

  // TypeScript type for file input event
  const handleChangeProfile = (e: Event) => {
    const target = e.target as HTMLInputElement; // Type assertion to ensure 'files' is recognized
    if (target.files && target.files.length > 0) {
      const file = target.files[0];

      // Ensure the selected file is one of the allowed formats
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Only PNG, JPG, JPEG, and WEBP formats are allowed.");
        return;
      }

      // Create object URL for the file preview
      setProfilePreview(URL.createObjectURL(file));

      // Set the file itself
      setProfilePic(file);
    }
  };

  const submitEditProfile = async () => {
    if (
      !profileData().first_name.trim() ||
      !profileData().last_name.trim() ||
      !profileData().phone.trim() ||
      !profileData().bio.trim
    ) {
      toast.error("All fields are required");
      return;
    }

    // Create a new FormData object to handle both file and text fields
    const formData = new FormData();
    formData.append("first_name", profileData().first_name.trim());
    formData.append("last_name", profileData().last_name.trim());
    formData.append("phone", profileData().phone.trim());
    formData.append("bio", profileData().bio.trim());
    formData.append("account_type", profileData().account_type.trim());

    // If there's a profile picture (file) selected, append it to formData
    const file = profilePic();
    if (file) {
      formData.append("image", file); // "profile_picture" is the key expected by the backend
    }
    //  const file = profilePic();
    //  if (file instanceof File) {
    //    formData.append("profile_picture", file); // Append only if file exists and is an instance of File
    //  }

    setLoading(true);
    try {
      const res = await apiClient.patch("/updateuser", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // This ensures the server knows you're sending FormData
        },
      });
      console.log("res", res);
      if (res.status == 200) {
        toast.success(res?.data?.message);
        setUserToStore(res.data?.user);
        setProfilePic(undefined);
        setProfilePreview(undefined);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
      setEditProfile(false);
    }
  };

  // Function to trigger the hidden input when the Avatar is clicked
  const triggerFileInput = () => {
    const fileInput = document.getElementById(
      "profile-input"
    ) as HTMLInputElement;
    fileInput.click();
  };

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
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="button" color="secondary">
              MFA
            </Typography>
            <Switch
              color="primary"
              // defaultChecked
              defaultChecked={mfa()}
              onChange={async (event, checked) => {
                await mfaChange(checked ? 1 : 0);
                setMfa(checked);
              }}
            />
          </Stack>
          <Show
            when={!loading()}
            fallback={
              <Box sx={{ display: "flex" }}>
                <CircularProgress />
              </Box>
            }
          >
            <Show when={mfa()} fallback={<></>}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={mfa() && mfaType() == 1}
                      disabled={mfa() && mfaType() == 1}
                      onChange={async (event, checked) => {
                        await mfaChange(checked ? 1 : null);
                        setMfaType(checked ? 1 : 2);
                      }}
                    />
                  }
                  label="Email"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={mfa() && mfaType() == 2}
                      disabled={mfa() && mfaType() == 2}
                      onChange={async (event, checked) => {
                        await mfaChange(checked ? 2 : null);
                        setMfaType(checked ? 2 : 1);
                      }}
                    />
                  }
                  label="Auth App"
                />
              </FormGroup>
            </Show>
          </Show>
        </Stack>
        <Stack>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setEditProfile(true)}
          >
            Edit Profile
          </Button>
        </Stack>
      </Paper>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={mfaModal()}
        onClose={handleClose}
      >
        <DialogTitle>
          2FA QRCode (
          <Typography variant="caption" color="primary">
            Note<sup style={{ color: "red" }}>*</sup>: Kindly Scan then submit
            it.
          </Typography>
          )
        </DialogTitle>
        <DialogContent
          sx={{
            padding: "1em",
            paddingTop: "1em !important",
            display: "flex",
            flexDirection: "column",
            gap: "0.5em",
          }}
        >
          <Box>
            <Typography variant="h6" color="primary">
              QR Code
            </Typography>
            <img src={qrCode()?.qrCode} alt="QR Code" />
          </Box>

          <Typography variant="h6" color="primary">
            Secret :{" "}
            <Typography variant="overline" color="primary">
              {qrCode()?.secret}
            </Typography>
          </Typography>
          <Typography variant="caption" color="primary">
            Note<sup style={{ color: "red" }}>*</sup>: Kindly copy and save your
            secret code
          </Typography>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button variant="outlined" onClick={handleSubmitScan}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {/* modal for profile edit */}
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={editProfile()}
        onClose={() =>
          toast("Cancel and close", {
            icon: <PrivacyTipRoundedIcon color="primary" />,
            position: "top-right",
          })
        }
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              {/* <Avatar
                src={userDetail?.photo}
                alt="profile"
                sx={{
                  height: "70px",
                  width: "70px",
                }}
              /> */}
              <Avatar
                src={profilePreview() || userDetail?.photo} // Display preview or fallback image
                alt="profile"
                onClick={triggerFileInput} // Avatar click triggers the input
                sx={{
                  height: "70px",
                  width: "70px",
                  cursor: "pointer", // Change cursor to indicate clickable avatar
                }}
              />
              <input
                type="file"
                id="profile-input"
                // accept="image/*"
                accept="image/png, image/jpeg, image/jpg, image/webp" //nice validation for medias it will show only these format in filesystem(our PC)
                style={{ display: "none" }} // Hide the input
                onChange={handleChangeProfile} // Handle the file selection
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                id="filled-basic"
                label="First Name"
                variant="filled"
                fullWidth
                value={profileData().first_name}
                onChange={(e) =>
                  setProfileData((prev) => {
                    return { ...prev, first_name: e.target.value };
                  })
                }
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                id="filled-basic"
                label="Last Name"
                variant="filled"
                fullWidth
                value={profileData().last_name}
                onChange={(e) =>
                  setProfileData((prev) => {
                    return { ...prev, last_name: e.target.value };
                  })
                }
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                id="filled-basic"
                label="Phone Number"
                type="text"
                variant="filled"
                fullWidth
                value={profileData().phone}
                onChange={(e) =>
                  setProfileData((prev) => {
                    const value = e.target.value;

                    // Updated regex to allow one + at the start, digits, and spaces
                    if (/^[+]?[0-9 ]*$/.test(value)) {
                      return {
                        ...prev,
                        phone: value, // Update phone field only if the value is valid
                      };
                    }

                    return prev; // If the value is invalid, return the previous state without changes
                  })
                }
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="demo-simple-select-filled-label">
                  Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  value={profileData().account_type}
                  onChange={(e) =>
                    setProfileData((prev) => {
                      return { ...prev, account_type: e.target.value };
                    })
                  }
                >
                  <MenuItem value={"PUBLIC"}>
                    <em>PUBLIC</em>
                  </MenuItem>
                  <MenuItem value={"PRIVATE"}>
                    <em>PRIVATE</em>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                id="filled-multiline-static"
                label="Bio"
                multiline
                rows={4}
                variant="filled"
                fullWidth
                value={profileData().bio}
                onChange={(e) =>
                  setProfileData((prev) => {
                    return { ...prev, bio: e.target.value };
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => setEditProfile(false)}
          >
            Cancel
          </Button>
          <Show
            when={loading()}
            fallback={
              <Button variant="outlined" onClick={submitEditProfile}>
                Submit
              </Button>
            }
          >
            <CircularProgress color="secondary" size={20} />
          </Show>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Settings;
