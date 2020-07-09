import React, { useState } from "react";
import { Form, Image, Button, Segment, Divider } from "semantic-ui-react";
import addTeacher_mut from "../../queries/mutation/addTeacher";
import { useMutation } from "@apollo/react-hooks";
import selection from "../common";
import src from "./logo512.png";

const TeacherProfile = (props) => {
	const [error, setError] = useState({}),
		[variables, setVariables] = useState({}),
		[addTeacher, { loading }] = useMutation(addTeacher_mut, {
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
			await addTeacher();
		};

	return (
		<Segment>
			<Form
				widths="equal"
				onSubmit={handleSubmit}
				className={loading ? `loading` : ``}
			>
				<Image size="small" centered rounded src={src} />
				<Form.Group>
					<Form.Select
						width="12"
						required
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						search
						clearable
						closeOnBlur
						openOnFocus
						name="designation"
						options={selection.designation}
						label="Designation"
						placeholder="Designation"
					/>
					<Form.Input
						width="4"
						fluid
						focus
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						name="photo"
						label="Update Photo"
						// transparent
						type="file"
					/>
				</Form.Group>
				<Divider horizontal>Teacher Details</Divider>
				<Form.Group>
					<Form.Input
						required
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						name="registrationNumber"
						label="Registration Number"
						placeholder="Registration Number"
					/>
					<Form.Select
						required
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						search
						clearable
						closeOnBlur
						openOnFocus
						name="major"
						options={selection.subjects}
						label="Primary Subject"
						placeholder="Major"
					/>
					<Form.Input
						required
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						name="username"
						label="Username"
						placeholder="A unique Username"
					/>
				</Form.Group>
				<Form.Group>
					<Form.Input
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						name="firstName"
						required
						label="First Name"
						placeholder="First Name"
					/>
					<Form.Input
						name="lastName"
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						label="Last Name"
						placeholder="Last Name"
					/>
					<Form.Select
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						required
						search
						clearable
						closeOnBlur
						openOnFocus
						options={selection.genders}
						name="gender"
						label="Gender"
						placeholder="Gender"
						search
					/>
				</Form.Group>
				<Form.Group widths="equal">
					<Form.Input
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						name="dateOfJoining"
						type="date"
						label="Date of Joining"
					/>
					<Form.Input
						required
						type="date"
						name="dateOfBirth"
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						label="Date of Birth"
					/>
					<Form.Input
						required
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						name="contactNumber"
						label="Contact Number"
						placeholder="+91-XXX-XXX-XXXX"
					/>
				</Form.Group>
				<Form.Group>
					<Form.Input
						required
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						name="fatherName"
						label="Father's Name"
						placeholder="Father's Name"
					/>
					<Form.Input
						required
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						name="fatherOccupation"
						label="Father's Occupation"
						placeholder="Father's Occupation"
					/>
					<Form.Input
						required
						type="number"
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						name="fatherAnnualIncome"
						label="Parent's Annual Income"
						placeholder="INR/Yr."
					/>
				</Form.Group>
				<Form.Group>
					<Form.Select
						required
						search
						clearable
						closeOnBlur
						name="caste"
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						openOnFocus
						label="Caste"
						options={selection.castes}
						placeholder="Caste"
					/>
					<Form.Select
						required
						search
						clearable
						closeOnBlur
						openOnFocus
						name="religion"
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						label="Religion"
						options={selection.religions}
						placeholder="Religion"
					/>
					<Form.Select
						required
						search
						clearable
						closeOnBlur
						openOnFocus
						name="bloodGroup"
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						label="Blood Group"
						options={selection.bloodGroups}
						placeholder="Blood Type"
					/>
				</Form.Group>
				<Form.Group>
					<Form.Input
						required
						type="email"
						label="Email"
						name="email"
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						placeholder="teacher@rbmi.in"
					/>
					<Form.Input
						required
						type="phone"
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						name="alternativeContact"
						label="Alternative Contact Number"
						placeholder="+91-XXX-XXX-XXXX"
					/>
					<Form.Input
						required
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						name="aadharNumber"
						label="Aadhaar Number"
						placeholder="XXXX-XXXX-XXXX"
					/>
				</Form.Group>
				<label>
					<b>Current Address*</b>
				</label>
				<Form.Group widths="equal">
					<Form.Input
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						name="addressCurrentLocality"
						width="1"
						required
						placeholder="Locality"
					/>
					<Form.Input
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						name="addressCurrentDistrict"
						width="1"
						required
						placeholder="District"
					/>
					<Form.Input
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						name="addressCurrentCity"
						width="1"
						required
						placeholder="City"
					/>
				</Form.Group>
				<label>
					<b>Permanent Address*</b>
				</label>
				<Form.Group widths="equal">
					<Form.Input
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						name="addressPermanentLocality"
						width="1"
						required
						placeholder="Locality"
					/>
					<Form.Input
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						name="addressPermanentDistrict"
						width="1"
						required
						placeholder="District"
					/>
					<Form.Input
						onChange={(_, { name, value }) =>
							setVariables({ ...variables, [name]: value })
						}
						name="addressPermanentCity"
						width="1"
						required
						placeholder="City"
					/>
				</Form.Group>
				<Button color="orange" fluid disabled={Object.keys(error).length > 0}>
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
	);
};

export default TeacherProfile;
