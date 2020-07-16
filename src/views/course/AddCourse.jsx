import QUERY_DEPARTMENTS from "../../queries/query/departments";
import ADD_COURSE from "../../queries/mutation/addCourse";
import { Segment, Form, Button, Divider } from "semantic-ui-react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Notify from "../../common/Notify";
import React, { useState } from "react";
import constants from "../common";

const AddCourse = (props) => {
	const { loading: dptFetch, error: fetchErr, data } = useQuery(QUERY_DEPARTMENTS);
	const [dpts, setDpts] = useState([]);
	const [notification, setNotification] = useState([]);
	const [semVal, setSem] = useState(true);
	const [variables, setVariables] = useState({ semesterBased: true });
	const [addCourse, { loading }] = useMutation(ADD_COURSE, {
		update: (_, { data }) => {
			setNotification([...notification, { message: data.addCourse }]);
		},
		onError: ({ graphQLErrors, networkError, message }) => {
			if (networkError) setNotification([...notification, { error: `Internet Connectivity Error ⚠` }]);
			else setNotification([...notification, { message: message.split(`: `)[1], error: graphQLErrors[0].extensions.error }]);
		},
		variables,
	});
	if (dptFetch) return <h2>Loading...</h2>;
	if (fetchErr) return <h2>Connectivity Error ⚠</h2>;

	const mapData = () =>
		setDpts(
			data.departments.departments.map((x) => {
				return {
					text: x.name,
					value: x.name,
				};
			})
		);
	const onChange = (_, { name, value }) => {
		setNotification([]);
		setVariables({ ...variables, [name]: value });
	};

	return (
		<Segment className={loading ? `loading` : ``}>
			<h1>Add New Course</h1>
			<Divider />
			<Form
				widths="equal"
				onSubmit={(e) => {
					e.preventDefault();
					addCourse();
				}}
			>
				<Form.Input
					required
					pattern="[\w\s',\-]+"
					name="name"
					label="Course name"
					placeholder="Full name of the Course"
					onChange={onChange}
				/>
				<Form.Group>
					<Form.Input
						required
						pattern="[\w\.\s]+"
						name="identifier"
						label="Course Abbreviation"
						placeholder="e.g. BCA"
						onChange={onChange}
					/>
					<Form.Select
						search
						required
						wrapSelection
						name="duration"
						onChange={onChange}
						label="Duration"
						placeholder="Duration of the course"
						options={constants.duration}
					/>
					<Form.Select
						search
						required
						wrapSelection
						allowAdditions
						name="department"
						onFocus={mapData}
						onChange={onChange}
						onAddItem={(_, { value }) => {
							setDpts([...dpts, { text: value, value }]);
						}}
						label="Department"
						placeholder="Select / Add Department"
						options={dpts}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Select
						search
						clearable
						wrapSelection
						name="director"
						onChange={onChange}
						label="Director"
						placeholder="Select Teacher"
						options={data.departments.teachers.map((x) => {
							return {
								text: `${x.name.first} ${x.name.last}`,
								value: x._id,
							};
						})}
					/>
					<Form.Select
						search
						clearable
						wrapSelection
						name="headOfDepartment"
						onChange={onChange}
						label="Head of Department"
						placeholder="Select Teacher"
						options={data.departments.teachers.map((x) => {
							return {
								text: `${x.name.first} ${x.name.last}`,
								value: x._id,
							};
						})}
					/>
					<Form.Field>
						<label htmlFor="semester">Semester based *</label>
						<Button.Group fluid>
							<Button
								as="p"
								color={semVal ? `green` : null}
								onClick={() => {
									setSem(true);
									setVariables({ ...variables, semesterBased: true });
								}}
							>
								Yes
							</Button>
							<Button.Or />
							<Button
								as="p"
								color={semVal ? null : `youtube`}
								onClick={() => {
									setSem(false);
									setVariables({ ...variables, semesterBased: false });
								}}
							>
								No
							</Button>
						</Button.Group>
					</Form.Field>
				</Form.Group>
				<Form.Button fluid color="purple" disabled={Object.keys(variables).length < 4 || notification.length > 0}>
					Submit
				</Form.Button>
			</Form>
			{notification.length > 0 && <Notify list={notification} />}
		</Segment>
	);
};

export default AddCourse;
