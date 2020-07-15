import gql from "graphql-tag";

export default gql`
	mutation addCourse(
		$name: String
		$duration: String
		$semesterBased: Boolean
		$director: String
		$department: String
		$headOfDepartment: String
	) {
		addCourse(
			data: {
				name: $name
				duration: $duration
				semesterBased: $semesterBased
				director: $director
				department: $department
				headOfDepartment: $headOfDepartment
			}
		)
	}
`;
