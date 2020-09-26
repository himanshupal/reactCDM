import React, { useContext } from "react"
import { AuthContext } from "../common/context"
import { Route, Redirect } from "react-router-dom"

const NoReturn = ({ component: Component, ...props }) => {
	const { user, theme } = useContext(AuthContext)
	return (
		<Route
			render={props => (user ? <Redirect to="/" /> : <Component {...{ ...props, theme }} />)}
			{...props}
		/>
	)
}

export default NoReturn
