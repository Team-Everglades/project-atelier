import axios from 'axios';
import React, { useState, useEffect } from 'react';
import format from 'date-fns/format';
import ReportButton from './ReportButton';
import AnswerHelpful from './AnswerHelpful';
import AnswersPhotos from './AnswersPhotos';
import AddAnswerButton from './AddAnswerButton';
import QuestionHelpful from './QuestionHelpful';

const AnswersList = ({questionId, questionBody, productName, questions, setQuestions, questionHelpfulness}) => {
  const [answers, setAnswers] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    getAnswers(questionId);
  }, [questionId]);

  const getAnswers = (questionId) => {
  axios.get(`/api/qa/questions/${questionId}/answers`, { params: { questionId } })
    .then((response) => {
      const sortedAnswers = response.data.results.sort((a, b) => b.helpfulness - a.helpfulness);
      setAnswers(sortedAnswers);
    })
    .catch((err) => {
      console.log('Error on getAnswers: ', err);
    });
};

  return (
    <span style={{backgroundColor:'#FFFFFF'}}>
      <span style={{display:'flex', justifyContent:'space-between'}}>
        <span style={{justifyContent:'flex-start'}}>
          <b style={{fontSize:'20px',}}> Q: {questionBody}</b>
        </span>
        <span style={{justifyContent:'flex-end'}}>
          <QuestionHelpful questionId={questionId} questions={questions} setQuestions={setQuestions} questionHelpfulness={questionHelpfulness}/>
          {' '} | {' '}
          <AddAnswerButton getAnswers={getAnswers} questionId={questionId} questionBody={questionBody} productName={productName}/>
        </span>
      </span>
      <div>
        {answers.length === 0 ? (
          <div style={{ marginTop: '20px', marginBottom: '20px'}}>
            <b>A:</b>
            <i> No answer yet...</i>
          </div>
        ) : (
          <div className='answer-list' style={{marginTop: '20px', marginBottom: '10px',}}>
            {answers.slice(0, showMore ? answers.length : 2).map((answer) => (
              <div key={answer.answer_id} style={{ marginBottom: '20px', fontSize: '16px'}}>
                <b>A:</b> {answer.body}
                <div style={{marginTop: '10px', fontSize: '12px'}}>
                  by {answer.answerer_name === 'Seller' ? <b>{answer.answerer_name}</b> : answer.answerer_name}, on {answer.date} | Helpful?{' '}
                  <AnswerHelpful answers={answers} setAnswers={setAnswers} answerId={answer.answer_id}/> | <ReportButton answerId={answer.answer_id} />
                {/* <AnswersPhotos photos={answer.photo_urls}/> */}
                </div>
              </div>
            ))}
            {answers.length > 2 && (
              <button onClick={()=>setShowMore(!showMore)} style={{marginTop: '10px', background:'none', borderRadius: '10px', border: '1px solid #ccc'}}>{showMore ? 'COLLAPSE ANSWERS' : 'LOAD MORE ANSWERS'}</button>
            )}
          </div>
        )}
      </div>
    </span>
  );
};

export default AnswersList;