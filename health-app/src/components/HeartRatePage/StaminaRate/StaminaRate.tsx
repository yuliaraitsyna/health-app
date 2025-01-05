import { Typography } from "@mui/material"
import Card from "@mui/material/Card"
import styles from './StaminaRate.module.css'
import { useLayoutEffect, useState } from "react"

interface StaminaRateProps {
    value: number | undefined,
    state: string | undefined
}

const StaminaRate: React.FC<StaminaRateProps> = ({value, state}) => {
    const [stateClassName, setStateClassName] = useState('');

    useLayoutEffect(() => {
        console.log(styles)
        const dynamicClassName = styles[`stamina-${state}`] || '';
        setStateClassName(dynamicClassName);
    }, [state]);

    return (
        <Card variant="outlined" className={styles['stamina-card']}>
            <Typography variant="h5" align="center">
                Your physical stamina state: 
                <span className={stateClassName}>{state}</span>
            </Typography>
            <div>
                <Typography variant="h3">{value}</Typography>
            </div>
        </Card>
    )
}

export { StaminaRate }