import {
  alpha,
  AppBar,
  Box,
  IconButton,
  InputBase,
  styled,
  Toolbar,
  Typography,
} from "@suid/material";
import { Component } from "solid-js";
import { BsSearchHeartFill } from "solid-icons/bs";
import { TiUserAdd } from "solid-icons/ti";
import { FaSolidUserGroup } from "solid-icons/fa";
import { useNavigate } from "@solidjs/router";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

interface Props {
  setIsOpen: (value: boolean) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const AddHeader: Component<Props> = (props) => {
  const navigate = useNavigate();
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            {/* <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton> */}

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              Add Friends
            </Typography>

            <FaSolidUserGroup
              size={23}
              class="cursor-pointer"
              style={{
                "margin-right": "10px",
              }}
              onClick={() => navigate("/user/friends")}
            />

            <TiUserAdd
              size={25}
              class="cursor-pointer"
              onClick={() => props.setIsOpen(true)}
            />

            <Search>
              <SearchIconWrapper>
                <BsSearchHeartFill />
              </SearchIconWrapper>
              <StyledInputBase
                value={props.searchTerm}
                onChange={(e) => props.setSearchTerm(e.target.value)}
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default AddHeader;
