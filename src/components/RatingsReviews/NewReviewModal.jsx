import React, { useState, useEffect } from 'react'
import CharacteristicReview from './CharacteristicReview.jsx'
import StarsRater from './StarsRater.jsx'
import PhotoUploader from './PhotoUploader.jsx'
import { getMeta, getProduct, sendReview } from './reviewsapi'
import axios from 'axios'


export default function NewReviewModal({ id, photo, setPhoto, form, setForm, setDelButton }) {

  const [productName, setProductName] = useState('')
  const [reviewMeta, setReviewMeta] = useState({})
  const [charsFilled, setCharsFilled] = useState(false)
  const [reqRemaining, setReqRemaining] = useState('Minimum required characters left: 50')
  const [showButton, setShowButton] = useState(true)
  const [badSubmission, setBadSubmission] = useState({})



  useEffect(() => {

    getMeta(id)
    .then(res => setReviewMeta(res.data))
    .catch(err => console.log(err));

    getProduct(id)
    .then(res => setProductName(res.data.name))
    .catch(err => console.log(err));

  }, [id])

  const handleSubmit = (evt) => {
    if (form.stars !== "0" &&
    form.recommended !== null &&
    charsFilled &&
    reqRemaining === 'Minimum reached' &&
    nickname &&
    email.indexOf('@' > 0)){
      setBadSubmission({});
      handleExit()
      let payload = {
        product_id: parseInt(id),
        rating: parseInt(form.stars),
        summary: form.reviewSummary,
        body: form.reviewBody,
        recommend: form.recommended,
        name: form.nickname,
        email: form.email,
        photos: form.photos,
        characteristics: form.charRatings
      }
      sendReview(payload)
      .then(res => {
        console.log(res.data)
        setSort('relevant')
      })
      .catch(err => console.log(err.data))
    } else {
      handleIncompleteForm()
    }
  }

  const handleIncompleteForm = (evt) => {
    const stillRequired = {}
    if (form.stars === '0'){
      stillRequired.stars = true
    }
    if (form.recommended === undefined) {
      stillRequired.recommended = true
    }
    if (!charsFilled) {
      stillRequired.charRatings = true
    }
    if (reqRemaining !== 'Minimum reached') {
      stillRequired.bodyLength = true
    }
    if (!form.nickname) {
      stillRequired.nickname = true
    }
    if (form.email.indexOf('@') < 1) {
      stillRequired.email = true
    }
    setBadSubmission(stillRequired)
  }
  //mandatory: ovarall rating, recommendation, characteristics, body (not summary), nickname, email

  const handleRecommend = (evt) => {
    setForm({...form, recommended: evt.target.value === 'yes' ? true : false})
  }

  const handleSummaryChange = (evt) => {
    setForm({...form, reviewSummary: evt.target.value})
  }

  const handleBodyChange = (evt) => {
    setForm({...form, reviewBody: evt.target.value})
    if (evt.target.value.length < 50) {
      let reqString = `Minimum required characters left: ${50 - evt.target.value.length}`
      setReqRemaining(reqString);
    } else {
      setReqRemaining('Minimum reached')
    }
  }

  const handleNickname = (evt) => {
    setForm({...form, nickname:evt.target.value})
  }

  const handleEmail = (evt) => {
    setForm({...form, email:evt.target.value})
  }

  const handleExit = (evt) => {
    document.getElementById('new-review-modal').checked = true ? false : true
  }


  return (
    <div className="static" title="new-review-modal">
      <input type="checkbox" id="new-review-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box h-full dark:bg-zinc-600 dark:text-slate-200">
        <label className="btn btn-circle btn-xs btn-ghost absolute top-3 right-3"  htmlFor="new-review-modal">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </label>
        <div className="text-3xl text-center">Write Your Review</div>
          <div className="text-center pb-4 pt-2">About the {productName}</div>
          <div className={`${badSubmission.stars && form.stars === "0" ? 'text-error' : ''}`}>
            <div className="pb-2 text-xl">Overall Rating:</div>
            <StarsRater form={form} setForm={setForm} />
          </div>
          <div className={`py-3 ${badSubmission.recommended && form.recommended === undefined ? 'text-error' : ''}`}>
            <span className="py-2 pr-7">Do you recommend this product?</span>
            <input type="radio" name="radio-1" id="yes" value="yes" onClick={handleRecommend}/>
            <label className="pr-5 pl-2">Yes</label>
            <input type="radio" name="radio-1" id="no" value="no" onClick={handleRecommend}/>
            <label className="pl-2">No</label>
          </div>
          <div className={`bg-slate-200 dark:bg-zinc-700 dark:text-slate-200 px-2 ${badSubmission.charRatings && !charsFilled ? 'border-2 border-error' : ''}`}>
            <CharacteristicReview chars={reviewMeta.characteristics} setForm={setForm} form={form} setCharsFilled={setCharsFilled} />
          </div>
          <div className="form-control w-full">
            <label className="label pt-5 w-full pb-0">
              <span className="text-xl w-full">Review summary:</span>
            </label>
            <input type="text" className="input input-bordered w-full text-black" placeholder="Example: Pest purchase ever!" onChange={handleSummaryChange} maxLength={60} />
            <label className="label pt-5 pb-0">
              <span className="text-xl">Review body:</span>
            </label>
            <textarea className={`textarea text-black ${badSubmission.bodyLength && reqRemaining !== 'Minimum reached' ? 'textarea-error' : 'textarea-bordered'}`} placeholder="Why did you like this product or not?" onChange={handleBodyChange}></textarea>
            <label className="label pt-0 pb-5">
              <span className={`label-text-alt ${badSubmission.bodyLength && reqRemaining !== 'Minimum reached' ? 'text-error' : 'dark:text-slate-400'}`} >{reqRemaining}</span>
            </label>
            <div>
              <PhotoUploader form={form} photos={form.photos} setForm={setForm} setPhoto={setPhoto} showButton={showButton} setShowButton={setShowButton} setDelButton={setDelButton} />
            </div>
            <div>
              <label className="label pb-0 pt-5">
                <span className="label">What is your nickname?</span>
              </label>
              <input type="text" placeholder="Example: jackson11!" className={`input w-full max-w-xs text-black ${ badSubmission.nickname && !form.nickname ? 'input-error' : 'input-bordered'}`} onChange={handleNickname} />
              <label className="label pt-0 pb-0">
              <span className="label-text-alt dark:text-slate-400">For privacy reasons, do not use your full name or email address</span>
            </label>
              <label className="label pb-0 pt-5">
                <span className="w-full">What is your email?</span>
              </label>
              <input type="text" placeholder="Example: jackson11@email.com" className={`input w-full max-w-xs text-black ${ badSubmission.email && form.email.indexOf('@') < 1 ? 'input-error' : 'input-bordered'}`} onChange={handleEmail} />
              <label className="label pt-0 pb-0">
              <span className="label-text-alt dark:text-slate-400" >For authentication reasons, you will not be emailed</span>
            </label>
              <div className="pt-5 flex justify-between">
                <label className="btn" onClick={handleSubmit}>Submit Review</label>
                <label className="btn btn-error" onClick={handleExit}>Cancel</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
