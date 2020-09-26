import React from "react"
import { Modal, Button, Icon } from "semantic-ui-react"

const AreYouSure = ({ onConfirm, open, onCancel, theme, content }) => (
	<Modal open={open} onClose={onCancel} size="mini">
		<Modal.Header content="Are you sure ?" />
		{content && <Modal.Content content={content} />}
		<Modal.Actions
			content={
				<Button.Group fluid inverted={theme}>
					<Button
						color="green"
						type="button"
						animated="fade"
						inverted={theme}
						onClick={onConfirm}
						content={
							<>
								<Button.Content visible content="YES" />
								<Button.Content hidden content={<Icon name="check" />} />
							</>
						}
					/>
					<Button.Or />
					<Button
						color="red"
						type="button"
						animated="fade"
						inverted={theme}
						onClick={onCancel}
						content={
							<>
								<Button.Content visible content="NO" />
								<Button.Content hidden content={<Icon name="close" />} />
							</>
						}
					/>
				</Button.Group>
			}
		/>
	</Modal>
)

export default AreYouSure
