import { Form, Button, Segment, Divider, Icon } from "semantic-ui-react"
import MUTATION_LOGIN from "../../queries/mutation/login"
import React, { useState, useContext } from "react"
import MutationError from "../shared/MutationError"
import { AuthContext } from "../../common/context"
import { useMutation } from "@apollo/react-hooks"
import { toast } from "react-toastify"
import { blake2bHex } from "blakejs"

const usernameRegex = /^[a-zA-Z0-9._-]+$/

const Login = ({ theme, history }) => {
	const { login } = useContext(AuthContext)
	const [hidden, setHidden] = useState(false)
	const [variables, setVariables] = useState({})

	const [loginUser, { loading }] = useMutation(MUTATION_LOGIN, {
		update: (_, { data }) => {
			login(data.login)
			history.push(`/`)
		},
		onError: e => MutationError(e),
		variables,
	})

	const handleSubmit = async e => {
		e.preventDefault()
		if (!usernameRegex.test(variables.username)) return toast.error(`Invalid Username !`)
		loginUser()
	}

	return (
		<div
			style={{
				display: `grid`,
				minHeight: `100vh`,
				placeItems: `center`,
				background: theme ? `#333` : `white`,
			}}
		>
			<Segment style={{ minWidth: `50vw` }} inverted={theme} loading={loading} clearing>
				<h1>Login</h1>
				<Divider />
				<Form onSubmit={handleSubmit} inverted={theme}>
					<Form.Input
						required
						label="Username"
						name="username"
						onChange={(_, { name, value }) => setVariables({ ...variables, [name]: value })}
						autoComplete="username"
					/>
					<Form.Input
						required
						label="Password"
						name="password"
						type={hidden ? `text` : `password`}
						icon={
							<Icon
								link
								name={hidden ? `eye slash` : `eye`}
								onClick={() => setHidden(hidden => !hidden)}
							/>
						}
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: blake2bHex(value) })
						}
						autoComplete="current-password"
					/>
					<Button
						color="violet"
						floated="right"
						animated="vertical"
						inverted={theme}
						content={
							<>
								<Button.Content visible content="Login" />
								<Button.Content hidden content={<Icon name="long arrow right" />} />
							</>
						}
					/>
				</Form>
			</Segment>
		</div>
	)
}

export default Login
