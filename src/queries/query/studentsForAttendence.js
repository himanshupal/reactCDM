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
			dateOfBirth
		}
	}
`
