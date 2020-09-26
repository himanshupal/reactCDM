import gql from "graphql-tag"

export default gql`
	query teachers($department: ID) {
		teachers(department: $department) {
			_id
			username
			designation
			name {
				first
				last
			}
			email
			dateOfBirth
			contactNumber
			classTeacherOf {
				_id
				name
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
	}
`
