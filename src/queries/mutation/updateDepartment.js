import gql from "graphql-tag"

export default gql`
	mutation updateDepartment($_id: ID!, $name: String, $director: ID) {
		updateDepartment(_id: $_id, data: { name: $name, director: $director }) {
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
