import gql from "graphql-tag";

export default gql`
	{
		departments {
			departments {
				name
			}
			teachers {
				_id
				name {
					first
					last
				}
			}
		}
	}
`;
