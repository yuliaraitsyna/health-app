import { Slide } from "./Slide/Slide.tsx";
import { Slide as SlideType} from "./Slide/Slide.ts"
import styles from "./Slider.module.css"

interface SliderProps {
  slides: SlideType[];
}

const Slider: React.FC<SliderProps> = ({ slides }) => {
  return (
    <div className={styles['slider']}>
      {slides.map((slide) => (
        <Slide key={slide.id} slide={slide} />
      ))}
    </div>
  );
};

export { Slider };
