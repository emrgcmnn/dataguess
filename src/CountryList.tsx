import { useQuery, gql } from '@apollo/client';

const GET_COUNTRIES = gql`
  query {
    countries {
      code
      name
    }
  }
`;

export const CountryList = () => {
  const { loading, error, data } = useQuery(GET_COUNTRIES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.countries.map((country: { code: string, name: string }) => (
        <li key={country.code}>
          {country.name}
        </li>
      ))}
    </ul>
  );
};
