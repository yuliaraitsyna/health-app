import { Link } from "react-router-dom"
import styles from "./Header.module.css"
import { Typography } from "@mui/material"
import icon from "/heart.png"

const Header = () => {
    return (
        <header className={styles['header']}>
            <img src={icon} className={styles['icon']}></img>
            <Typography variant="h4">Health App</Typography>
            <ul className={styles['links']}>
                <li>
                    <Link to={"/heart_rate"} className={styles['link']}>
                        <Typography variant="body1" color="primary">
                            Heart Rate
                        </Typography>
                    </Link>
                </li>
                <li>
                    <Link to={"/sleep"} className={styles['link']}>
                        <Typography variant="body1" color="primary">
                            Sleep
                        </Typography>
                    </Link>
                </li>
                <li>
                    <Link to={"/about"} className={styles['link']}>
                        <Typography variant="body1" color="primary">
                            About
                        </Typography>
                    </Link>
                </li>
            </ul>
        </header>
    )
}

export { Header }