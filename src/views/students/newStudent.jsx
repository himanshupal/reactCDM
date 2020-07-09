import React, { useState } from "react";
import { Form, Image, Button, Segment } from "semantic-ui-react";
import addStudent_mut from "../../queries/mutation/addStudent";
import { useMutation } from "@apollo/react-hooks";
import src from "./logo512.png";
import selection from "../common";

const Studentprofile = (props) => {
	const [error, setError] = useState({}),
		[variables, setVariables] = useState({}),
		[addStudent, { loading }] = useMutation(addStudent_mut, {
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
			console.log(variables);
			await addStudent();
		};
	return (
		<Segment.Group>
			<Segment textAlign="right">
				<Image size="small" centered rounded src={src} />
				<Button compact secondary>
					Upload Image
				</Button>
			</Segment>
			{/* <Divider horizontal>Student Details</Divider> */}
			<Segment>
				<Form widths="equal" onSubmit={handleSubmit}>
					<Form.Group>
						<Form.Select
							name="class"
							options={selection.classes}
							label="Class"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="Class"
						/>
						<Form.Input
							name="registrationNumber"
							type="number"
							label="Registration Number"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="Registration Number"
						/>
						<Form.Input
							name="enrollmentNumber"
							type="number"
							label="Enrollment Number"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="Enrollment Number"
						/>
						<Form.Input
							name="rollNumber"
							type="number"
							label="Roll Number"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="Roll Number"
						/>
					</Form.Group>
					<Form.Group>
						<Form.Input
							name="firstName"
							label="First Name"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="First Name"
						/>
						<Form.Input
							name="lastName"
							label="Last Name"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="Last Name"
						/>
						<Form.Select
							name="gender"
							search
							clearable
							closeOnBlur
							openOnFocus
							options={selection.genders}
							label="Gender"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="Gender"
							search
						/>
						<Form.Input name="dateOfBirth" type="date" label="Date of Birth" />
					</Form.Group>
					<Form.Group>
						<Form.Input
							name="fatherName"
							label="Father's Name"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="Father's Name"
						/>
						<Form.Input
							name="fatherOccupation"
							label="Occupation"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="Occupation"
						/>
						<Form.Input
							name="fatherAnnualIncome"
							type="number"
							label="Annual Income"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="INR/Yr."
						/>
						<Form.Input
							name="fatherContactNumber"
							type="phone"
							label="Contact Number"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="+91-XXX-XXX-XXXX"
						/>
					</Form.Group>
					<Form.Group>
						<Form.Input
							name="motherName"
							label="Mother's Name"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="Mother's Name"
						/>
						<Form.Input
							name="motherOccupation"
							label="Occupation"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="Occupation"
						/>
						<Form.Input
							name="motherAnnualIncome"
							type="number"
							label="Annual Income"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="INR/Yr."
						/>
						<Form.Input
							name="contactNumber"
							type="phone"
							label="Contact Number"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="+91-XXX-XXX-XXXX"
						/>
					</Form.Group>
					<Form.Group>
						<Form.Select
							name="caste"
							search
							clearable
							closeOnBlur
							openOnFocus
							options={selection.castes}
							label="Caste"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="Caste"
						/>
						<Form.Select
							name="religion"
							search
							clearable
							closeOnBlur
							openOnFocus
							options={selection.religions}
							label="Religion"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="Religion"
						/>
						<Form.Select
							name="bloodGroup"
							options={selection.bloodGroups}
							label="Blood Group"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="Blood Type"
						/>
						<Form.Input
							name="username"
							label="Username"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="XXX00000"
						/>
					</Form.Group>
					<Form.Group>
						<Form.Input
							name="email"
							type="email"
							label="Email"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="student@rbmi.in"
						/>
						<Form.Input
							name="contactNumber"
							type="phone"
							label="Contact Number"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="+91-XXX-XXX-XXXX"
						/>
						<Form.Input
							name="aadharNumber"
							label="Aadhaar Number"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="XXXX-XXXX-XXXX"
						/>
					</Form.Group>
					<b>
						<label>Current Address</label>
					</b>
					<Form.Group>
						<Form.Input
							name="addressCurrentLocality"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="Locality"
						/>
						<Form.Input
							name="addressCurrentDistrict"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="District"
						/>
						<Form.Input
							name="addressCurrentCity"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="City"
						/>
					</Form.Group>
					<b>
						<label>Permanent Address</label>
					</b>
					<Form.Group>
						<Form.Input
							name="addressPermanentLocality"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="Locality"
						/>
						<Form.Input
							name="addressPermanentDistrict"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="District"
						/>
						<Form.Input
							name="addressPermanentCity"
							onChange={(_, { name, value }) =>
								setVariables({ ...variables, [name]: value })
							}
							placeholder="City"
						/>
					</Form.Group>
					<Button color="orange" fluid>
						Submit
					</Button>
				</Form>
				{Object.keys(error).length > 0 && (
					<div className="ui error message">
						{Object.values(error).map((err) => (
							<h5 key={err}>{err}</h5>
						))}
					</div>
				)}
			</Segment>
		</Segment.Group>
	);
};

export default Studentprofile;
