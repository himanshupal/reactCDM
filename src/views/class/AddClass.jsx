/*
import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import addClass_mut from "../../queries/mutation/addClass";
import { Form, Segment } from "semantic-ui-react";

const teachers = [
	{ key: "amitSaxena", text: "Amit Saxena", value: "amitSaxena:id" },
	{ key: "dhanishTandon", text: "Dhanish Tandon", value: "dhanishTandon:id" },
	{ key: "rajeshVerma", text: "Rajesh Verma", value: "rajeshVerma:id" },
];
const departments = [
	{ key: "IT", text: "IT", value: "IT" },
	{ key: "Engineering", text: "Engineering", value: "Engineering" },
	{ key: "Science", text: "Science", value: "Science" },
	{ key: "Pharmacy", text: "Pharmacy", value: "Pharmacy" },
	{ key: "Education", text: "Education", value: "Education" },
	{ key: "Other", text: "Other", value: "Other" },
];

const AddClass = () => {
	const [error, setError] = useState({}),
		[variables, setVariables] = useState({}),
		[addClass, { loading }] = useMutation(addClass_mut, {
			update: (_, res) => {
				setError({});
			},
			onError: ({ graphQLErrors, networkError, message }) => {
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
			await addClass();
		};

	return (
		<Segment>
			<Form widths="equal" onSubmit={handleSubmit}>
				<Form.Group>
					<Form.Input
						onChange={(_, { name, value }) => {
							setError({});
							setVariables({ ...variables, [name]: value });
						}}
						name="class"
						placeholder="eg. BCA"
						label="Class"
					/>
					<Form.Input
						onChange={(_, { name, value }) => {
							setError({});
							setVariables({ ...variables, [name]: value });
						}}
						name="year"
						type="number"
						label="Year"
					/>
					<Form.Input
						onChange={(_, { name, value }) => {
							setError({});
							setVariables({ ...variables, [name]: value });
						}}
						name="semester"
						type="number"
						label="Semester"
					/>
					<Form.Input
						onChange={(_, { name, value }) => {
							setError({});
							setVariables({ ...variables, [name]: value });
						}}
						name="batch"
						type="number"
						label="Batch"
						placeholder="Year"
					/>
				</Form.Group>
				<Form.Group>
					<Form.Select
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						name="department"
						search
						clearable
						closeOnBlur
						openOnFocus
						options={departments}
						label="Department"
					/>
					<Form.Select
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						name="classTeacher"
						search
						clearable
						closeOnBlur
						openOnFocus
						options={teachers}
						label="Class Teacher"
					/>
				</Form.Group>
				<Form.Group>
					<Form.Input
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						name="sessionStart"
						type="date"
						label="Session Start Date"
					/>
					<Form.Input
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						name="sessionEnd"
						type="date"
						label="Session End Date"
					/>
				</Form.Group>
				<Form.Button fluid disabled={Object.keys(error).length > 0}>
					Add Class
				</Form.Button>
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

export default AddClass;
*/
