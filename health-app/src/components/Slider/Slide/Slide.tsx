import React from "react";
import { Slide as SlideType } from "./Slide";
import { Card, CardContent, Typography } from "@mui/material";
import styles from "./Slide.module.css"
import { useNavigate } from "react-router-dom";

const Slide: React.FC<{slide: SlideType}> = ({ slide }) => {
    const { id, name, description, image, url } = slide;
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(url);
    }

  return (
    <Card key={id} className={styles['card']} onClick={handleClick}>
      <img src={image} alt={name} className={styles['card-img']}></img>
      <CardContent>
        <Typography variant="h5" align="center">{name}</Typography>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export { Slide };
