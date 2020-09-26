import gql from "graphql-tag"

export default gql`
	query students($class: ID) {
		students(class: $class) {
			_id
			username
			rollNumber
			name {
				first
				last
			}
			father {
				name
				contactNumber
			}
			email
			contactNumber
			dateOfBirth
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
