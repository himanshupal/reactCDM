import gql from "graphql-tag"

export default gql`
	query subjects($class: String!) {
		subjects(class: $class) {
			_id
			name
			language
			subjectCode
			uniSubjectCode
			teacher {
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
