import gql from "graphql-tag"

export default gql`
	{
		departments {
			departments {
				_id
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
`
