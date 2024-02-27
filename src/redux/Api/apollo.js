import { APP_URL_ENV } from "@env"
import { ApolloClient, InMemoryCache } from '@apollo/client';

const API_URL = APP_URL_ENV + "/graphql"

export const apolloClient = new ApolloClient({
    uri: API_URL,
    cache: new InMemoryCache()
});
