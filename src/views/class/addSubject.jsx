import React, { useState } from "react";
import { Form, Segment } from "semantic-ui-react";

const teachers = [
	{ key: "amitSaxena", text: "Amit Saxena", value: "amitSaxena:id" },
	{ key: "dhanishTandon", text: "Dhanish Tandon", value: "dhanishTandon:id" },
	{ key: "rajeshVerma", text: "Rajesh Verma", value: "rajeshVerma:id" },
];
const departments = [
	{ key: "IT", text: "IT", value: "IT" },
	{ key: "Technology", text: "Technology", value: "Technology" },
	{ key: "Science", text: "Science", value: "Science" },
];

const AddSubject = () => {
	// const [data, setData] = useState({
	// 	to,
	// 	from,
	// 	name,
	// 	teacher,
	// 	classRef,
	// 	subjectCode,
	// 	uniSubjectCode,
	// });

	return (
		<Segment>
			<Form widths="equal">
				<Form.Group>
					<Form.Input label="Subject Name" />
					<Form.Select
						search
						clearable
						closeOnBlur
						openOnFocus
						options={departments}
						label="Class"
					/>
					<Form.Select
						search
						clearable
						closeOnBlur
						openOnFocus
						options={teachers}
						label="Subject Teacher"
					/>
				</Form.Group>
				<Form.Group>
					<Form.Input label="Subject Code" />
					<Form.Input label="University Subject Code" />
				</Form.Group>
				<Form.Group>
					<Form.Input type="time" label="Time of Start" />
					<Form.Input type="time" label="Time of Ending" />
				</Form.Group>
			</Form>
		</Segment>
	);
};

export default AddSubject;
