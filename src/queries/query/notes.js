import gql from "graphql-tag"

export default gql`
	query notes($page: Int!) {
		notes(page: $page) {
			_id
			scope
			edited
			subject
			validFor
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
