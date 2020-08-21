import { Form, Button, Segment, Divider } from "semantic-ui-react"
import login_mut from "../../queries/mutation/login"
import React, { useState, useContext } from "react"
import { AuthContext } from "../../common/context"
import { useMutation } from "@apollo/react-hooks"
import Notify from "../../common/Notify"

const usernameRegex = /^[a-zA-z0-9._-]+$/

const Login = ({ history }) => {
	const { login } = useContext(AuthContext),
		[error, setError] = useState({}),
		[variables, setVariables] = useState({}),
		[notification, setNotification] = useState([]),
		[loginUser, { loading }] = useMutation(login_mut, {
			update: (_, { data }) => {
				login(data.login)
				history.push(`/`)
			},
			onError: ({ graphQLErrors, networkError, message }) => {
				if (networkError) setNotification([...notification, { error: message.split(`: `)[1] }])
				else setNotification([...notification, { message: message.split(`: `)[1], error: graphQLErrors[0].extensions.error }])
			},
			variables,
		}),
		handleSubmit = async e => {
			e.preventDefault()
			if (!usernameRegex.test(variables.username))
				return setError({
					...error,
					regexError: `Invalid username !!!`,
				})
			setError({})
			await loginUser()
		}

	return (
		<div style={{ display: `grid`, minHeight: `100vh`, placeContent: `center` }}>
			<Segment style={{ minWidth: `50vw` }} color="orange" piled>
				<h1>Login</h1>
				<Divider />
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
					<div style={{ display: `flex`, justifyContent: `flex-end` }}>
						<Button color="violet" content="Submit" style={{ marginRight: 0 }} />
					</div>
				</Form>
				{notification.length > 0 && <Notify list={notification} />}
			</Segment>
		</div>
	)
}

export default Login
