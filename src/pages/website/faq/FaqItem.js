import { useState } from "react";
import faqplus from "../../../assets/images/icons/plus.png";
import faqminus from "../../../assets/images/icons/minus.png";

const FaqItem = ({ faq }) => {
  const { question, answer, id } = faq;
  const [showAnswer, setShowAnswer] = useState(false);
 
  return (
    <div className="faq_item">
      <div
        onClick={() => setShowAnswer(!showAnswer)}
        className="dynamic_faq_icon"
      >
        {showAnswer ? (
          <img onClick={() => setShowAnswer(!showAnswer)} src={faqminus} />
        ) : (
          <img onClick={() => setShowAnswer(!showAnswer)} src={faqplus} />
        )}
      </div>
      <div className="faq_question_answers">
        <h3 onClick={() => setShowAnswer(!showAnswer)}>{question}</h3>
        {showAnswer && id && <p>{answer}</p>}
      </div>
    </div>
  );
};

export default FaqItem;
