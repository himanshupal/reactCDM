import QUERY_COURSES from "../../queries/query/courses";
import QUERY_CLASSES from "../../queries/query/classes";
import MUTATION_NEWSUBJECT from "../../queries/mutation/addSubject";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import React, { useState, useContext } from "react";
import { Form, Segment, Divider } from "semantic-ui-react";
import { AuthContext } from "../../context/Auth";
import Notify from "../../common/Notify";

const AddSubject = () => {
	const { user } = useContext(AuthContext);
	const privAccess = user && user.access === `Director`;
	const { loading: crsFetch, error: fetchErr, data } = useQuery(QUERY_COURSES);
	const [getClasses, { loading: loadingClasses, data: classList }] = useLazyQuery(QUERY_CLASSES);
	const [notification, setNotification] = useState([]);
	const [courseArray, setCourseArray] = useState([]);
	const [variables, setVariables] = useState({});
	const [addSubject, { loading }] = useMutation(MUTATION_NEWSUBJECT, {
		update: (_, { data }) => {
			setNotification([...notification, { message: data.addSubject }]);
		},
		onError: ({ graphQLErrors, networkError, message }) => {
			if (networkError) setNotification([...notification, { error: message.split(`: `)[1] }]);
			else setNotification([...notification, { message: message.split(`: `)[1], error: graphQLErrors[0].extensions.error }]);
		},
		variables,
	});

	if (crsFetch) return <h2>Loading...</h2>;
	if (fetchErr) return <h2>{fetchErr.toString().split(`: `)[2]}</h2>;

	const onChange = (_, { name, value }) => {
		if (notification.length > 0) setNotification([]);
		setVariables({ ...variables, [name]: value });
	};

	return (
		<Segment className={loading || loadingClasses ? `loading` : ``}>
			<h1>Add Subject</h1>
			<Divider horizontal content="Class Details" />
			<Form
				widths="equal"
				onSubmit={(e) => {
					e.preventDefault();
					addSubject();
				}}
			>
				<Form.Group>
					{privAccess && (
						<Form.Select
							name="department"
							label="Department"
							placeholder="Select a Department to get Course list of"
							options={data.departments.departments.map((x) => {
								return { text: x.name, value: x._id };
							})}
							onChange={(_, { value }) => setCourseArray(data.departments.departments.filter((x) => x._id === value)[0].courses)}
						/>
					)}
					<Form.Select
						name="course"
						label="Course"
						placeholder="Select a Course to get Class list of"
						options={
							privAccess
								? courseArray.map((x) => {
										return { text: x.name, value: x._id };
								  })
								: data.departments.departments[0].courses.map((y) => {
										return { text: y.name, value: y._id };
								  })
						}
						onChange={(_, { value }) => {
							getClasses({
								variables: { course: value },
							});
						}}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Select
						required
						name="class"
						label="Class"
						placeholder="Select a Class to add Subjects to"
						options={
							classList
								? classList.classes.map((x) => {
										return { key: x._id, text: x.name, value: x._id };
								  })
								: []
						}
						onChange={onChange}
					/>
					<Form.Select
						required
						name="teacher"
						label="Subject Teacher"
						placeholder="Assign a Subject Teacher"
						options={
							classList
								? data.departments.teachers.map((x) => {
										return { text: `${x.name.first} ${x.name.last}`, value: x._id };
								  })
								: []
						}
						onChange={onChange}
					/>
				</Form.Group>
				<Divider horizontal content="Subject Details" />
				<Form.Input
					fluid
					required
					pattern="[\w\s\(\).,-]+"
					name="name"
					label="Subject Name"
					placeholder="Full Name of the Subject"
					onChange={onChange}
				/>
				<Form.Group>
					<Form.Input
						required
						pattern="[\w-]+"
						name="subjectCode"
						label="Subject Code"
						placeholder="Subject Code"
						onChange={onChange}
					/>
					<Form.Input
						pattern="[\w-]+"
						name="uniSubjectCode"
						label="University Subject Code"
						placeholder="University Subject Code"
						onChange={onChange}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Input
						required
						min="08:00"
						max="18:00"
						name="from"
						type="time"
						label="Time to Start"
						onChange={onChange}
						value={variables.from || `12:00`}
					/>
					<Form.Input
						required
						min="08:00"
						max="18:00"
						name="to"
						type="time"
						label="Time to End"
						onChange={onChange}
						value={variables.to || `12:00`}
					/>
				</Form.Group>
				<Form.Button fluid color="purple" disabled={Object.keys(variables).length < 5 || notification.length > 0}>
					Submit
				</Form.Button>
			</Form>
			{notification.length > 0 && <Notify list={notification} />}
		</Segment>
	);
};

export default AddSubject;
