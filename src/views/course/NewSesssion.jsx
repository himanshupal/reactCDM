import { useQuery, useMutation } from "@apollo/react-hooks";
import { Segment, Form, Divider, Button } from "semantic-ui-react";
import MUTATION_NEWSESSION from "../../queries/mutation/newSession";
import QUERY_COURSES from "../../queries/query/courses";
import { AuthContext } from "../../context/Auth";
import Notify from "../../common/Notify";
import React, { useState, useContext } from "react";

// Semester check and data mapping to `variables` to be done

const SingleClass = ({ loop, course, session, variables, setVariables, teachersArray }) => {
	const onChange = (_, { name, value }) => setVariables({ ...variables, [name]: value });
	const suffix = [`st`, `nd`, `rd`, ...new Array(9).fill(`th`)];
	const date = new Date();
	const today = date.toISOString().slice(0, 10);
	const sessionEndMax = date.getFullYear() + Number(course.duration.match(/\d/)[0]) + `-` + date.toISOString().slice(5, 10);
	const sessionEndDate = date.getFullYear() + 1 + `-` + date.toISOString().slice(5, 10);
	let sem = loop + 1;

	return (
		<Segment>
			{loop === Number(course.duration.match(/\d/)[0]) ? (
				<h4>Final Year (Course Finished)</h4>
			) : (
				<h4>
					{course.name} {loop + 1}
					<sup>{suffix[loop]}</sup>&nbsp;Year
					{course.semesterBased && (
						<>
							&nbsp;{session % 2 ? (sem *= 2) : loop * 2 + 1}
							<sup>{session % 2 ? suffix[--sem] : suffix[loop * 2]}</sup>
							&nbsp;Semester
						</>
					)}
				</h4>
			)}
			<Divider />
			<Form.Group>
				<Form.Input
					disabled={!session && loop === 0}
					required={session && loop === 0}
					onChange={onChange}
					name={`name` + loop}
					label="Current Name"
					value={
						variables[`name` + loop]
							? variables[`name` + loop]
							: !session
							? loop === 0
								? `Class doesn't exist`
								: `${course.identifier} Year ${loop} Sem ${sem * 2 - 2}`
							: `${course.identifier} Year ${loop + 1} Sem ${sem}`
					}
					placeholder="Previous name of the class"
				/>
				<Form.Input
					required
					onChange={onChange}
					name={`newName` + loop}
					placeholder="New name of the class"
					label={loop === Number(course.duration.match(/\d/)[0]) ? `Archive Name` : `New Name`}
					value={
						variables[`newName` + loop]
							? variables[`newName` + loop]
							: session
							? `${course.identifier} Year ${loop + 1} Sem ${++sem}`
							: loop === Number(course.duration.match(/\d/)[0])
							? `${course.identifier} ${date.getFullYear() - course.duration.match(/\d/)[0]}`
							: `${course.identifier} Year ${loop + 1} Sem ${loop * 2 + 1}`
					}
				/>
				{loop !== Number(course.duration.match(/\d/)[0]) && (
					<Form.Select
						options={teachersArray}
						onChange={onChange}
						placeholder="Select a teacher"
						name={`classTeacher` + loop}
						label="Class Teacher"
					/>
				)}
			</Form.Group>
			{loop !== Number(course.duration.match(/\d/)[0]) && (
				<Form.Group>
					<Form.Input
						type="date"
						min="1996-01-01"
						max={sessionEndMax}
						onChange={onChange}
						name={`sessionStart` + loop}
						label="Session Start date"
						value={variables[`sessionStart` + loop] ? variables[`sessionStart` + loop] : today}
					/>
					<Form.Input
						type="date"
						min="1996-07-01"
						max={sessionEndMax}
						onChange={onChange}
						name={`sessionEnd` + loop}
						label="Session End date"
						value={variables[`sessionEnd` + loop] ? variables[`sessionEnd` + loop] : sessionEndDate}
					/>
				</Form.Group>
			)}
		</Segment>
	);
};

