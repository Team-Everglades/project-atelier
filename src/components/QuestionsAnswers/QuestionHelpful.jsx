import React, { useState } from 'react';
import axios from 'axios';

const QuestionHelpful = ({ questions, questionId, setQuestions, questionHelpfulness }) => {
  const [helpfulClicks, setHelpfulClicks] = useState([]);

  const handleHelpfulClick = () => {
    if (!helpfulClicks.includes(questionId)) {
      axios.put(`api/qa/questions/${questionId}/helpful`, { params: { questionId } })
        .then(() => {
          const updatedQuestions = questions.map((question) => {
            if (question.question_id === questionId) {
              return { ...question, question_helpfulness: question.question_helpfulness + 1 };
            }
            return question;
          });
          setHelpfulClicks([...helpfulClicks, questionId]);
          setQuestions(updatedQuestions);
        })
        .catch((err) => {
          console.log('Error on handleHelpfulClick: ', err);
        });
    }
  };

  return (
    <span>
      Helpful?
      <span
        style={{
          textDecoration: 'underline',
          cursor: 'pointer',
          pointerEvents: helpfulClicks.includes(questionId) ? 'none' : 'auto',
        }}
        onClick={handleHelpfulClick}
      >
        Yes ({questionHelpfulness})
      </span>
    </span>
  );
};

export default QuestionHelpful;