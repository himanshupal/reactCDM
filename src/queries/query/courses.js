import gql from "graphql-tag"

export default gql`
	query coursesWithTeachers($department: ID) {
		courses(department: $department) {
			_id
			name
			duration
			identifier
			semesterBased
			headOfDepartment {
				_id
				username
				name {
					first
					last
				}
			}
			createdAt
			createdBy {
				_id
				username
				name {
					first
					last
				}
			}
			updatedAt
			updatedBy {
				_id
				username
				name {
					first
					last
				}
			}
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
