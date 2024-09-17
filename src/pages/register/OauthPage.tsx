import { useNavigate, useSearchParams } from "@solidjs/router";
import { Component, createEffect } from "solid-js";
import useAuthAppStore from "../../store/store";

const OauthPage: Component<{}> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setUserToStore = useAuthAppStore((s) => s.addUser);

  const navigate = useNavigate();
  console.log("first", searchParams);

  createEffect(() => {
    if (searchParams.user && searchParams.token) {
      // save user details to local storage
      setUserToStore(JSON.parse(searchParams.user));
      navigate(`/user/home`, { replace: true }); // replace current url with new one
    } else {
      return navigate("/");
    }
  });

  return <div>{searchParams.token}</div>;
};

export default OauthPage;
