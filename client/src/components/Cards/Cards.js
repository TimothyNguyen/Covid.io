import React from 'react';
import CardComp from './Card/Card';
import styles from './Cards.module.css';
import { Grid } from '@material-ui/core';


const Cards = ({ data: {confirmed, recovered, deaths, updatedTime} }) => {
    if (!confirmed) {
        return 'Loading...';
    }
    return (
        <div className={styles.container}>
            <Grid container spacing={3} justify="center">
                <CardComp
                    cardTitle="Infected"
                    number={confirmed.value}
                    timeUpdated={updatedTime} 
                    description="Confirmed Cases of Covid-19"
                />
                <CardComp
                    cardTitle="Recovered"
                    number={recovered.value}
                    timeUpdated={updatedTime} 
                    description="Recovered Cases of Covid-19"
                />
                <CardComp
                    cardTitle="Deaths"
                    number={deaths.value}
                    timeUpdated={updatedTime} 
                    description="Number of Deaths Resulted by Covid-19"
                />
            </Grid>
        </div>
    )
}

export default Cards;