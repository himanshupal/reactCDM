import { action } from "easy-peasy";

export default {
	user: null,
	token: null,
	login: action((state, details) => {
		state.user = details.data.login.username;
		state.token = details.data.login.token;
	}),
	logout: action((state) => {
		state = null;
	}),
};
