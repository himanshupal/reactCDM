import { Form, Image, Button, Divider, Dimmer, Accordion } from "semantic-ui-react"
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks"
import React, { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../common/context"

import QUERY_CLASSES from "../../queries/query/classes"
import QUERY_COURSES from "../../queries/query/coursesOnly"
import QUERY_DEPARTMENTS from "../../queries/query/listOfDepartments"

import MUTATION_ADDSTUDENT from "../../queries/mutation/addStudent"
import MUTATION_UPDATESTUDENT from "../../queries/mutation/updateStudent"

import MutationError from "../shared/MutationError"
import Loading from "../shared/Loading"
import Error from "../shared/Error"

import constants from "../../common/constants"
import { toast } from "react-toastify"
import src from "../../common/ico.png"

const AddStudent = ({ location: { state }, update, theme }) => {
	const {
		user: { access, department },
	} = useContext(AuthContext)

	const initial = state
		? { query: QUERY_CLASSES, variables: { course: state._id } }
		: { query: QUERY_COURSES, variables: { department } }

	const [courses, setCourses] = useState()
	const [classes, setClasses] = useState()
	const [variables, setVariables] = useState({})

	const { loading, error, data } = useQuery(initial.query, { variables: initial.variables })

	const [getDepartments, { loading: loadingDepartments, data: list }] = useLazyQuery(
		QUERY_DEPARTMENTS
	)

	const [getCourses, { loading: loadingCourses, data: courseList }] = useLazyQuery(QUERY_COURSES)

	const [getClasses, { loading: loadingClasses, data: classList }] = useLazyQuery(QUERY_CLASSES)

	useEffect(() => (state ? setClasses(data && data.classes) : setCourses(data && data.courses)), [
		data,
		state,
	])

	useEffect(() => courseList && setCourses(courseList.courses), [courseList])

	useEffect(() => classList && setClasses(classList.classes), [classList])

	const [addStudent, { loading: savingStudent }] = useMutation(
		update ? MUTATION_UPDATESTUDENT : MUTATION_ADDSTUDENT,
		{
			update: () => toast.success(<h3>{update ? `Student Updated` : `Student Added`}</h3>),
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

	return (
		<>
			{update ? <h1>Update Student</h1> : <h1>Add New Student</h1>}
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
						required
						name="class"
						label="Class"
						loading={loadingClasses}
						placeholder="Select a class to add student in"
						options={
							classes
								? classes.map(x => {
										return { key: x._id, text: x.name, value: x._id }
								  })
								: []
						}
						onChange={onChange}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Input
						min="1"
						name="enrollmentNumber"
						label="Enrollment Number"
						onChange={onChange}
						placeholder="Enrollment Number"
						type="number"
					/>
					<Form.Input
						min="1"
						name="rollNumber"
						label="Roll Number"
						onChange={onChange}
						placeholder="Roll Number"
						type="number"
					/>
					<Form.Input
						required
						name="registrationNumber"
						label="Registration Number"
						onChange={onChange}
						placeholder="Registration Number"
						pattern="[\w-]+"
					/>
				</Form.Group>

				<Form.Group>
					<Form.Input
						required
						name="firstName"
						label="First Name"
						onChange={onChange}
						placeholder="First Name"
						pattern="[\w\s]+"
					/>
					<Form.Input
						name="lastName"
						label="Last Name"
						onChange={onChange}
						placeholder="Last Name"
						pattern="[\w]+"
					/>
					<Form.Input
						required
						name="dateOfBirth"
						label="Date of Birth"
						type="date"
						onChange={onChange}
						min={minDOB}
						max={maxDOB}
						value={variables.dateOfBirth || maxDOB}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Select
						search
						required
						name="caste"
						label="Caste"
						options={constants.caste}
						onChange={onChange}
						placeholder="Caste"
					/>
					<Form.Select
						search
						required
						name="religion"
						label="Religion"
						options={constants.religion}
						onChange={onChange}
						placeholder="Religion"
					/>
				</Form.Group>

				<Form.Group>
					<Form.Select
						search
						required
						name="gender"
						label="Gender"
						options={constants.gender}
						onChange={onChange}
						placeholder="Gender"
					/>
					<Form.Select
						search
						required
						name="bloodGroup"
						label="Blood Group"
						options={constants.bloodGroup}
						onChange={onChange}
						placeholder="Blood Type"
					/>
				</Form.Group>

				<Form.Group>
					<Form.Input
						required
						name="fatherName"
						label="Father's Name"
						onChange={onChange}
						placeholder="Father's Name"
						pattern="[\w\s]+"
					/>
					<Form.Input
						required
						name="fatherOccupation"
						label="Father's Occupation"
						onChange={onChange}
						placeholder="Father's Occupation"
						pattern="[\w\(\)\s.]+"
					/>
					<Form.Input
						name="fatherAnnualIncome"
						type="number"
						min="0"
						max="9999999"
						label="Father's Annual Income"
						onChange={onChange}
						placeholder="INR/Year"
					/>
				</Form.Group>

				<Form.Group>
					<Form.Input
						required
						name="motherName"
						label="Mother's Name"
						onChange={onChange}
						placeholder="Mother's Name"
						pattern="[\w\s]+"
					/>
					<Form.Input
						name="motherOccupation"
						label="Mother's Occupation"
						onChange={onChange}
						placeholder="Mother's Occupation"
						pattern="[\w\(\)\s.]+"
					/>
					<Form.Input
						name="motherAnnualIncome"
						type="number"
						min="0"
						max="9999999"
						label="Mother's Annual Income"
						onChange={onChange}
						placeholder="INR/Year"
					/>
				</Form.Group>

				<Form.Group>
					<Form.Input
						required
						name="contactNumber"
						type="tel"
						label="Contact Number"
						onChange={onChange}
						pattern="[\d]{3}-[\d]{3}-[\d]{4}"
						placeholder="XXX-XXX-XXXX"
					/>
					<Form.Input
						required
						name="fatherContactNumber"
						label="Father's Contact Number"
						onChange={onChange}
						pattern="[\d]{3}-[\d]{3}-[\d]{4}"
						placeholder="XXX-XXX-XXXX"
					/>
					<Form.Input
						name="motherContactNumber"
						label="Mother's Contact Number"
						onChange={onChange}
						pattern="[\d]{3}-[\d]{3}-[\d]{4}"
						placeholder="XXX-XXX-XXXX"
					/>
				</Form.Group>

				<Form.Group>
					<Form.Input
						required={!update}
						disabled={update}
						onChange={onChange}
						pattern="[\w]+"
						name="username"
						label="Username"
						placeholder="Alphanumeric only"
					/>
					<Form.Input
						required
						type="email"
						label="Email Address"
						name="email"
						onChange={onChange}
						placeholder="email.address@site.domain"
					/>
					<Form.Input
						required
						onChange={onChange}
						pattern="[\d]{4} [\d]{4} [\d]{4}"
						name="aadharNumber"
						label="Aadhaar number"
						placeholder="XXXX XXXX XXXX"
					/>
				</Form.Group>

				<label>
					<b>Current Address*</b>
				</label>
				<Form.Group>
					<Form.Input
						required
						onChange={onChange}
						pattern="[\w\s.,-]+"
						name="addressCurrentLocality"
						placeholder="Locality"
					/>
					<Form.Input
						required
						onChange={onChange}
						pattern="[\w\s.,-]+"
						name="addressCurrentTehsil"
						placeholder="Tehsil"
					/>
					<Form.Select
						search
						required
						name="addressCurrentDistrict"
						onChange={onChange}
						placeholder="District"
						options={constants.district}
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
						onChange={onChange}
						pattern="[\w\s.,-]+"
						name="addressPermanentLocality"
						placeholder="Locality"
						value={variables.addressPermanentLocality || ``}
					/>
					<Form.Input
						onChange={onChange}
						pattern="[\w\s.,-]+"
						name="addressPermanentTehsil"
						placeholder="Tehsil"
						value={variables.addressPermanentTehsil || ``}
					/>
					<Form.Select
						search
						name="addressPermanentDistrict"
						onChange={onChange}
						placeholder="District"
						value={variables.addressPermanentDistrict || ``}
						options={constants.district}
					/>
				</Form.Group>
				<Button color="purple" fluid disabled={!variables[`class`]}>
					Submit
				</Button>
			</Form>
		</>
	)
}

export default AddStudent
