import gql from "graphql-tag"

export default gql`
	query departments {
		departments {
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
