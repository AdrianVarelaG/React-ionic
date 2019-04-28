import React, { Component } from "react";
import { IonApp, IonSplitPane, IonPage } from "@ionic/react";
import "@ionic/core/css/core.css";
import "@ionic/core/css/ionic.bundle.css";
import "./theme.css";
import Menu from "./components/Menu";
import AppStack from "./pages/AppStack";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonRouterOutlet
} from "@ionic/react";
import {
  IonIcon,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonMenuToggle
} from "@ionic/react";

class App extends Component {
  render() {
    return (
      <Router>
        <IonApp>
          <Menu />
          <IonPage id="main">
            <Switch>
              {/*<Route path='/account' component={Account} />
                <Route path="/tutorial" component={Tutorial} />
                <Route path="/logout" />
                <Route path="/login" component={Login} />
                <Route path="/support" component={Support} />
                <Route path="/signup" component={Signup} />*/}
              <Route path="/" component={AppStack} />
            </Switch>
          </IonPage>
        </IonApp>
      </Router>
    );
  }
}

export default App;
