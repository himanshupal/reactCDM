import { verify } from "jsonwebtoken";
import React, { useReducer, createContext } from "react";

const initial = {
	user: null,
};
if (localStorage.userDetails) {
	const { username, iat, exp } = JSON.parse(localStorage.userDetails);
	initial.user = { username, iat, exp };
}

const AuthContext = createContext({
		user: null,
		login: (data) => {},
		logout: () => {},
	}),
	AuthReducer = (state, action) => {
		switch (action.type) {
			case "LOGIN":
				return {
					...state,
					user: action.payload,
				};
			case "LOGOUT":
				return {
					...state,
					user: null,
				};
			default:
				return state;
		}
	},
	AuthProvider = (props) => {
		const [state, dispatch] = useReducer(AuthReducer, initial),
			login = (data) => {
				const { username, iat, exp } = verify(data, `MySuperSecretAuthKey`);
				dispatch({
					type: "LOGIN",
					payload: { username, iat, exp },
				});
				localStorage.userDetails = JSON.stringify({
					username,
					iat,
					exp,
					token: data,
				});
			},
			logout = () => {
				dispatch({
					type: "LOGOUT",
				});
				localStorage.removeItem(`userDetails`);
			};

		return (
			<AuthContext.Provider
				value={{ user: state.user, login, logout }}
				{...props}
			/>
		);
	};

export { AuthContext, AuthProvider };
