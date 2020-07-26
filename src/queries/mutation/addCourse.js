import gql from "graphql-tag";

export default gql`
	mutation addCourse(
		$name: String
		$identifier: String
		$duration: String
		$semesterBased: Boolean
		$director: String
		$department: String
		$headOfDepartment: String
	) {
		addCourse(
			data: {
				name: $name
				identifier: $identifier
				duration: $duration
				semesterBased: $semesterBased
				director: $director
				department: $department
				headOfDepartment: $headOfDepartment
			}
		)
	}
`;
