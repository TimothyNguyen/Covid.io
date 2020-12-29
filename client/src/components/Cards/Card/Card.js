import React from 'react';
import { Card, Grid, CardContent, Typography } from '@material-ui/core';
import styles from './Card.module.css';
import cx from 'classnames';

const CardComp = ({ className, cardTitle, number, timeUpdated, description }) => (
    <Grid item xs={12} md={3} component={Card} className={cx(styles.card, className)}>
        <Card className = {styles.title}>
            <CardContent>
                <Typography className={styles.title}>
                    {cardTitle}
                </Typography>
                <Typography className={styles.title}>
                    {number}
                </Typography>
                <Typography className={styles.title}>
                    {timeUpdated}
                </Typography>
                <Typography className={styles.title}>
                    {description}
                </Typography>
            </CardContent>
        </Card>
    </Grid>
);

export default CardComp;