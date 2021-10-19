import React from "react";
import Layout from "./templates/Layout";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddScholar from "./pages/AddScholar";
import Search from "./pages/Search";
import ScholarPage from "./pages/ScholarPage";
import About from "./pages/About";
import Donate from "./pages/Donate";
import Settings from "./pages/Settings";
import SettingsBulkImport from "./pages/SettingsBulkImport";
import SettingsMinQuota from "./pages/SettingsMinQuota";
import ScrollMemory from "react-router-scroll-memory";
import SettingsInterface from "./pages/SettingsPreferences";
import Announcement from "./pages/Announcement";
import FooterTemplate from "./templates/FooterTemplate";
import ConverterPage from "./pages/ConverterPage";
import CookiePopup from "./components/CookiePopup";
// import MaintenanceModal from "./components/MaintenanceModal";

const App: React.FC = () => {
  return (
    <div className="App">
      {/* <MaintenanceModal /> */}
      <Router>
        <Layout>
          <>
            <ScrollMemory />
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/add-scholar" component={AddScholar} />
              <Route exact path="/scholar/:ronin" component={ScholarPage} />
              <Route exact path="/search" component={Search} />
              <Route exact path="/about" component={About} />
              <Route exact path="/donate" component={Donate} />
              <Route exact path="/announcement" component={Announcement} />
              <Route exact path="/converter" component={ConverterPage} />
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
                    <Route
                      path={`${path}/interface`}
                      component={SettingsInterface}
                      exact
                    />
                    <Route
                      path={`${path}/min-quota`}
                      component={SettingsMinQuota}
                      exact
                    />
                  </>
                )}
              />
            </Switch>
          </>
        </Layout>
        <FooterTemplate />
      </Router>
      <CookiePopup />
    </div>
  );
};

export default App;
