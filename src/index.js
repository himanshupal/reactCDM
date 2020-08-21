import React from "react"
import Router from "./routes/Router"
import ApolloClient from "apollo-client"
import * as serviceWorker from "./serviceWorker"

import { render } from "react-dom"
import { setContext } from "apollo-link-context"
import { createHttpLink } from "apollo-link-http"
import { ApolloProvider } from "@apollo/react-hooks"
import { InMemoryCache } from "apollo-cache-inmemory"

import "semantic-ui-css/semantic.min.css"
import "./common/root.css"

render(
	<ApolloProvider
		client={
			new ApolloClient({
				link: setContext(_ => {
					const authToken = localStorage.authToken
					return authToken
						? {
								headers: {
									Authorization: process.env.REACT_APP_AUTH_HEAD + `#` + authToken,
								},
						  }
						: null
				}).concat(
					createHttpLink({
						uri: process.env.REACT_APP_DB_LINK,
					})
				),
				cache: new InMemoryCache(),
			})
		}
	>
		<Router />
	</ApolloProvider>,
	document.getElementById(`root`)
)

serviceWorker.register()
