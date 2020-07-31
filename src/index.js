// import React from "react";
import { render } from "react-dom";
import ApolloProvider from "./ApolloProvider";
import "semantic-ui-css/semantic.min.css";
import "./common/sidenav.css";
import * as serviceWorker from "./serviceWorker";

render(
	// <React.StrictMode>{
	ApolloProvider,
	// }</React.StrictMode>,
	document.getElementById(`root`)
);

serviceWorker.register();
