import gql from "graphql-tag"

export default gql`
	query coursesAndTeachers($department: ID) {
		courses(department: $department) {
			_id
			name
			duration
			identifier
			semesterBased
			createdAt
		}
		teachers(department: $department) {
			_id
			name {
				first
				last
			}
		}
	}
`
