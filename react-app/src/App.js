import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Welcome from "./views/Welcom";
import Dashboard from "./views/Dashboard";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/dashboard">
            <Dashboard />
          </Route>
          <Route exact path="/">
            <Welcome />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
