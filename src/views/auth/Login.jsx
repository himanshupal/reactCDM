import { Form, Button, Segment } from "semantic-ui-react";
import login_mut from "../../queries/mutation/login";
import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/react-hooks";
// import { useStoreActions } from "easy-peasy";
// import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../../context/Auth";
const usernameRegex = /^[a-zA-z0-9._-]+$/;

const Login = (props) => {
	const { login } = useContext(AuthContext),
		[error, setError] = useState({}),
		[variables, setVariables] = useState({}),
		// login = useStoreActions((actions) => actions.login),
		[loginUser, { loading }] = useMutation(login_mut, {
			update: (_, { data }) => {
				setError({});
				login(data.login);
				props.history.push(`/`);
			},
			onError: ({ graphQLErrors, networkError, message }) => {
				// toast.error(prompt, {
				// 	position: "bottom-right",
				// });
				setError({
					...error,
					error:
						graphQLErrors[0].extensions.error ||
						networkError[0].extensions.error ||
						message,
				});
			},
			variables,
		}),
		handleSubmit = async (e) => {
			e.preventDefault();
			if (variables.username.trim() === `` || variables.password.trim() === ``)
				return setError({
					...error,
					username: `Username or Password can't be empty !!!`,
				});
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
					label="Username"
					name="username"
					onChange={(_, { name, value }) =>
						setVariables({ ...variables, [name]: value })
					}
					autoComplete="username"
					placeholder="Enter username..."
				/>
				<Form.Input
					label="Password"
					name="password"
					type="password"
					onChange={(_, { name, value }) =>
						setVariables({ ...variables, [name]: value })
					}
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
			{/* <ToastContainer
			position="bottom-right"
			autoClose={5000}
			hideProgressBar={false}
			newestOnTop={false}
			closeOnClick
			rtl={false}
			pauseOnFocusLoss
			draggable
			pauseOnHover
			/> */}
		</Segment>
	);
};

export default Login;
