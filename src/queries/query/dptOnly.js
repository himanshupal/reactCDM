import gql from "graphql-tag"

export default gql`
	{
		departments {
			departments {
				_id
				name
			}
		}
	}
`
