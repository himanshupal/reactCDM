import React from "react"
import { Modal, Button, Icon } from "semantic-ui-react"

const AreYouSure = ({ confirmed, confirmModal, setConfirmModal, theme, content }) => (
	<Modal open={confirmModal} onClose={setConfirmModal} size="mini">
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
						onClick={confirmed}
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
						onClick={setConfirmModal}
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
