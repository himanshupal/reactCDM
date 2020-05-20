import React from "react";
import { Form, Input, TextArea, Button, Select } from "semantic-ui-react";
const genderOptions = [
	{ key: "m", text: "Male", value: "male" },
	{ key: "f", text: "Female", value: "female" },
	{ key: "o", text: "Other", value: "other" },
];

const Teacherprofile = () => (
	<Form>
		<Form.Group widths="equal">
			<Form.Field
				id="form-input-control-first-name"
				control={Input}
				label="First name"
				placeholder="First name"
			/>
			<Form.Field
				id="form-input-control-last-name"
				control={Input}
				label="Last name"
				placeholder="Last name"
			/>
		</Form.Group>
		<Form.Group widths="equal">
			<Form.Field
				id="form-input-control-dob"
				control={Input}
				label="Date of birth"
				placeholder="dd/mm/yy"
			/>
			<Form.Field
				control={Select}
				options={genderOptions}
				label={{ children: "Gender", htmlFor: "form-select-control-gender" }}
				placeholder="Gender"
				search
				searchInput={{ id: "form-select-control-gender" }}
			/>
		</Form.Group>
		<Form.Group widths="equal">
			<Form.Field
				id="form-input-control-father-name"
				control={Input}
				label="Father name"
				placeholder="Father name"
			/>
			<Form.Field
				id="form-input-control-mother-name"
				control={Input}
				label="Mother name"
				placeholder="mother name"
			/>
		</Form.Group>

		<Form.Field
			id="form-input-control-error-email"
			control={Input}
			label="Email"
			placeholder="joe@schmoe.com"
			// error={{
			//   content: 'Please enter a valid email address',
			//   pointing: 'below',
			// }}
		/>
		<Form.Field
			id="form-textarea-control-opinion"
			control={TextArea}
			label="Address"
			placeholder="Address"
		/>
		<Form.Field
			id="form-input-control-adhaar"
			control={Input}
			label="Adhaar Number"
			placeholder="0000 0000 0000"
		/>
		<Form.Field
			id="form-button-control-public"
			control={Button}
			content="Confirm"
			label="Submit "
		/>
	</Form>
);

export default Teacherprofile;
