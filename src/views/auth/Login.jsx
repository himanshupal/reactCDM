import { Form, Button, Segment, Divider, Icon } from "semantic-ui-react"
import MUTATION_LOGIN from "../../queries/mutation/login"
import React, { useState, useContext } from "react"
import { AuthContext } from "../../common/context"
import { useMutation } from "@apollo/react-hooks"
import Notify from "../../common/Notify"
import { blake2bHex } from "blakejs"

const usernameRegex = /^[a-zA-z0-9._-]+$/

const Login = ({ history }) => {
	const { login } = useContext(AuthContext)
	const [hidden, setHidden] = useState(false)
	const [variables, setVariables] = useState({})
	const [notification, setNotification] = useState([])

	const [loginUser, { loading }] = useMutation(MUTATION_LOGIN, {
		update: (_, { data }) => {
			login(data.login)
			history.push(`/`)
		},
		onError: ({ graphQLErrors, networkError, message }) => {
			if (networkError) setNotification([...notification, { error: message.split(`: `)[1] }])
			else setNotification([...notification, { message: message.split(`: `)[1], error: graphQLErrors[0].extensions.error }])
		},
		variables,
	})

	const handleSubmit = async e => {
		e.preventDefault()
		if (!usernameRegex.test(variables.username)) return setNotification([...notification, { error: `Invalid username !!!` }])
		loginUser()
	}

	return (
		<div style={{ display: `grid`, minHeight: `100vh`, placeItems: `center` }}>
			<Segment style={{ minWidth: `50vw` }} color="orange" piled>
				<h1>Login</h1>
				<Divider />
				<Form onSubmit={handleSubmit} className={loading ? `loading` : ``}>
					<Form.Input
						required
						label="Username"
						name="username"
						onChange={(_, { name, value }) => {
							setNotification([])
							setVariables({ ...variables, [name]: value })
						}}
						autoComplete="username"
						placeholder="Enter username..."
					/>
					<Form.Input
						required
						label="Password"
						name="password"
						type={hidden ? `text` : `password`}
						icon={<Icon name={hidden ? `eye` : `eye slash`} link onClick={() => setHidden(hidden => !hidden)} />}
						onChange={(_, { name, value }) => {
							setNotification([])
							setVariables({ ...variables, [name]: blake2bHex(value) })
						}}
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
