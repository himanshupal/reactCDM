import gql from "graphql-tag"

export default gql`
	query notice($_id: ID!) {
		notice(_id: $_id) {
			_id
			edited
			subject
			description
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
