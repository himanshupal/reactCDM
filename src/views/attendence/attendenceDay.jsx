import React, { useState } from "react";
// import { useQuery } from "@apollo/react-hooks";

const students = ["Himanshu", "Arshad", "Ranvir", "Shivam", "Chetan"];

const SingleStudent = ({ names }) => {
	return names.map((name) => (
		<label class="contract_toggle">
			{name}
			<input type="checkbox" />
			<div class="toggle_bar">
				<div class="toggle_square" />
			</div>
		</label>
	));
};

const AttendenceDay = (props) => {
	const [count, setCount] = useState(0);
	return (
		<div class="container">
			<div class="control-group">
				<h1>Students</h1>
				<h2>Total students : 23 </h2>
				<h2> Total present : 0/23</h2>
				<SingleStudent names={students} />

				<div class="btn">
					<div class="btn-back">
						<p>Are you sure you want to submit the attendence?</p>
						<button class="yes">Yes</button>
						<button class="no">No</button>
					</div>
					<div class="btn-front">Submit</div>
				</div>
			</div>
		</div>
	);
};
export default AttendenceDay;
