import gql from "graphql-tag"

export default gql`
	query subjects($className: String) {
		subjects(className: $className) {
			_id
			name
			teacher {
				_id
				name {
					first
					last
				}
			}
		}
	}
`
