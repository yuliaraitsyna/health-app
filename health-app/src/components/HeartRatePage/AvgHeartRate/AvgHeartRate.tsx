import { Card, Typography } from "@mui/material"
import styles from './AvgHeartRate.module.css'
import heartImage from '/public/heart.png'

interface AvgHeartRateProps {
    heartRate: number
}
const AvgHeartRate: React.FC<AvgHeartRateProps> = ({ heartRate }) => {
    return (
        <Card variant="outlined" className={styles['avg-hr-card']}>
            <Typography variant="h5">Your average heart rate</Typography>
            <div>
                <img src={heartImage}/>
                <Typography variant="h3">{heartRate}</Typography>
            </div>
        </Card>
    )
}

export { AvgHeartRate }