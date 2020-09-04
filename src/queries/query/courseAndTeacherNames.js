import gql from "graphql-tag"

export default gql`
	query courseAndTeacherNames($department: ID) {
		courses(department: $department) {
			_id
			name
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
