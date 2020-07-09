import React, { useState } from "react";
import { Form } from "semantic-ui-react";

const teachers = [
	{ key: "amitSaxena", text: "Amit Saxena", value: "amitSaxena:id" },
	{ key: "dhanishTandon", text: "Dhanish Tandon", value: "dhanishTandon:id" },
	{ key: "rajeshVerma", text: "Rajesh Verma", value: "rajeshVerma:id" },
];
const departments = [
	{ key: "IT", text: "IT", value: "IT" },
	{ key: "Engineering", text: "Engineering", value: "Engineering" },
	{ key: "Science", text: "Science", value: "Science" },
	{ key: "Pharmacy", text: "Pharmacy", value: "Pharmacy" },
	{ key: "Education", text: "Education", value: "Education" },
	{ key: "Other", text: "Other", value: "Other" },
];

const AddClass = () => {
	// const [data, setData] = useState({
	// 	year,
	// 	batch,
	// 	semester,
	// 	classs,
	// 	department,
	// 	classTeacher,
	// 	sessionEnd,
	// 	sessionStart,
	// });

	return (
		<Form widths="equal" onSubmit={() => console.log(`Submitted`)}>
			<Form.Group>
				<Form.Input placeholder="eg. BCA" label="Class" />
				<Form.Input type="number" label="Year" />
				<Form.Input type="number" label="Semester" />
				<Form.Input type="number" label="Batch" placeholder="Year" />
			</Form.Group>
			<Form.Group>
				<Form.Select
					search
					clearable
					closeOnBlur
					openOnFocus
					options={departments}
					label="Department"
				/>
				<Form.Select
					search
					clearable
					closeOnBlur
					openOnFocus
					options={teachers}
					label="Class Teacher"
				/>
			</Form.Group>
			<Form.Group>
				<Form.Input type="date" label="Session Start Date" />
				<Form.Input type="date" label="Session End Date" />
			</Form.Group>
			<Form.Button floated="right">Add Class</Form.Button>
		</Form>
	);
};

export default AddClass;
