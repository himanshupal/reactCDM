import { Form, Image, Button, Segment, Divider } from "semantic-ui-react";
import MUTATION_UPDATETEACHER from "../../queries/mutation/updateTeacher";
import MUTATION_ADDTEACHER from "../../queries/mutation/addTeacher";
import QUERY_DEPARTMENTS from "../../queries/query/departments";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Notify from "../../common/Notify";
import React, { useState } from "react";
import constants from "../common";
import src from "./logo512.png";

const TeacherProfile = ({ update }) => {
	const { loading: dptFetch, error: fetchErr, data } = useQuery(QUERY_DEPARTMENTS);
	const [notification, setNotification] = useState([]);
	const [variables, setVariables] = useState({});
	const [addTeacher, { loading }] = useMutation(update ? MUTATION_UPDATETEACHER : MUTATION_ADDTEACHER, {
		update: (_, { data }) => {
			setNotification([...notification, { message: data.addTeacher }]);
		},
		onError: ({ graphQLErrors, networkError, message }) => {
			console.log(message);
			if (networkError) setNotification([...notification, { error: message.split(`: `)[1] }]);
			else setNotification([...notification, { message: message.split(`: `)[1], error: graphQLErrors[0].extensions.error }]);
		},
		variables,
	});
	if (dptFetch) return <h2>Loading...</h2>;
	if (fetchErr) {
		// props.history.push(`/login`);
		// return null;
		return <h2>Connectivity Error ⚠</h2>;
	}
	const onChange = (_, { name, value }) => {
		setNotification([]);
		setVariables({ ...variables, [name]: value });
	};
	const date = new Date();
	const today = date.toISOString().slice(0, 10);
	const minDOB = date.getFullYear() - 85 + `-` + date.toISOString().slice(5, 10);
	const maxDOB = date.getFullYear() - 25 + `-` + date.toISOString().slice(5, 10);

	return (
		<Segment className={loading ? `loading` : ``}>
			{update ? <h1>Update Teacher</h1> : <h1>Add New Teacher</h1>}
			<Divider />
			<Form
				autoComplete="on"
				widths="equal"
				onSubmit={(e) => {
					e.preventDefault();
					addTeacher();
				}}
			>
				<Image size="small" centered bordered rounded src={src} />
				<Divider />
				<Form.Group>
					{/* <Form.Input type="file" transparent label="Upload Photo" width={update ? `16` : `8`} /> */}
					<Form.Field>
						<label htmlFor="photo">Upload Photo</label>
						<Button fluid as="p">
							Choose
						</Button>
					</Form.Field>
					{!update && (
						<>
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
							<Form.Input
								fluid
								required
								onChange={onChange}
								name="contactNumber"
								label="Contact Number"
								placeholder="XXX-XXX-XXXX"
								pattern="[\d]{3}-[\d]{3}-[\d]{4}"
							/>
						</>
					)}
					{update && (
						<>
							<Form.Select
								search
								required
								disabled={update}
								name="department"
								label="Department"
								onChange={onChange}
								placeholder="Select Department"
								options={data.departments.departments.map((x) => {
									return {
										text: x.name,
										value: x.name,
									};
								})}
							/>
							<Form.Input
								required
								disabled={update}
								onChange={onChange}
								pattern="[\w]+"
								name="username"
								label="Username"
								placeholder="Alphanumeric only"
							/>
						</>
					)}
				</Form.Group>
				<Form.Group>
					<Form.Input
						onChange={onChange}
						pattern="[\w-]+"
						name="registrationNumber"
						label="Registration Number"
						placeholder="Alphanumeric only"
					/>
					{update && (
						<>
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
							<Form.Input
								fluid
								required
								onChange={onChange}
								name="contactNumber"
								label="Contact Number"
								placeholder="XXX-XXX-XXXX"
								pattern="[\d]{3}-[\d]{3}-[\d]{4}"
							/>
						</>
					)}
					{!update && (
						<>
							<Form.Select
								search
								required
								disabled={update}
								name="department"
								label="Department"
								onChange={onChange}
								placeholder="Select Department"
								options={data.departments.departments.map((x) => {
									return {
										text: x.name,
										value: x.name,
									};
								})}
							/>
							<Form.Input
								required
								disabled={update}
								onChange={onChange}
								pattern="[\w]+"
								name="username"
								label="Username"
								placeholder="Alphanumeric only"
							/>
						</>
					)}
				</Form.Group>
				<Form.Group>
					<Form.Input
						onChange={onChange}
						pattern="[\w\s]+"
						name="firstName"
						required
						label="First Name"
						placeholder="First + Middle Name"
					/>
					<Form.Input onChange={onChange} pattern="[a-zA-Z]+" name="lastName" label="Last Name" placeholder="Last Name" />
					<Form.Select
						search
						required
						name="gender"
						label="Gender"
						onChange={onChange}
						options={constants.gender}
						placeholder="Select Gender"
					/>
				</Form.Group>
				<Form.Group widths="equal">
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
					{!update && (
						<Form.Input
							required
							onChange={onChange}
							name="contactNumber"
							label="Contact Number"
							pattern="[\d]{3}-[\d]{3}-[\d]{4}"
							placeholder="XXX-XXX-XXXX"
						/>
					)}
				</Form.Group>
				<Form.Group>
					<Form.Select
						search
						required
						name="caste"
						label="Caste"
						onChange={onChange}
						options={constants.caste}
						placeholder="Select Caste"
					/>
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
				<Form.Group widths="equal">
					<Form.Input required onChange={onChange} pattern="[\w\s.,-]+" name="addressCurrentLocality" placeholder="Locality" />
					<Form.Input required onChange={onChange} pattern="[\w\s.,-]+" name="addressCurrentTehsil" placeholder="Tehsil" />
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
				<Form.Group widths="equal">
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
				<Button color="purple" fluid disabled={Object.keys(variables).length < 16 || notification.length > 0}>
					Submit
				</Button>
			</Form>
			{Object.keys(notification).length > 0 && <Notify list={notification} />}
		</Segment>
	);
};

export default TeacherProfile;
