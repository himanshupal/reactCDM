import { Form, Button, Segment } from "semantic-ui-react";
import login_mut from "../../queries/mutation/login";
import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/react-hooks";
// import { useStoreActions } from "easy-peasy";
import { AuthContext } from "../../context/Auth";
import Notify from "../../common/Notify";

const usernameRegex = /^[a-zA-z0-9._-]+$/;

const Login = (props) => {
	const { login } = useContext(AuthContext),
		[error, setError] = useState({}),
		[variables, setVariables] = useState({}),
		[notification, setNotification] = useState([]),
		// login = useStoreActions((actions) => actions.login),
		[loginUser, { loading }] = useMutation(login_mut, {
			update: (_, { data }) => {
				login(data.login);
				props.history.push(`/`);
			},
			onError: ({ graphQLErrors, networkError, message }) => {
				if (networkError) setNotification([...notification, { error: message.split(`: `)[1] }]);
				else setNotification([...notification, { message: message.split(`: `)[1], error: graphQLErrors[0].extensions.error }]);
			},
			variables,
		}),
		handleSubmit = async (e) => {
			e.preventDefault();
			if (!usernameRegex.test(variables.username))
				return setError({
					...error,
					regexError: `Invalid username !!!`,
				});
			setError({});
			await loginUser();
		};

	return (
		<Segment>
			<Form onSubmit={handleSubmit} className={loading ? `loading` : ``}>
				<Form.Input
					required
					label="Username"
					name="username"
					onChange={(_, { name, value }) => setVariables({ ...variables, [name]: value })}
					autoComplete="username"
					placeholder="Enter username..."
				/>
				<Form.Input
					required
					label="Password"
					name="password"
					type="password"
					onChange={(_, { name, value }) => setVariables({ ...variables, [name]: value })}
					autoComplete="current-password"
					placeholder="Enter password..."
				/>
				<Button color="brown" type="submit">
					Submit
				</Button>
			</Form>
			{notification.length > 0 && <Notify list={notification} />}
		</Segment>
	);
};

export default Login;
