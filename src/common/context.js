import React, { useReducer, createContext } from "react"
import { verify } from "jsonwebtoken"

const initial = {
	user: localStorage.authToken ? verify(localStorage.authToken, process.env.REACT_APP_JWT_SECRET) : null,
	theme: localStorage.theme === `true` ? true : false,
	page: sessionStorage.onPage || null,
}

const AuthContext = createContext({
	user: null,
	page: null,
	theme: false,
	login: () => null,
	logout: () => null,
	setPage: () => null,
	toggleTheme: () => null,
})

const AuthReducer = (state, action) => {
	switch (action.type) {
		case `login`:
			return {
				...state,
				user: action.payload,
			}
		case `logout`:
			return {
				...state,
				user: null,
			}
		case `toggleTheme`:
			return {
				...state,
				theme: action.theme,
			}
		case `setPage`:
			return {
				...state,
				page: action.page,
			}
		default:
			return state
	}
}

const AuthProvider = props => {
	const [state, dispatch] = useReducer(AuthReducer, initial),
		login = token => {
			dispatch({
				type: `login`,
				payload: verify(token, process.env.REACT_APP_JWT_SECRET),
			})
			localStorage.setItem(`authToken`, token)
		},
		logout = () => {
			dispatch({
				type: `logout`,
			})
			localStorage.removeItem(`authToken`)
		},
		toggleTheme = () => {
			const theme = localStorage.theme === `true` ? false : true || true
			dispatch({
				type: `toggleTheme`,
				theme,
			})
			localStorage.setItem(`theme`, theme)
		},
		setPage = page => {
			dispatch({
				type: `setPage`,
				page,
			})
			sessionStorage.setItem(`onPage`, page)
		}

	return <AuthContext.Provider value={{ ...state, login, logout, toggleTheme, setPage }} {...props} />
}

export { AuthContext, AuthProvider }
