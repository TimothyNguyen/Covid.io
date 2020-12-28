import React from 'react';
import styles from './App.module.css';
import { Cards, Chart, Country } from './components';
import axios from 'axios';
const api = 'https://covid19.mathdro.id/api';

const fetchDataReducer = (state, action) => {
  switch(action.type) {
      case 'DATA_FETCH_INIT':
          return {
              ...state,
              isLoading: true,
              isError: false,
          };
      case 'DATA_FETCH_SUCCESS':
          return {
              ...state,
              isLoading: false,
              isError: false,
              data: action.payload
          }
      case 'DATA_FETCH_FAILURE':
          return {
              ...state,
              isLoading: false,
              isError: true
          }
      default:
          throw new Error();
  }
}

function App() {
  const [country, setCountry] = React.useState('');
  const [covidData, dispatchCovidData] = React.useReducer(
    fetchDataReducer,
    { data: [], isLoading: false, isError: false }
  )

  const handleFetchCovidData = React.useCallback(async () => {
    dispatchCovidData({ type: 'DATA_FETCH_INIT' });
    let url = api;

    if(country) url = `${url}/countries/${country}`;
    try {
        const { data: { confirmed, recovered, deaths, lastUpdate }}  = await axios.get(url);
        // console.log(confirmed);
        dispatchCovidData({
          type: 'DATA_FETCH_SUCCESS',
          payload: {
            confirmed,
            recovered,
            deaths,
            updatedTime: lastUpdate
          }
        });
        if(country) setCountry(country);
      } catch {
        dispatchCovidData({ type: 'DATA_FETCH_FAILURE' });
      }
  }, [country]);

  React.useEffect(() => {
    handleFetchCovidData();
  }, [handleFetchCovidData])

  const handleCountryChange = async(country) => {
    dispatchCovidData({ type: 'DATA_FETCH_INIT' });
    let url = `${api}/countries/${country}`;
    try {
        const { data: { confirmed, recovered, deaths, lastUpdate }}  = await axios.get(url);
        // console.log(confirmed);
        dispatchCovidData({
          type: 'DATA_FETCH_SUCCESS',
          payload: {
            confirmed,
            recovered,
            deaths,
            updatedTime: lastUpdate
          }
        });
        if(country) setCountry(country);
    } catch {
      dispatchCovidData({ type: 'DATA_FETCH_FAILURE' });
    }
  }

  return (
    <div className={styles.container}>
        <Country handleCountryChange={handleCountryChange} />
        <Chart data={covidData.data} country={country} />
        <Cards data={covidData.data} />
    </div>
  );
}

export default App;
