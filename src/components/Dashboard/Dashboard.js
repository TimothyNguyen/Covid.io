import React from 'react';
import styles from './Dashboard.module.css';
import Chart from '../Chart/Chart.js';
import Country from '../Country/CountryComp.js';
import Cards from '../Cards/Cards.js';
import axios from 'axios';
import image from '../../images/COVID.IO.png';
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

function Dashboard() {
  const [country, setCountry] = React.useState('US');
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
        <img className={styles.image} src={image} alt="COVID-19" />
        <Chart data={covidData.data} country={country} />
        <Cards data={covidData.data} />
        <Country handleCountryChange={handleCountryChange} />
    </div>
  );
}

export default Dashboard;
