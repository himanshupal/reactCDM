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
	const [numberOfSubjects, changeNumberOfSubjects] = useState([undefined]);
	const [subjectAdded, changeSubjectAdded] = useState(false);
	const [notification, setNotification] = useState([]);
	const [courseArray, setCourseArray] = useState([]);
	const [confirm, setConfirm] = useState(false);
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
		<Segment className={loading ? `loading` : ``}>
			<h1>Add Subject</h1>
			<Divider horizontal content="Class Details" />
			<Form
				widths="equal"
				onSubmit={(e) => {
					if (confirm) addSubject();
					e.preventDefault();
					setConfirm(false);
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
					<Form.Select
						required
						name="class_id"
						label="Class"
						loading={loadingClasses}
						placeholder="Select a Class to add Subjects to"
						options={
							classList
								? classList.classes.map((x) => {
										return { key: x._id, text: x.name, value: x.name };
								  })
								: []
						}
						onChange={onChange}
					/>
				</Form.Group>
				{numberOfSubjects.map((__, idx) => (
					<div key={idx}>
						<Divider horizontal content={`Subject ${idx + 1} Details`} />
						<Form.Group>
							<Form.Input
								fluid
								required
								pattern="[\w\s\(\).,-]+"
								name={`name` + idx}
								label="Subject Name"
								placeholder="Full Name of the Subject"
								onChange={onChange}
							/>
							<Form.Select
								required
								name={`teacher` + idx}
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
						<Form.Group>
							<Form.Input required pattern="[\w-]+" name={`subjectCode` + idx} label="Subject Code" placeholder="Subject Code" onChange={onChange} />
							<Form.Input
								pattern="[\w-]+"
								name={`uniSubjectCode` + idx}
								label="University Subject Code"
								placeholder="University Subject Code"
								onChange={onChange}
							/>
						</Form.Group>
					</div>
				))}
				<Form.Group>
					<Form.Button
						fluid
						width={confirm ? 8 : 10}
						color={confirm ? `green` : `purple`}
						disabled={!(`class_id` in variables) || notification.length > 0}
						content={confirm ? `Yes` : `Submit`}
						onClick={() => setConfirm(true)}
					/>
					{confirm ? (
						<Form.Button width={8} fluid color="red" content="No" onClick={() => setConfirm(false)} />
					) : (
						<>
							<Form.Button
								fluid
								width={subjectAdded ? 3 : 6}
								color="teal"
								content="Add Subject"
								onClick={() => {
									if (numberOfSubjects.length >= 10) setNotification([...notification, { error: `You can only add 10 subjects at a time.` }]);
									const len = numberOfSubjects.length <= 9 ? numberOfSubjects.length + 1 : numberOfSubjects.length;
									changeNumberOfSubjects(new Array(len).fill());
									changeSubjectAdded(true);
								}}
							/>
							{subjectAdded && (
								<Form.Button
									fluid
									width={3}
									color="brown"
									content="Remove Subject"
									onClick={() => {
										setNotification([]);
										if (numberOfSubjects.length <= 2) changeSubjectAdded(false);
										const len = numberOfSubjects.length;
										changeNumberOfSubjects(new Array(len - 1).fill());
										setVariables((variables) => {
											delete variables[`name` + (len - 1)];
											delete variables[`teacher` + (len - 1)];
											delete variables[`subjectCode` + (len - 1)];
											delete variables[`uniSubjectCode` + (len - 1)];
											return variables;
										});
									}}
								/>
							)}
						</>
					)}
				</Form.Group>
			</Form>
			{notification.length > 0 && <Notify list={notification} />}
		</Segment>
	);
};

export default AddSubject;
