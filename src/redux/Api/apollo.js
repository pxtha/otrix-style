import { ApolloLink, HttpLink, InMemoryCache } from 'apollo-boost';
import { ApolloClient } from '@apollo/client/core';
import { getToken } from "~/utils/manageLocalStorage";

const API_URI = `${process.env.NEXT_PUBLIC_SERVER_URL}/graphql`;

function createLink() {
    let token;

    const httpLink = new HttpLink({
        uri: API_URI,
        credentials: 'include',
    });

    const authLink = new ApolloLink((operation, forward) => {
        try {
            if (typeof window !== 'undefined') {
                token = getToken();
            }

            operation.setContext(({ headers = {} }) => (token ? {
                headers: {
                    ...headers,
                    authorization: `Bearer ${token}`
                },
            } : {
                headers
            }));

            return forward(operation);
        } catch (error) {
            console.error('Error in authLink:', error);
            throw error;
        }
    });

    return ApolloLink.from([authLink, httpLink]);
}

export const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: createLink()
});

apolloClient
  .query({
    query: gql`
      query GetLocations {
        locations {
          id
          name
          description
          photo
        }
      }
    `,
  })
  .then((result) => console.log(result));
