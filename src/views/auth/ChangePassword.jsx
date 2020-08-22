import { blake2bHex } from "blakejs"
import Notify from "../../common/Notify"
import { useMutation } from "@apollo/react-hooks"
import { AuthContext } from "../../common/context"
import React, { useState, useContext } from "react"
import { Modal, Form, Icon, Segment } from "semantic-ui-react"
import MUTATION_CHANGE_PASSWORD from "../../queries/mutation/changePassword"

const ChangePassword = ({ newPwd, setNewPwd }) => {
	const { login, logout } = useContext(AuthContext)

	const [notification, setNotification] = useState([])
	const [variables, setVariables] = useState({})
	const [hidden, setHidden] = useState({})

	const [changePassword, { loading }] = useMutation(MUTATION_CHANGE_PASSWORD, {
		update: (_, { data: { changePassword } }) => {
			logout()
			login(changePassword)
			setNotification([...notification, { message: `Password Changed Successfully.`, error: `You'll need to login again on other devices.` }])
		},
		onError: ({ graphQLErrors, networkError, message }) => {
			if (networkError) setNotification([...notification, { error: message.split(`: `)[1] }])
			else setNotification([...notification, { message: message.split(`: `)[1], error: graphQLErrors[0].extensions.error }])
		},
		variables,
	})

	const handleInput = (_, { name, value }) => {
		setNotification([])
		setVariables({ ...variables, [name]: blake2bHex(value) })
	}

	const handleSubmit = () => {
		if (variables.newPassword.trim().length < 7)
			setNotification([...notification, { message: `Password too short !`, error: `Password must be atleast 7 characters.` }])
		else if (variables.newPassword !== variables.confirmPassword)
			setNotification([...notification, { message: `Passwords don't match !`, error: `New Password & Confirmation Password must be same.` }])
		else changePassword()
	}

	return (
		<Modal open={newPwd} onClose={() => setNewPwd(false)} size="small">
			<Modal.Header content="Change Password" />
			<Modal.Content>
				<Segment loading={loading} compact basic>
					<Form>
						<Form.Group>
							<Form.Input
								type={hidden[`old`] ? `text` : `password`}
								label="Old Password"
								name="oldPassword"
								placeholder="Enter Old Password"
								icon={
									<Icon
										name={hidden[`old`] ? `eye` : `eye slash`}
										link
										onClick={() =>
											setHidden(hidden => {
												return { ...hidden, [`old`]: !hidden.old }
											})
										}
									/>
								}
								onChange={handleInput}
							/>
							<Form.Input
								type={hidden[`new`] ? `text` : `password`}
								label="New Password"
								name="newPassword"
								placeholder="Enter New Password"
								icon={
									<Icon
										name={hidden[`new`] ? `eye` : `eye slash`}
										link
										onClick={() =>
											setHidden(hidden => {
												return { ...hidden, [`new`]: !hidden.new }
											})
										}
									/>
								}
								onChange={handleInput}
							/>
							<Form.Input
								type={hidden[`cnf`] ? `text` : `password`}
								label="Confirm Password"
								name="confirmPassword"
								placeholder="New Password Again"
								icon={
									<Icon
										name={hidden[`cnf`] ? `eye` : `eye slash`}
										link
										onClick={() =>
											setHidden(hidden => {
												return { ...hidden, [`cnf`]: !hidden.cnf }
											})
										}
									/>
								}
								onChange={handleInput}
							/>
						</Form.Group>
					</Form>
				</Segment>
				{notification.length > 0 && <Notify list={notification} />}
			</Modal.Content>
			<Modal.Actions>
				<Form.Button
					content="Submit"
					onClick={handleSubmit}
					disabled={!variables.oldPassword || !variables.newPassword || !variables.confirmPassword}
				/>
			</Modal.Actions>
		</Modal>
	)
}

export default ChangePassword
