import React from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import styles from './Chart.module.css';

const api = 'https://covid19.mathdro.id/api';

const fetchDailyDataReducer = (state, action) => {
    switch(action.type) {
        case 'DAILY_DATA_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case 'DAILY_DATA_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload
            }
        case 'DAILY_DATA_FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true
            }
        default:
            throw new Error();
    }
  }

const Chart = ({ data: { confirmed, recovered, deaths }, country}) => {

    const [covidDailyData, dispatchCovidDailyData] = React.useReducer(
        fetchDailyDataReducer,
        { data: [], isLoading: false, isError: false }
    )

    const handleFetchCovidDailyData = React.useCallback(async () => {
        dispatchCovidDailyData({ type: 'DAILY_DATA_FETCH_INIT' });
        let url = `https://api.covidtracking.com/v1/us/daily.json`;
        try {
            const dailyInfo = await axios.get(url);
            const info = dailyInfo.data.map(({ positive, recovered, death, dateChecked: date }) => ({ confirmed: positive, recovered, deaths: death, updatedTime: date }));
            dispatchCovidDailyData({
              type: 'DAILY_DATA_FETCH_SUCCESS',
              payload: info.reverse()
            });
          } catch {
            dispatchCovidDailyData({ type: 'DAILY_DATA_FETCH_FAILURE' });
          }
    },);
    
    React.useEffect(() => {
        handleFetchCovidDailyData();
    }, [])

    const barChart = (
        confirmed ? (
          <Bar
            data={{
              labels: ['Infected', 'Recovered', 'Deaths'],
              datasets: [
                {
                  label: 'People',
                  backgroundColor: ['rgba(0, 0, 255, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(255, 0, 0, 0.5)'],
                  data: [confirmed.value, recovered.value, deaths.value],
                },
              ],
            }}
            options={{
              legend: { display: false },
              title: { display: true, text: `Current state in ${country}` },
            }}
            />
        ) : null
    );

    
      const lineChart = (
        covidDailyData.data ? (
          <Line
            data={{
              labels: covidDailyData.data.map(({ updatedTime }) => new Date(updatedTime).toLocaleDateString()),
              datasets: [{
                data: covidDailyData.data.map((data) => data.confirmed),
                label: 'Infected',
                borderColor: '#3333ff',
                fill: true,
              }, {
                data: covidDailyData.data.map((data) => data.deaths),
                label: 'Deaths',
                borderColor: 'red',
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
                fill: true,
              },  {
                data: covidDailyData.data.map((data) => data.recovered),
                label: 'Recovered',
                borderColor: 'green',
                backgroundColor: 'rgba(0, 255, 0, 0.5)',
                fill: true,
              },
              ],
            }}
          />
        ) : null
      );
    
      return (
        <div className={styles.container}>
          {country ? barChart : lineChart}
        </div>
      );
}

export default Chart;