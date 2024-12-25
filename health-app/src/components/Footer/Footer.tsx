import { Typography } from "@mui/material";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Typography variant="body2" color="textSecondary" align="center" className={styles.footerCopy}>
        © 2024 Yulia Raitsyna. All rights reserved.
      </Typography>
    </footer>
  );
};

export { Footer };
