import React, { useState } from 'react'
import CarouselPhoto from './CarouselPhoto.jsx'
//import Path from 'path'

export default function PhotoUploader({ photos, form, setForm, setPhoto, showButton, setShowButton, setDelButton }) {




  const handleSubmit = (evt) => {

    const photoWidget = cloudinary.createUploadWidget({
      cloudName: 'dyrlg2pzz',
      uploadPreset: 'tiigxyou',
      cropping: true,
      clientAllowedFormats: ["image"]
    },
      (error, result) => {
        if (!error && result && result.event === "success") {
          let newPhotos = photos.slice()
          newPhotos.push(result.info.secure_url)
          if (newPhotos.length >= 5) {
            setShowButton(false)
          }
          setForm({...form, photos:newPhotos})

        }
      })

    photoWidget.open()

  }

  return (
    <div title="photo-uploader">
      <div>{photos.length > 0 && <div className="pb-5 px-5 carousel">
        {photos.length > 0 && photos.map(photo =>
        <CarouselPhoto src={photo} setPhoto={setPhoto} key={photo.slice(-20)} setDelButton={setDelButton}/>)}
      </div>}</div>
      {showButton && <div>
        <button className="btn" onClick={handleSubmit}>Add Photo</button>
      </div>}
    </div>
  )
}