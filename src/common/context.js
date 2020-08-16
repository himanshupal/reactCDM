import React, { useReducer, createContext } from "react"
import { verify } from "jsonwebtoken"

const initial = {
	user: localStorage.authToken ? verify(localStorage.authToken, process.env.REACT_APP_JWT_SECRET) : null,
}

const AuthContext = createContext({
	user: null,
	login: () => null,
	logout: () => null,
})

const AuthReducer = (state, action) => {
	switch (action.type) {
		case "login":
			return {
				...state,
				user: action.payload,
			}
		case "logout":
			return {
				...state,
				user: null,
			}
		default:
			return state
	}
}

const AuthProvider = props => {
	const [state, dispatch] = useReducer(AuthReducer, initial),
		login = token => {
			dispatch({
				type: "login",
				payload: verify(token, process.env.REACT_APP_JWT_SECRET),
			})
			localStorage.setItem(`authToken`, token)
		},
		logout = () => {
			dispatch({
				type: "logout",
			})
			localStorage.removeItem(`authToken`)
		}

	return <AuthContext.Provider value={{ user: state.user, login, logout }} {...props} />
}

export { AuthContext, AuthProvider }
