import gql from "graphql-tag";

export default gql`
	mutation login($username: String!, $password: String!) {
		login(data: { username: $username, password: $password })
	}
`;
