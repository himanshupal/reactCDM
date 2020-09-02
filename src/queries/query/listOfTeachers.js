import gql from "graphql-tag"

export default gql`
	query teachers($department: ID) {
		teachers(department: $department) {
			_id
			name {
				first
				last
			}
		}
	}
`
