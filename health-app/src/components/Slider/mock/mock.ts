import { Slide } from "../Slide/Slide";
import heartRateImage from "/heart-rate.png";
import sleepImage from "/sleep.png";
import aboutImage from "/about.png";

const slides: Slide[] = [];

slides.push(new Slide(1, "Heart rate", "Find out information about your heart rate and open new features of your health", heartRateImage, '/heart_rate'));
slides.push(new Slide(2, "Sleep", "Gain information about your sleeping and have some recommendations", sleepImage, '/sleep'));
slides.push(new Slide(3, "About", "Find out more information about the app", aboutImage, '/about'));

export { slides };