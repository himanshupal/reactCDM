import gql from "graphql-tag";

export default gql`
	mutation addSubject(
		$name: String
		$subjectCode: String
		$uniSubjectCode: String
		$teacher: String
		$class: String
		$from: String
		$to: String
	) {
		addSubject(
			data: {
				name: $name
				subjectCode: $subjectCode
				uniSubjectCode: $uniSubjectCode
				teacher: $teacher
				class: $class
				from: $from
				to: $to
			}
		)
	}
`;
