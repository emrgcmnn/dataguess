import React, { useState, useEffect } from 'react';
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
  "#FFE4E1", "#FFC0CB", "#FFB6C1", "#FFD700", "#FFFACD","#FFF8DC",
  "#F0E68C", "#98FB98", "#AFEEEE", "#ADD8E6", "#B0E0E6", "#E6E6FA", "#D8BFD8", 
  "#DDA0DD", "#FFDAB9", "#FFE4B5", "#FFEBCD", "#F5DEB3", "#FFDEAD", "#FAFAD2"  
];


const App: React.FC = () => {
  const { loading, error, data } = useQuery(GET_COUNTRIES);
  const [filter, setFilter] = useState<string>('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [manuallySelected, setManuallySelected] = useState(false);

  useEffect(() => {
    if (!loading && data && !manuallySelected) {
      const displayedData = filter ? filteredData : data.countries;
      const lastItem = displayedData.slice(0, 10).pop();
      if (lastItem) {
        setSelectedKey(lastItem.name);
        pickRandomColor();
      }
    }
  }, [loading, data, filter, manuallySelected]);

  const pickRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    setSelectedColor(colors[randomIndex]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setManuallySelected(false);
  };

  let filteredData = [...(data?.countries ?? [])];
  const searchParam = filter.match(/search:(\w+)/)?.[1];
  const groupParam = filter.match(/group:(\w+)/)?.[1];

  if (searchParam) {
    filteredData = filteredData.filter((country) => country.name.toLowerCase().includes(searchParam.toLowerCase()));
  }

  let groupedData: { [key: string]: any[] } = {};
  if (groupParam) {
    filteredData.forEach((country) => {
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
    <div className="App main-container ">
      <input type="text" placeholder="search:xx group:yy" onChange={handleInputChange} />
      <div className='htw'>
        <div className='style-in'>
          <h1> How to work?</h1>
          <h2>
            search:xxx  <br /> "space" <br /> group:code / name / capital / emoji / currency /  native
          </h2>
        </div>
      </div>
      <div className='results-container'>
        <ul >
          {groupParam ? (
            Object.keys(groupedData).slice(0, 10).map((key) => (
              <div 
                key={key}
                className={`title-container  `}
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
                  pickRandomColor();  
                }}
              >
              <h1> {country.name}</h1>
              </li>
            ))
          )}
        </ul>
      </div>
     
    </div>
  );
  
};

export default App