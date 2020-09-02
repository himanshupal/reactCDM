import gql from "graphql-tag"

export default gql`
	mutation addDepartment($name: String!, $director: ID) {
		addDepartment(data: { name: $name, director: $director }) {
			_id
			name
			director {
				_id
				username
				name {
					first
					last
				}
			}
			createdBy {
				_id
				username
				name {
					first
					last
				}
			}
			createdAt
			updatedBy {
				_id
				username
				name {
					first
					last
				}
			}
			updatedAt
		}
	}
`
