import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Paper,
  Stack,
  Switch,
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
    </>
  );
};

export default Settings;
