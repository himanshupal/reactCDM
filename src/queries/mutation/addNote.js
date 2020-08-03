import gql from "graphql-tag";

export default gql`
	mutation addNote($subject: String!, $description: String, $scope: String) {
		addNote(data: { subject: $subject, description: $description, scope: $scope })
	}
`;