const NewSesssion = (props) => {
	const { user } = useContext(AuthContext);
	const privAccess = user.access === `Director`;
	const { loading: crsFetch, error: fetchErr, data } = useQuery(QUERY_COURSES);
	const [notification, setNotification] = useState([]);
	const [courseArray, setCourseArray] = useState([]);
	const [course, setCourse] = useState({});
	const [variables, setVariables] = useState({});
	const [session, setSession] = useState(new Date().getMonth() >= 6);

	const [newSession, { loading }] = useMutation(MUTATION_NEWSESSION, {
		update: (_, { data }) => {
			setNotification([...notification, { message: data.addCourse }]);
		},
		onError: ({ graphQLErrors, networkError, message }) => {
			if (networkError) setNotification([...notification, { error: `Internet Connectivity Error ⚠` }]);
			else setNotification([...notification, { message: message.split(`: `)[1], error: graphQLErrors[0].extensions.error }]);
		},
		variables,
	});

	if (crsFetch) return <h2>Loading...</h2>;
	if (fetchErr) return <h2>Connectivity Error ⚠</h2>;

	return (
		<Segment className={loading ? `loading` : ``}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<h1 style={{ margin: "0" }}>Change Session</h1>
				{course.semesterBased && (
					<Button
						as="p"
						color="black"
						size="medium"
						onClick={() => {
							setVariables({ course: variables.course || `` });
							setSession((session) => !session);
						}}
					>
						{session ? `To Even (Update Classes)` : `To Odd (Add New Class)`}
					</Button>
				)}
			</div>
			<Divider />
			<Form
				widths="equal"
				onSubmit={(e) => {
					e.preventDefault();
					console.log(variables);
					// newSession();
				}}
			>
				<Form.Group>
					{privAccess && (
						<Form.Select
							name="department"
							label="Select Department"
							placeholder="Select Department to get list of courses"
							options={data.departments.departments.map((x) => {
								return { text: x.name, value: x._id };
							})}
							onChange={(_, { value }) => setCourseArray(data.departments.departments.filter((x) => x._id === value)[0].courses)}
						/>
					)}
					<Form.Select
						name="course"
						label="Select Course"
						placeholder="Select a Course to change session of"
						options={
							privAccess
								? courseArray.map((x) => {
										return { text: x.name, value: x._id };
								  })
								: data.departments.departments[0].courses.map((y) => {
										return { text: y.name, value: y._id };
								  })
						}
						onChange={(_, { name, value }) => {
							setCourse(
								privAccess
									? courseArray.filter((x) => x._id === value)[0]
									: data.departments.departments[0].courses.filter((x) => x._id === value)[0]
							);
							setVariables({ ...variables, [name]: value });
						}}
					/>
				</Form.Group>
				{course.duration &&
					(session % 2
						? [...Array(Number(course.duration.match(/\d/)[0]))].map((_, idx) => (
								<SingleClass
									key={idx}
									loop={idx}
									course={course}
									session={session}
									variables={variables}
									setVariables={setVariables}
									teachersArray={data.departments.teachers.map((x) => {
										return { text: `${x.name.first} ${x.name.last}`, value: x._id };
									})}
								/>
						  ))
						: [...Array(Number(course.duration.match(/\d/)[0]) + 1)].map((_, idx) => (
								<SingleClass
									key={idx}
									loop={idx}
									course={course}
									session={session}
									variables={variables}
									setVariables={setVariables}
									teachersArray={data.departments.teachers.map((x) => {
										return { text: `${x.name.first} ${x.name.last}`, value: x._id };
									})}
								/>
						  )))}
				<Form.Button fluid color="purple" disabled={Object.keys(variables).length < 0 || notification.length > 0}>
					Submit
				</Form.Button>
			</Form>
			{notification.length > 0 && <Notify list={notification} />}
		</Segment>
	);
};

export default NewSesssion;
