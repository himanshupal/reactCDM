import gql from "graphql-tag";

export default gql`
	{
		departments {
			departments {
				_id
				name
				courses {
					_id
					name
					duration
					identifier
					semesterBased
				}
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
