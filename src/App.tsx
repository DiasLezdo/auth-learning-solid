import { lazy, type Component } from "solid-js";
import { Route, Router } from "@solidjs/router";
import { Toaster } from "solid-toast";
import About from "./pages/Private/About";
import Home from "./pages/Private/Home";
import { ThemeProviderContext } from "./context/Theme";
import Layout from "./components/common/Layout";
import PrivateLayout from "./components/private/PrivateLayout";
import Profile from "./pages/Private/Profile";
import SignUp from "./pages/register/SignUp";
import Otp from "./pages/register/Otp";
import OauthPage from "./pages/register/OauthPage";
import ForgotPassword from "./pages/register/ForgotPassword";
const Login = lazy(() => import("./pages/register/Login"));

const App: Component = () => {
  return (
    <ThemeProviderContext>
      <Toaster />
      <Router>
        <Route path={"/"} component={Layout}>
          <Route path="/" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route path="/otp" component={Otp} />
          <Route path="/forgot" component={ForgotPassword} />
        </Route>
        <Route path="/auth-callback" component={OauthPage} />

        <Route path={"/user"} component={PrivateLayout}>
          <Route path="/home" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/profile" component={Profile} />
        </Route>
      </Router>
    </ThemeProviderContext>
  );
};

export default App;
