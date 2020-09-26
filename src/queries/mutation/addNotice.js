import gql from "graphql-tag"

export default gql`
	mutation addNotice($scope: String, $subject: String, $validFor: String, $description: String) {
		addNotice(
			data: { scope: $scope, subject: $subject, validFor: $validFor, description: $description }
		) {
			_id
			scope
			subject
			validFor
			createdAt
		}
	}
`
