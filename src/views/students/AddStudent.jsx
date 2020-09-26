import { Form, Icon, Image, Button, Divider, Dimmer, Accordion } from "semantic-ui-react"
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks"
import React, { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../common/context"

import QUERY_STUDENT from "../../queries/query/student"
import QUERY_COURSES from "../../queries/query/coursesOnly"
import QUERY_CLASSES from "../../queries/query/classesNameOnly"
import QUERY_DEPARTMENTS from "../../queries/query/listOfDepartments"

import ADD_STUDENT from "../../queries/mutation/addStudent"
import UPDATE_STUDENT from "../../queries/mutation/updateStudent"

import MutationError from "../shared/MutationError"
import Loading from "../shared/Loading"
import Error from "../shared/Error"

import constants from "../../common/constants"
import { toast } from "react-toastify"
import src from "../../common/ico.png"

const AddOrUpdateStudent = ({
	history,
	location: { state },
	match: {
		params: { username },
	},
	theme,
}) => {
	const {
		user: { access, username: editor, department, classTeacherOf },
	} = useContext(AuthContext)

	const initial = username
		? { query: QUERY_STUDENT, variables: { username } }
		: { query: QUERY_COURSES, variables: { department } }

	if (access === `student` && username !== editor) history.push(`/`)

	const [courses, setCourses] = useState()
	const [classes, setClasses] = useState()
	const [student, setStudent] = useState({})
	const [variables, setVariables] = useState({})

	const { loading, error, data } = useQuery(initial.query, { variables: initial.variables })

	const [getDepartments, { loading: loadingDepartments, data: list }] = useLazyQuery(
		QUERY_DEPARTMENTS
	)

	const [getCourses, { loading: loadingCourses, data: courseList }] = useLazyQuery(QUERY_COURSES)

	const [getClasses, { loading: loadingClasses, data: classList }] = useLazyQuery(QUERY_CLASSES)

	useEffect(() => {
		if (data) {
			if (username) {
				setStudent(data.student)
				setVariables(variables => {
					return { ...variables, _id: data.student._id }
				})
			} else setCourses(data.courses)
		}
	}, [data, username])

	useEffect(() => {
		if (!username)
			state && state.class
				? setVariables(variables => {
						return { ...variables, class: state.class }
				  })
				: setVariables(variables => {
						return { ...variables, class: classTeacherOf }
				  })
	}, [state, username, classTeacherOf])

	useEffect(() => courseList && setCourses(courseList.courses), [courseList])

	useEffect(() => classList && setClasses(classList.classes), [classList])

	const [addStudent, { loading: savingStudent }] = useMutation(
		username ? UPDATE_STUDENT : ADD_STUDENT,
		{
			update: () => {
				toast.success(<h3>{username ? `Student Updated` : `Student Added`}</h3>)
				history.push(`/students`)
			},
			onError: e => MutationError(e),
			variables,
		}
	)

	if (loading) return <Loading />
	if (error) return <Error />

	const onChange = (_, { name, value }) => setVariables({ ...variables, [name]: value })

	const date = new Date()
	const minDOB = date.getFullYear() - 55 + `-` + date.toISOString().slice(5, 10)
	const maxDOB = date.getFullYear() - 16 + `-` + date.toISOString().slice(5, 10)

	document.title = username ? `Update Student` : `Add Student`

	return (
		<>
			{username ? <h1>Update Student</h1> : <h1>Add Student</h1>}
			<Dimmer active={savingStudent} inverted={!theme} />
			<Divider />
			<Form
				inverted={theme}
				widths="equal"
				onSubmit={e => {
					e.preventDefault()
					addStudent()
				}}
			>
				<Image size="small" centered src={src} />
				<Divider />

				<div className="field">
					<div className="ui fluid action input">
						<input type="file" />
						<button onClick={e => e.preventDefault()} className="ui button">
							Upload Image
						</button>
					</div>
				</div>

				{/* <Form.Input fluid action="Upload Image" type="file" content="none" /> */}
				<Form.Group>
					{access === `Director` && (
						<Accordion
							as={Form.Field}
							inverted={theme}
							onClick={getDepartments}
							panels={[
								{
									key: `department`,
									title: `Change Department`,
									content: {
										loading: loadingDepartments,
										placeholder: `Select department to get list of courses`,
										as: Form.Select,
										options: list
											? list.departments.map(x => {
													return { text: x.name, value: x._id }
											  })
											: [],
										onChange: (_, { value }) => getCourses({ variables: { department: value } }),
									},
								},
							]}
						/>
					)}
				</Form.Group>
				<Form.Group>
					<Form.Select
						label="Course"
						loading={loadingCourses}
						onMouseOver={() => !list && !courses && getCourses({ variables: { department } })}
						onClick={() => !list && !courses && getCourses({ variables: { department } })}
						placeholder="Select a course to get list of classes"
						options={
							courses
								? courses.map(x => {
										return { text: x.name, value: x._id }
								  })
								: []
						}
						onChange={(_, { value }) => getClasses({ variables: { course: value } })}
					/>
					<Form.Select
						search
						required={!username}
						name="class"
						label="Class"
						loading={loadingClasses}
						value={
							variables.class || student.class || (state && state.class) || classTeacherOf || ``
						}
						placeholder="Select a class to add student in"
						options={
							classes
								? classes.map(x => {
										return { text: x.name, value: x._id }
								  })
								: []
						}
						onChange={onChange}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Input
						min="1"
						type="number"
						name="enrollmentNumber"
						label="Enrollment Number"
						onChange={onChange}
						placeholder="Enrollment Number"
						value={variables.enrollmentNumber || student.enrollmentNumber || ``}
					/>
					<Form.Input
						min="1"
						type="number"
						name="rollNumber"
						label="Roll Number"
						onChange={onChange}
						placeholder="Roll Number"
						value={variables.rollNumber || student.rollNumber || ``}
					/>
					<Form.Input
						required={!username}
						pattern="[\w-]+"
						name="registrationNumber"
						label="Registration Number"
						onChange={onChange}
						placeholder="Registration Number"
						value={variables.registrationNumber || student.registrationNumber || ``}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Input
						required={!username}
						pattern="[\w\s]+"
						name="firstName"
						label="First Name"
						onChange={onChange}
						placeholder="First Name"
						value={variables.firstName || (student.name && student.name.first) || ``}
					/>
					<Form.Input
						pattern="[\w]+"
						name="lastName"
						label="Last Name"
						onChange={onChange}
						placeholder="Last Name"
						value={variables.lastName || (student.name && student.name.last) || ``}
					/>
					<Form.Input
						required={!username}
						type="date"
						size="small"
						name="dateOfBirth"
						label="Date of Birth"
						onChange={onChange}
						min={minDOB}
						max={maxDOB}
						value={variables.dateOfBirth || student.dateOfBirth || maxDOB}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Select
						search
						name="caste"
						label="Caste"
						onChange={onChange}
						placeholder="Caste"
						options={constants.caste}
						value={variables.caste || student.caste || ``}
					/>
					<Form.Select
						search
						required={!username}
						name="religion"
						label="Religion"
						onChange={onChange}
						placeholder="Religion"
						options={constants.religion}
						value={variables.religion || student.religion || ``}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Select
						search
						required={!username}
						name="gender"
						label="Gender"
						onChange={onChange}
						placeholder="Gender"
						options={constants.gender}
						value={variables.gender || student.gender || ``}
					/>
					<Form.Select
						search
						name="bloodGroup"
						label="Blood Group"
						onChange={onChange}
						placeholder="Blood Type"
						options={constants.bloodGroup}
						value={variables.bloodGroup || student.bloodGroup || ``}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Input
						required={!username}
						pattern="[\w\s]+"
						name="fatherName"
						label="Father's Name"
						onChange={onChange}
						placeholder="Father's Name"
						value={variables.fatherName || (student.father && student.father.name) || ``}
					/>
					<Form.Input
						required={!username}
						pattern="[\w\(\)\s.]+"
						name="fatherOccupation"
						label="Father's Occupation"
						onChange={onChange}
						placeholder="Father's Occupation"
						value={
							variables.fatherOccupation || (student.father && student.father.occupation) || ``
						}
					/>
					<Form.Input
						min="0"
						max="9999999"
						type="number"
						name="fatherAnnualIncome"
						label="Father's Annual Income"
						onChange={onChange}
						placeholder="INR/Year"
						value={
							variables.fatherAnnualIncome || (student.father && student.father.annualIncome) || ``
						}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Input
						required={!username}
						pattern="[\w\s]+"
						name="motherName"
						label="Mother's Name"
						onChange={onChange}
						placeholder="Mother's Name"
						value={variables.motherName || (student.mother && student.mother.name) || ``}
					/>
					<Form.Input
						pattern="[\w\(\)\s.]+"
						name="motherOccupation"
						label="Mother's Occupation"
						onChange={onChange}
						placeholder="Mother's Occupation"
						value={
							variables.motherOccupation || (student.mother && student.mother.occupation) || ``
						}
					/>
					<Form.Input
						min="0"
						max="9999999"
						type="number"
						name="motherAnnualIncome"
						label="Mother's Annual Income"
						onChange={onChange}
						placeholder="INR/Year"
						value={
							variables.motherAnnualIncome || (student.mother && student.mother.annualIncome) || ``
						}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Input
						required={!username}
						type="tel"
						pattern="[\d]{3}-[\d]{3}-[\d]{4}"
						name="contactNumber"
						label="Contact Number"
						onChange={onChange}
						placeholder="XXX-XXX-XXXX"
						value={variables.contactNumber || student.contactNumber || ``}
					/>
					<Form.Input
						required={!username}
						pattern="[\d]{3}-[\d]{3}-[\d]{4}"
						name="fatherContactNumber"
						label="Father's Contact Number"
						onChange={onChange}
						placeholder="XXX-XXX-XXXX"
						value={
							variables.fatherContactNumber ||
							(student.father && student.father.contactNumber) ||
							``
						}
					/>
					<Form.Input
						pattern="[\d]{3}-[\d]{3}-[\d]{4}"
						name="motherContactNumber"
						label="Mother's Contact Number"
						onChange={onChange}
						placeholder="XXX-XXX-XXXX"
						value={
							variables.motherContactNumber ||
							(student.mother && student.mother.contactNumber) ||
							``
						}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Input
						required={!username}
						pattern="[\w]+"
						name="username"
						label="Username"
						onChange={onChange}
						placeholder="Alphanumeric only"
						value={variables.username || student.username || ``}
					/>
					<Form.Input
						required={!username}
						type="email"
						name="email"
						label="Email Address"
						onChange={onChange}
						placeholder="email.address@site.domain"
						value={variables.email || student.email || ``}
					/>
					<Form.Input
						required={!username}
						pattern="[\d]{4} [\d]{4} [\d]{4}"
						name="aadharNumber"
						label="Aadhaar number"
						onChange={onChange}
						placeholder="XXXX XXXX XXXX"
						value={variables.aadharNumber || student.aadharNumber || ``}
					/>
				</Form.Group>

				<label>
					<b>Current Address{!username && `*`}</b>
				</label>
				<Form.Group>
					<Form.Input
						required={!username}
						pattern="[\w\s.,-]+"
						name="addressCurrentLocality"
						onChange={onChange}
						placeholder="Locality"
						value={
							variables.addressCurrentLocality ||
							(student.address && student.address.current.locality) ||
							``
						}
					/>
					<Form.Input
						required={!username}
						pattern="[\w\s.,-]+"
						name="addressCurrentTehsil"
						onChange={onChange}
						placeholder="Tehsil"
						value={
							variables.addressCurrentTehsil ||
							(student.address && student.address.current.tehsil) ||
							``
						}
					/>
					<Form.Select
						search
						required={!username}
						name="addressCurrentDistrict"
						onChange={onChange}
						placeholder="District"
						options={constants.district}
						value={
							variables.addressCurrentDistrict ||
							(student.address && student.address.current.district) ||
							``
						}
					/>
				</Form.Group>
				<label>
					<b
						onClick={() =>
							setVariables({
								...variables,
								addressPermanentLocality: variables.addressCurrentLocality,
								addressPermanentTehsil: variables.addressCurrentTehsil,
								addressPermanentDistrict: variables.addressCurrentDistrict,
							})
						}
					>
						Permanent Address (Click to copy Current Address)
					</b>
				</label>
				<Form.Group>
					<Form.Input
						pattern="[\w\s.,-]+"
						name="addressPermanentLocality"
						onChange={onChange}
						placeholder="Locality"
						value={
							variables.addressPermanentLocality ||
							(student.address &&
								student.address.permanent &&
								student.address.permanent.locality) ||
							``
						}
					/>
					<Form.Input
						pattern="[\w\s.,-]+"
						name="addressPermanentTehsil"
						onChange={onChange}
						placeholder="Tehsil"
						value={
							variables.addressPermanentTehsil ||
							(student.address && student.address.permanent && student.address.permanent.tehsil) ||
							``
						}
					/>
					<Form.Select
						name="addressPermanentDistrict"
						placeholder="District"
						onChange={onChange}
						options={constants.district}
						value={
							variables.addressPermanentDistrict ||
							(student.address &&
								student.address.permanent &&
								student.address.permanent.district) ||
							``
						}
					/>
				</Form.Group>

				<Button
					fluid
					animated="fade"
					inverted={theme}
					disabled={username ? Object.keys(variables).length < 2 : !variables[`class`]}
					content={
						<>
							<Button.Content visible content={<Icon name="add circle" />} />
							<Button.Content hidden content={username ? `Update` : `Save`} />
						</>
					}
				/>
			</Form>
		</>
	)
}

export default AddOrUpdateStudent
