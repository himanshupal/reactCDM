import { Form, Image, Divider, Dimmer, Icon, Button } from "semantic-ui-react"
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks"
import { toast } from "react-toastify"
import React, { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../common/context"

import QUERY_TEACHER from "../../queries/query/teacher"
import ADD_TEACHER from "../../queries/mutation/addTeacher"
import UPDATE_TEACHER from "../../queries/mutation/updateTeacher"
import QUERY_DEPARTMENTS from "../../queries/query/listOfDepartments"

import src from "../../common/ico.png"
import constants from "../../common/constants"

import Error from "../shared/Error"
import Loading from "../shared/Loading"
import MutationError from "../shared/MutationError"

const AddOrUpdateTeacher = ({
	history,
	match: {
		params: { username },
	},
	theme,
}) => {
	const {
		user: { access, username: editor },
	} = useContext(AuthContext)

	const initial = username
		? { query: QUERY_TEACHER, variables: { username } }
		: { query: QUERY_DEPARTMENTS }

	const senior = [`Director`, `Head of Department`]

	if (!senior.includes(access) && username !== editor) history.push(`/`)

	const [dpts, setDpts] = useState([])
	const [teacher, setTeacher] = useState({})
	const [variables, setVariables] = useState({})

	const { loading, error, data } = useQuery(initial.query, { variables: initial.variables })

	const [getDepartments, { loading: loadingDepartments, data: departmentsList }] = useLazyQuery(
		QUERY_DEPARTMENTS
	)

	useEffect(
		() =>
			departmentsList
				? setDpts(departmentsList.departments)
				: setDpts(!username && data && data.departments),
		[data, username, departmentsList]
	)

	useEffect(() => {
		if (username)
			if (data) {
				setTeacher(data.teacher)
				setVariables(variables => {
					return { ...variables, _id: data.teacher._id }
				})
			}
	}, [data, username])

	console.log(username, variables)

	const [addTeacher, { loading: savingTeacher }] = useMutation(
		username ? UPDATE_TEACHER : ADD_TEACHER,
		{
			update: () => {
				toast.success(<h3>{username ? `Teacher Updated` : `Teacher Added`}</h3>)
				history.push(`/teachers`)
			},
			onError: e => MutationError(e),
			variables,
		}
	)

	if (loading) return <Loading />
	if (error) return <Error />

	const onChange = (_, { name, value }) => setVariables({ ...variables, [name]: value })

	const date = new Date()
	const today = date.toISOString().slice(0, 10)
	const minDOB = date.getFullYear() - 85 + `-` + date.toISOString().slice(5, 10)
	const maxDOB = date.getFullYear() - 25 + `-` + date.toISOString().slice(5, 10)

	return (
		<>
			{username ? <h1>Update Teacher</h1> : <h1>Add New Teacher</h1>}
			<Dimmer active={savingTeacher} inverted={!theme} />
			<Divider />
			<Form
				inverted={theme}
				autoComplete="on"
				widths="equal"
				onSubmit={e => {
					e.preventDefault()
					addTeacher()
				}}
			>
				<Image size="small" centered bordered rounded src={src} />
				<Divider />
				<Form.Group>
					{/* <Form.Input type="file" transparent label="Upload Photo" /> */}
					{/* <Form.Field>
						<label htmlFor="photo">Upload Photo</label>
						<Button fluid as="p">
							Choose
						</Button>
					</Form.Field> */}
					<Form.Select
						fluid
						search
						required={!username}
						onChange={onChange}
						name="designation"
						options={constants.designation}
						label="Designation"
						placeholder="Select Designation to assign"
						value={variables.designation || teacher.designation || ``}
					/>
					<Form.Select
						search
						required={!username}
						name="department"
						label="Department"
						onChange={onChange}
						loading={loadingDepartments}
						onMouseOver={username && getDepartments}
						placeholder="Select Department"
						options={
							dpts
								? dpts.map(x => {
										return { text: x.name, value: x._id }
								  })
								: []
						}
						value={variables.department || ``}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Input
						onChange={onChange}
						pattern="[\w-]+"
						name="registrationNumber"
						label="Registration Number"
						placeholder="Alphanumeric only"
						value={variables.registrationNumber || teacher.registrationNumber || ``}
					/>
					<Form.Input
						fluid
						required={!username}
						onChange={onChange}
						name="contactNumber"
						label="Contact Number"
						placeholder="XXX-XXX-XXXX"
						pattern="[\d]{3}-[\d]{3}-[\d]{4}"
						value={variables.contactNumber || teacher.contactNumber || ``}
					/>
					<Form.Input
						required={!username}
						onChange={onChange}
						pattern="[\w]+"
						name="username"
						label="Username"
						placeholder="Alphanumeric only"
						value={variables.username || teacher.username || ``}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Input
						onChange={onChange}
						pattern="[\w\s]+"
						name="firstName"
						required={!username}
						label="First Name"
						placeholder="First + Middle Name"
						value={variables.firstName || (teacher.name && teacher.name.first) || ``}
					/>
					<Form.Input
						onChange={onChange}
						pattern="[a-zA-Z]+"
						name="lastName"
						label="Last Name"
						placeholder="Last Name"
						value={variables.lastName || (teacher.name && teacher.name.last) || ``}
					/>
					<Form.Select
						search
						required={!username}
						name="gender"
						label="Gender"
						onChange={onChange}
						options={constants.gender}
						placeholder="Select Gender"
						value={variables.gender || teacher.gender || ``}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Input
						required={!username}
						onChange={onChange}
						type="date"
						max={today}
						min="1996-01-01"
						value={variables.dateOfJoining || today}
						name="dateOfJoining"
						label="Date of Joining"
					/>
					{username && (
						<Form.Input
							required={!username}
							onChange={onChange}
							type="date"
							max={today}
							min="1996-01-01"
							value={variables.dateOfLeaving || today}
							name="dateOfLeaving"
							label="Date of Leaving"
						/>
					)}
					<Form.Input
						onChange={onChange}
						type="date"
						max={maxDOB}
						min={minDOB}
						value={variables.dateOfBirth || maxDOB}
						name="dateOfBirth"
						label="Date of Birth"
					/>
				</Form.Group>
				<Form.Group>
					<Form.Select
						search
						required={!username}
						name="caste"
						label="Caste"
						onChange={onChange}
						options={constants.caste}
						placeholder="Select Caste"
						value={variables.caste || teacher.caste || ``}
					/>
					<Form.Select
						search
						required={!username}
						name="religion"
						label="Religion"
						onChange={onChange}
						options={constants.religion}
						placeholder="Select Religion"
						value={variables.religion || teacher.religion || ``}
					/>
					<Form.Select
						search
						required={!username}
						name="bloodGroup"
						label="Blood Group"
						onChange={onChange}
						options={constants.bloodGroup}
						placeholder="Select Bloodgroup"
						value={variables.bloodGroup || teacher.bloodGroup || ``}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Input
						required={!username}
						type="email"
						label="Email Address"
						name="email"
						onChange={onChange}
						placeholder="email.address@site.domain"
						value={variables.email || teacher.email || ``}
					/>
					<Form.Input
						required={!username}
						type="phone"
						onChange={onChange}
						name="alternativeContact"
						label="Alternative Contact"
						pattern="[\d]{3}-[\d]{3}-[\d]{4}"
						placeholder="XXX-XXX-XXXX"
						value={variables.alternativeContact || teacher.alternativeContact || ``}
					/>
					<Form.Input
						required={!username}
						onChange={onChange}
						pattern="[\d]{4} [\d]{4} [\d]{4}"
						name="aadharNumber"
						label="Aadhaar number"
						placeholder="XXXX XXXX XXXX"
						value={variables.aadharNumber || teacher.aadharNumber || ``}
					/>
				</Form.Group>
				<label>
					<b>Current Address{!username && `*`}</b>
				</label>
				<Form.Group>
					<Form.Input
						required={!username}
						onChange={onChange}
						pattern="[\w\s.,-]+"
						name="addressCurrentLocality"
						placeholder="Locality"
						value={
							variables.addressCurrentLocality ||
							(teacher.address && teacher.address.current.locality) ||
							``
						}
					/>
					<Form.Input
						required={!username}
						onChange={onChange}
						pattern="[\w\s.,-]+"
						name="addressCurrentTehsil"
						placeholder="Tehsil"
						value={
							variables.addressCurrentTehsil ||
							(teacher.address && teacher.address.current.tehsil) ||
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
							(teacher.address && teacher.address.current.district) ||
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
						onChange={onChange}
						pattern="[\w\s.,-]+"
						name="addressPermanentLocality"
						placeholder="Locality"
						value={
							variables.addressPermanentLocality ||
							(teacher.address && teacher.address.permanent.locality) ||
							``
						}
					/>
					<Form.Input
						onChange={onChange}
						pattern="[\w\s.,-]+"
						name="addressPermanentTehsil"
						placeholder="Tehsil"
						value={
							variables.addressPermanentTehsil ||
							(teacher.address && teacher.address.permanent.tehsil) ||
							``
						}
					/>
					<Form.Select
						search
						name="addressPermanentDistrict"
						onChange={onChange}
						placeholder="District"
						value={
							variables.addressPermanentDistrict ||
							(teacher.address && teacher.address.permanent.district) ||
							``
						}
						options={constants.district}
					/>
				</Form.Group>

				<Button
					fluid
					animated="fade"
					inverted={theme}
					disabled={username ? Object.keys(variables).length < 2 : !variables[`username`]}
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

export default AddOrUpdateTeacher
