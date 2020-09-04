import gql from "graphql-tag"

export default gql`
	query coursesAndTeachers($department: ID) {
		courses(department: $department) {
			_id
			name
		}
	}
`
