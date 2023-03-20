import React, { useState, useEffect } from 'react';
import ReviewsList from './ReviewsList.jsx'
import Sidebar from './Sidebar.jsx'
import FullSizePhoto from './FullSizePhoto.jsx'

export default function RatingsReviews(props) {
  const [starFilter, setStarFilter] = useState('');
  const [photo, setPhoto] = useState('');
  const [showPhoto, setShowPhoto] = useState(false)

  useEffect(() => {
    photo ? setShowPhoto(true) : setShowPhoto(false)
  }, [photo]);

  return (
    <div className="flex flex-row basis-full relative">
      {showPhoto && <div className="card bg-base-100 shadow-x1 absolute z-20"><FullSizePhoto src={photo} setPhoto={setPhoto} /></div>}
      <Sidebar filter={setStarFilter} setFilter={setStarFilter} />
      <ReviewsList setPhoto={setPhoto} />
    </div>
  )
}