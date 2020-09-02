import { Form, Image, Segment, Divider } from "semantic-ui-react"
import MUTATION_UPDATETEACHER from "../../queries/mutation/updateTeacher"
import MUTATION_ADDTEACHER from "../../queries/mutation/addTeacher"
import QUERY_DEPARTMENTS from "../../queries/query/departments"
import { useQuery, useMutation } from "@apollo/react-hooks"
import constants from "../../common/constants"
import Notify from "../../common/Notify"
import React, { useState } from "react"
import src from "../../common/ico.png"

const TeacherProfile = ({ update, theme }) => {
	const { loading: loadingDepartments, error: departmentsFetchError, data: departmentsList } = useQuery(QUERY_DEPARTMENTS)
	const [notification, setNotification] = useState([])
	const [variables, setVariables] = useState({})
	const [addTeacher, { loading }] = useMutation(update ? MUTATION_UPDATETEACHER : MUTATION_ADDTEACHER, {
		update: (_, { data }) => {
			setNotification([...notification, { message: `Teacher Saved` }])
		},
		onError: ({ graphQLErrors, networkError, message }) => {
			console.log(message)
			if (networkError) setNotification([...notification, { error: message.split(`: `)[1] }])
			else setNotification([...notification, { message: message.split(`: `)[1], error: graphQLErrors[0].extensions.error }])
		},
		variables,
	})

	if (loadingDepartments) return <h2>Loading...</h2>
	if (departmentsFetchError) return <h2>{departmentsFetchError.toString().split(`: `)[2]}</h2>

	const onChange = (_, { name, value }) => {
		if (notification.length > 0) setNotification([])
		setVariables({ ...variables, [name]: value })
	}

	const date = new Date()
	const today = date.toISOString().slice(0, 10)
	const minDOB = date.getFullYear() - 85 + `-` + date.toISOString().slice(5, 10)
	const maxDOB = date.getFullYear() - 25 + `-` + date.toISOString().slice(5, 10)

	return (
		<Segment loading={loading} inverted={theme}>
			{update ? <h1>Update Teacher</h1> : <h1>Add New Teacher</h1>}
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
						required
						onChange={onChange}
						name="designation"
						options={constants.designation}
						label="Designation"
						placeholder="Select Designation to assign"
					/>
					<Form.Select
						search
						required
						name="department"
						label="Department"
						onChange={onChange}
						placeholder="Select Department"
						options={departmentsList.departments.map(x => {
							return { text: x.name, value: x._id }
						})}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Input onChange={onChange} pattern="[\w-]+" name="registrationNumber" label="Registration Number" placeholder="Alphanumeric only" />
					<Form.Input
						fluid
						required
						onChange={onChange}
						name="contactNumber"
						label="Contact Number"
						placeholder="XXX-XXX-XXXX"
						pattern="[\d]{3}-[\d]{3}-[\d]{4}"
					/>
					<Form.Input required onChange={onChange} pattern="[\w]+" name="username" label="Username" placeholder="Alphanumeric only" />
				</Form.Group>
				<Form.Group>
					<Form.Input onChange={onChange} pattern="[\w\s]+" name="firstName" required label="First Name" placeholder="First + Middle Name" />
					<Form.Input onChange={onChange} pattern="[a-zA-Z]+" name="lastName" label="Last Name" placeholder="Last Name" />
					<Form.Select search required name="gender" label="Gender" onChange={onChange} options={constants.gender} placeholder="Select Gender" />
				</Form.Group>
				<Form.Group>
					<Form.Input
						required
						onChange={onChange}
						type="date"
						max={today}
						min="1996-01-01"
						value={variables.dateOfJoining || today}
						name="dateOfJoining"
						label="Date of Joining"
					/>
					{update && (
						<Form.Input
							required
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
					<Form.Select search required name="caste" label="Caste" onChange={onChange} options={constants.caste} placeholder="Select Caste" />
					<Form.Select
						search
						required
						name="religion"
						label="Religion"
						onChange={onChange}
						options={constants.religion}
						placeholder="Select Religion"
					/>
					<Form.Select
						search
						required
						name="bloodGroup"
						label="Blood Group"
						onChange={onChange}
						options={constants.bloodGroup}
						placeholder="Select Bloodgroup"
					/>
				</Form.Group>
				<Form.Group>
					<Form.Input required type="email" label="Email Address" name="email" onChange={onChange} placeholder="email.address@site.domain" />
					<Form.Input
						required
						type="phone"
						onChange={onChange}
						name="alternativeContact"
						label="Alternative Contact"
						pattern="[\d]{3}-[\d]{3}-[\d]{4}"
						placeholder="XXX-XXX-XXXX"
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
					<Form.Input required onChange={onChange} pattern="[\w\s.,-]+" name="addressCurrentLocality" placeholder="Locality" />
					<Form.Input required onChange={onChange} pattern="[\w\s.,-]+" name="addressCurrentTehsil" placeholder="Tehsil" />
					<Form.Select search required name="addressCurrentDistrict" onChange={onChange} placeholder="District" options={constants.district} />
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
				<Form.Button color="purple" fluid disabled={Object.keys(variables).length < 16 || notification.length > 0}>
					Submit
				</Form.Button>
			</Form>
			{notification.length > 0 && <Notify list={notification} />}
		</Segment>
	)
}

export default TeacherProfile
