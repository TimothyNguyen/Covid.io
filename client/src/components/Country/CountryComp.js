import React from 'react';
import styles from './CountryComp.module.css';
import axios from 'axios';
import { FormControl, NativeSelect } from '@material-ui/core';
const api = 'https://covid19.mathdro.id/api';

const fetchCountriesReducer = (state, action) => {
    switch(action.type) {
        case 'COUNTRIES_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case 'COUNTRIES_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload
            }
        case 'COUNTRIES_FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true
            }
        default:
            throw new Error();
    }
  }

const CountryComp = ( { handleCountryChange } ) => {
    const [countries, dispatchCountries] = React.useReducer(
        fetchCountriesReducer,
        { data: [], isLoading: false, isError: false }
      )
    
    const handleFetchCountryData = React.useCallback(async () => {
        dispatchCountries({ type: 'COUNTRIES_FETCH_INIT' });
        let url = `${api}/countries/`;
        try {
            const { data: { countries }}  = await axios.get(url);
            const data = countries.map((country) => country.name);
            dispatchCountries({
              type: 'COUNTRIES_FETCH_SUCCESS',
              payload: data
            });
          } catch {
            dispatchCountries({ type: 'COUNTRIES_FETCH_FAILURE' });
          }
    }, []);

    React.useEffect(() => {
        handleFetchCountryData();
    }, [handleFetchCountryData])

    return (
        <div>
            <FormControl className={styles.formControl}>
                <NativeSelect 
                    defaultValue="" 
                    onChange={(event) => handleCountryChange(event.target.value)}>
                    {countries.data.map((country, i) => <option key={i} value={country}>{country}</option>)}
                </NativeSelect>
            </FormControl>
        </div>
    )
}

export default CountryComp;