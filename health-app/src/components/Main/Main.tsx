import { Typography } from "@mui/material";
import { Slider } from "../Slider/Slider";
import { slides } from "../Slider/mock/mock";
import styles from "./Main.module.css";

const Main = () => {
    return (
        <body className={styles.main}>
            <Typography variant="h4" align="center" marginTop={"100px"}>Welcome to health application!</Typography>
            <Typography variant="body1" align="center">This app provides information about your health charecteristics and analyses the data provided.</Typography>
            <Slider slides={slides}></Slider>
        </body>
    );
}

export { Main }