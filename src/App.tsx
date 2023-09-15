import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import './App.css';

const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      code
      name
      capital
      emoji
      currency
      native
    }
  }
`;
const colors = [
  "#FF0000", "#00FF00", "#0000FF", 
  "#FFFF00", "#FF00FF", "#00FFFF",
  "#C0C0C0", "#808080", "#800000",
  "#808000", "#008000", "#008080",
  "#000080", "#800080", "#FFA500"
];


const App: React.FC = () => {
  const { loading, error, data } = useQuery(GET_COUNTRIES);
  const [filter, setFilter] = useState<string>('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null); 

  const [selectedColor, setSelectedColor] = useState<string>("");
  const pickRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    setSelectedColor(colors[randomIndex]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  let filteredData = [...(data?.countries ?? [])];

  const searchParam = filter.match(/search:(\w+)/)?.[1];
  const groupParam = filter.match(/group:(\w+)/)?.[1];

  if (searchParam) {
    filteredData = filteredData.filter((country: any) =>
      country.name.toLowerCase().includes(searchParam.toLowerCase())
    );
  }

  let groupedData: { [key: string]: any[] } = {};

  if (groupParam) {
    filteredData.forEach((country: any) => {
      const key = country[groupParam];
      if (!key) return;

      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(country);
    });
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  

 
  return (
    <div className="App">
      <input type="text" placeholder="search:xx group:yy" onChange={handleInputChange} />
      <h1>Countries</h1>
      <ul >
        {groupParam ? (
          Object.keys(groupedData).slice(0, 10).map((key) => (
            <div 
              key={key}
              className={`title-container `}
              style={{ 
                backgroundColor: selectedKey === key ? selectedColor : 'transparent'
              }}
              onClick={() => {setSelectedKey(key);
                pickRandomColor(); 
              }
            }
            >
              <h1>
                {groupedData[key].map((country: any, index: number) => (
                  <span key={country.code}>
                    {country.name}
                    {index !== groupedData[key].length - 1 ? ", " : ""}
                  </span>
                ))}
              </h1>
              <span className="colon">:</span>
              <h2>{key}</h2>
            </div>
          ))
        ) : (
          filteredData.slice(0, 10).map((country: any) => (
            <li 
              key={country.code}
              style={{ 
                backgroundColor: selectedKey === country.name ? selectedColor : 'transparent'
              }}
              onClick={() => { 
                setSelectedKey(country.name); 
                pickRandomColor();  // Rastgele bir renk seç
              }}
            >
             <h1> {country.name}</h1>
            </li>
          ))
        )}
      </ul>
    </div>
  );
  
};



export default App;
