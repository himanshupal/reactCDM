import gql from "graphql-tag";
// import { useStoreActions } from "easy-peasy";
import { AuthContext } from "../../context/Auth";
import { useMutation } from "@apollo/react-hooks";
import React, { useState, useContext } from "react";
import { Form, Button, Segment } from "semantic-ui-react";

const usernameRegex = /^[a-zA-z0-9_.]+$/;

const Login = (props) => {
	const { login } = useContext(AuthContext),
		[error, setError] = useState({}),
		[values, setValues] = useState({
			username: ``,
			password: ``,
		}),
		// login = useStoreActions((actions) => actions.login);
		onChange = (event) => {
			setValues({ ...values, [event.target.name]: event.target.value });
		},
		[loginUser, { loading }] = useMutation(LOGIN_CRED, {
			update: (proxy, res) => {
				setError([]);
				login(res.data.login);
				props.history.push(`/`);
			},
			onError: ({ graphQLErrors, networkError, message }) => {
				networkError === null
					? setError({ ...error, dbError: graphQLErrors[0].extensions.code })
					: setError({
							...error,
							dbError: graphQLErrors[0].extensions.error,
					  });
			},
			variables: values,
		}),
		handleSubmit = (e) => {
			e.preventDefault();
			if (values.username.trim() === `` || values.password.trim() === ``) {
				return setError({
					...error,
					username: `Username or Password can't be empty !!!`,
				});
			}
			if (!usernameRegex.test(values.username)) {
				return setError({
					...error,
					regexError: `Invalid username !!!`,
				});
			}
			setError([]);
			loginUser();
		};

	return (
		<Segment>
			<Form onSubmit={handleSubmit} className={loading ? "loading" : ``}>
				<Form.Input
					label="Username"
					name="username"
					value={values.username}
					onChange={onChange}
					autoComplete="username"
					placeholder="Enter username..."
				/>
				<Form.Input
					label="Password"
					name="password"
					type="password"
					value={values.password}
					onChange={onChange}
					autoComplete="current-password"
					placeholder="Enter password..."
				/>
				<Button color="brown" type="submit">
					Submit
				</Button>
			</Form>
			{Object.keys(error).length > 0 && (
				<div className="ui error message">
					{Object.values(error).map((err) => (
						<h5 key={err}>{err}</h5>
					))}
				</div>
			)}
		</Segment>
	);
};

const LOGIN_CRED = gql`
	mutation login($username: String!, $password: String!) {
		login(data: { username: $username, password: $password })
	}
`;

export default Login;
