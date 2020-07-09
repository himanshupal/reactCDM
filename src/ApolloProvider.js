import store from "../src/context/redux";
import { useStoreState, StoreProvider } from "easy-peasy";

import React from "react";
import Router from "./routes/router";
import ApolloClient from "apollo-client";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";

const httpLink = createHttpLink({
	uri: "http://localhost",
});

const authLink = setContext(() => {
	let token;
	if (localStorage.userDetails) {
		const jwtD = JSON.parse(localStorage.userDetails);
		token = jwtD.token;
	}
	return {
		headers: {
			Authorization: localStorage.userDetails ? `Bearer#${token}` : ``,
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

export default (
	<StoreProvider store={store}>
		<ApolloProvider client={client}>
			<Router />
		</ApolloProvider>
	</StoreProvider>
);
