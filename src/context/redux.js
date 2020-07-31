import { action, createStore, persist } from "easy-peasy";
// import { setContext } from "apollo-link-context";
import { verify } from "jsonwebtoken";
export default createStore(
	persist(
		{
			loggedInUser: {},
			login: action((state, token) => {
				const { username, iat, exp } = verify(token, `MySuperSecretAuthKey`);
				state.loggedInUser = {
					username,
					iat,
					exp,
					token,
				};
			}),
			logout: action((state) => {
				state = null;
			}),
		},
		{
			storage: "localStorage",
		}
	)
);
