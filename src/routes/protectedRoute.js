import React, { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { Route, Redirect } from "react-router-dom";

const NoReturn = ({ component: Component, ...rest }) => {
	const { user } = useContext(AuthContext);
	return (
		<Route
			render={(props) =>
				user ? <Redirect to="/" /> : <Component {...props} />
			}
			{...rest}
		/>
	);
};

export default NoReturn;
