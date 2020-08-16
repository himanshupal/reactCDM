import gql from "graphql-tag"

export default gql`
	query notes($nid: ID) {
		notes(nid: $nid) {
			_id
			subject
			description
			scope
			createdAt
			createdBy
		}
	}
`
