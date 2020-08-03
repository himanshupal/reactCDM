import React, { useState } from "react";
import Notify from "../../../common/Notify";
import { useMutation } from "@apollo/react-hooks";
import MUTATION_ADD_NOTE from "../../../queries/mutation/addNote";
import { Segment, TextArea, Button, Input, Icon, Modal } from "semantic-ui-react";

export default ({ dark, data, note, loading }) => {
	const [modal, showModal] = useState(false);
	const [variables, setVariables] = useState({});
	const [notification, setNotification] = useState([]);

	const [addNote, { loading: addingNote }] = useMutation(MUTATION_ADD_NOTE, {
		update: (_, { data }) => {
			setNotification([...notification, { message: data.addNote }]);
		},
		onError: ({ graphQLErrors, networkError, message }) => {
			if (networkError) setNotification([...notification, { error: message.split(`: `)[1] }]);
			else setNotification([...notification, { message: message.split(`: `)[1], error: graphQLErrors[0].extensions.error }]);
		},
		variables,
	});

	if (loading || addingNote) return <h1>Loading...</h1>;

	return (
		<>
			{notification.length > 0 && <Segment inverted={dark} content={<Notify list={notification} />} />}
			{note && (
				<Segment inverted={dark}>
					<Input
						style={{ display: `flex`, justifyContent: `space-between`, marginBottom: `0.25rem` }}
						fluid
						inverted={dark}
						name="subject"
						action={{
							color: `grey`,
							content: variables.scope || `Private`,
							onClick: () => setVariables({ ...variables, [`scope`]: variables.scope === `Class` ? `Private` : `Class` }),
						}}
						label="Subject"
						value={variables.subject || ``}
						onChange={(_, { name, value }) => setVariables({ ...variables, [name]: value })}
					/>
					<TextArea
						rows="7"
						name="description"
						placeholder="Description..."
						className={dark ? `textarea__dark` : `textarea__light`}
						value={variables.description || ``}
						onChange={(_, { name, value }) => setVariables({ ...variables, [name]: value })}
					/>
					<Button fluid color="facebook" content="Submit" onClick={() => addNote()} />
				</Segment>
			)}
			<Modal size="mini" open={modal}>
				<Modal.Header content="Delete Note" />
				<Modal.Content content="Are you sure you want to this note ?" />
				<Modal.Actions>
					<Button negative onClick={() => showModal(false)} content="Yes" />
					<Button positive onClick={() => showModal(false)} content="No" />
				</Modal.Actions>
			</Modal>
			{data &&
				data.notes.map((not) => (
					<Segment inverted={dark} key={not._id}>
						<h4 style={{ display: `flex`, justifyContent: `space-between`, marginBottom: 0 }}>
							{not.subject}
							<span>
								{not.scope}&nbsp;
								<Icon size="small" color="red" name="remove" circular bordered onClick={() => showModal(true)} />
							</span>
						</h4>
						<b style={{ margin: `0.25rem 0` }}>
							{not.createdBy + ` at ` + new Date(not.createdAt).toDateString() + ` ` + new Date(not.createdAt).toLocaleTimeString()}
						</b>
						{not.description && <p style={{ marginTop: `0.25rem` }}>{`> ` + not.description}</p>}
					</Segment>
				))}
		</>
	);
};
