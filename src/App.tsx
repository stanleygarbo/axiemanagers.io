import React from "react";
import Layout from "./templates/Layout";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddScholar from "./pages/AddScholar";
import Search from "./pages/Search";
import ScholarPage from "./pages/ScholarPage";
import ScrollToTop from "./components/ScrollToTop";
import About from "./pages/About";
import Donate from "./pages/Donate";
import Settings from "./pages/Settings";
import SettingsBulkImport from "./pages/SettingsBulkImport";

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <ScrollToTop />
        <Layout>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/add-scholar" component={AddScholar} />
            <Route exact path="/scholar/:ronin" component={ScholarPage} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/about" component={About} />
            <Route exact path="/donate" component={Donate} />
            <Route
              path="/settings"
              render={({ match: { path } }) => (
                <>
                  <Route path={`${path}/`} component={Settings} exact />
                  <Route
                    path={`${path}/bulk-import`}
                    component={SettingsBulkImport}
                    exact
                  />
                  {/* <Route path={`${path}/users`} component={UserPage} /> */}
                </>
              )}
            />
          </Switch>
        </Layout>
      </Router>
    </div>
  );
};

export default App;
