import React from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import { Grid } from '@material-ui/core';
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
                title: { 
                  display: true, 
                  text: `Current state in ${country}`,
                  fontSize: 24, 
                },
              }}
              />
        ) : null
    );
              
    const confirmedChart = (
        covidDailyData.data ? (
          <Line
            data={{
              labels: covidDailyData.data.map(({ updatedTime }) => new Date(updatedTime).toLocaleDateString()),
              datasets: [{
                data: covidDailyData.data.map((data) => data.confirmed),
                label: 'Infected',
                defaultFontSize: 24,
                borderColor: '#3333ff',
                fill: true,
              },
            ],
            }}
            options={{
              legend: { display: true },
              title: { 
                display: true, 
                text: `Confirmed Cases Worldwide: ${covidDailyData.data.length === 0 ? '' : covidDailyData.data[covidDailyData.data.length-1].confirmed}`,
                fontSize: 24, 
              },
            }}
          />
        ) : null
    );

    const deathChart = (
      covidDailyData.data ? (
        <Line
          data={{
            labels: covidDailyData.data.map(({ updatedTime }) => new Date(updatedTime).toLocaleDateString()),
            datasets: [{
              data: covidDailyData.data.map((data) => data.deaths),
              label: 'Deaths',
              borderColor: 'red',
              backgroundColor: 'rgba(255, 0, 0, 0.5)',
              fill: true,
            },
            ],
          }}
          options={{
            legend: { display: true },
            title: { 
              display: true, 
              text: `Number of Deaths Worldwide: ${covidDailyData.data.length === 0 ? '' : covidDailyData.data[covidDailyData.data.length-1].deaths}`,
              fontSize: 24, 
            },
          }}
        />
      ) : null
  );

  const recoveredChart = (
    covidDailyData.data ? (
      <Line
        data={{
          labels: covidDailyData.data.map(({ updatedTime }) => new Date(updatedTime).toLocaleDateString()),
          datasets: [{
            data: covidDailyData.data.map((data) => data.recovered),
            label: 'Recovered',
            borderColor: 'green',
            backgroundColor: 'rgba(0, 255, 0, 0.5)',
            fill: true,
          },
          ],
        }}
        options={{
          legend: { display: true },
          title: { 
            display: true, 
            text: `Recovered Cases: ${covidDailyData.data.length === 0 ? '' : covidDailyData.data[covidDailyData.data.length-1].recovered}`,
            fontSize: 24, 
          },
        }}
      />
    ) : null
);


    
      return (
        <div className={styles.container}>
            <Grid container spacing={3}  justify="center">
              <Grid container item xs={12} spacing={3}>
                {confirmedChart}
              </Grid>
              <Grid container item xs={12} spacing={3}>
                {deathChart}
              </Grid>
              <Grid container item xs={12} spacing={3}>
                {recoveredChart}
              </Grid>
              <Grid container item xs={12} spacing={3}>
                {barChart}
              </Grid>
            </Grid>
        </div>
      );
}

export default Chart;