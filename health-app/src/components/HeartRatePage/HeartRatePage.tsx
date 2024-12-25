import { useEffect, useState } from "react";
import { Typography, CircularProgress } from "@mui/material";
import { HRChart } from "./HRChart/HRChart";
import { HeartData } from "../HeartData/HeartData";

const HeartRatePage = () => {
  const [heartData, setHeartData] = useState<HeartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchHeartData();
  }, []);

  const fetchHeartData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/heart_rate");
      if (!response.ok) {
        throw new Error("Failed to fetch heart data");
      }
      const data = await response.json();

      if (data && Array.isArray(data.heart_data)) {
        setHeartData(data.heart_data);
      } else {
        console.error("Heart data is not in the expected format");
      }

    } catch (error) {
      console.error("Error fetching heart data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h3">Heart rate data</Typography>
      {loading ? <CircularProgress /> : <HRChart data={heartData} />}
    </>
  );
};

export { HeartRatePage };
