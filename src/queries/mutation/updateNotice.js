import gql from "graphql-tag"

export default gql`
	mutation updateNotice(
		$_id: ID!
		$scope: String
		$subject: String
		$validFor: String
		$description: String
	) {
		updateNotice(
			_id: $_id
			data: { scope: $scope, subject: $subject, validFor: $validFor, description: $description }
		) {
			_id
			scope
			validFor
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
