import gql from "graphql-tag";

export default gql`
	mutation addClass(
		$sessionStart: String
		$sessionEnd: String
		$class: String
		$year: String
		$semester: String
		$batch: String
		$department: String
		$classTeacher: String
	) {
		addClass(
			data: {
				sessionStart: $sessionStart
				sessionEnd: $sessionEnd
				class: $class
				year: $year
				semester: $semester
				batch: $batch
				department: $department
				classTeacher: $classTeacher
			}
		)
	}
`;
