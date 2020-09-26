import React from "react"
import Router from "./routes/Router"
import ApolloClient from "apollo-client"
import * as serviceWorker from "./serviceWorker"

import { render } from "react-dom"
import { toast } from "react-toastify"
import { setContext } from "apollo-link-context"
import { createHttpLink } from "apollo-link-http"
import { ApolloProvider } from "@apollo/react-hooks"
import { InMemoryCache } from "apollo-cache-inmemory"

import "react-toastify/dist/ReactToastify.min.css"
import "semantic-ui-css/semantic.min.css"
import "./common/root.css"

toast.configure({ position: `bottom-right` })

render(
	<ApolloProvider
		client={
			new ApolloClient({
				link: setContext(() =>
					localStorage.authToken
						? {
								headers: {
									authorization: process.env.REACT_APP_AUTH_HEAD + `#` + localStorage.authToken,
								},
						  }
						: null
				).concat(
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
	document.querySelector(`main`)
)

serviceWorker.register()
