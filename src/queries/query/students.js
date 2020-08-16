import gql from "graphql-tag"

export default gql`
	query students($cid: ID) {
		students(cid: $cid) {
			_id
			username
			rollNumber
			name {
				first
				last
			}
			class {
				_id
			}
			email
			contactNumber
		}
	}
`
