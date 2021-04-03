import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Welcome from "./views/Welcom";
import Dashboard from "./views/Dashboard";
import ForgetPassword from "./views/ForgetPassword";
import ResetPassword from "./views/ResetPassword";
import { User, UserC } from "./hook/user";

function App() {
  const user = User();
  // console.log(user.user);

  return (
    <>
      {!user.load ? (
        <UserC.Provider value={user}>
          <Router>
            <Switch>
              <Route exact path="/dashboard">
                {user.user ? <Dashboard /> : <Redirect to="/" />}
              </Route>
              <Route exact path="/">
                {!user.user ? <Welcome /> : <Redirect to="/dashboard" />}
              </Route>
              <Route exact path="/forget-password">
                {!user.user ? <ForgetPassword /> : <Redirect to="/dashboard" />}
              </Route>
              <Route exact path="/user/reset-password/:email/:token">
                {!user.user ? <ResetPassword /> : <Redirect to="/dashboard" />}
              </Route>
            </Switch>
          </Router>
        </UserC.Provider>
      ) : (
        <Load />
      )}
    </>
  );
}

export default App;

const Load = () => {
  return (
    <div className="lds-facebook">
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};
