import { scroll } from "../scroll.js";
import "../elements/answer-element.js";
export function AnswerSection() {
  requestAnimationFrame(() => {
    scroll();
  });
}
