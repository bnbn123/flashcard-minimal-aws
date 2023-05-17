import React, { useState } from 'react'
import { FlashCard } from '../types/FlashCard'
import './FlipCard.css'
import { Image } from 'semantic-ui-react'

export const FlipCard = (flashcard: FlashCard) => {
  const [flipped, setFlipped] = useState(false)
  console.log('🚀 ~ file: FlipCard.tsx:8 ~ FlipCard ~ flipped:', flipped)

  const flip = () => {
    setFlipped(!flipped)
  }

  return (
    <div
      onMouseEnter={flip}
      onMouseLeave={flip}
      className={'card-container' + (flipped ? ' flipped' : '')}
    >
      <Front flashcardName={flashcard.name} />
      <Back {...flashcard} />
    </div>
  )
}

const Back = (flashcard: FlashCard) => {
  return (
    <div className="back">
      <ImageArea attachmentUrl={flashcard.attachmentUrl || ''} />
      <MainArea flashCardDef={flashcard.flashCardDef || ''} />
    </div>
  )
}

const Front = ({ flashcardName }: { flashcardName: string }) => {
  return (
    <div className="front">
      <p>{flashcardName}</p>
      <p className="read-more">Hover to read more...</p>
    </div>
  )
}

const ImageArea = ({ attachmentUrl }: { attachmentUrl: string }) => {
  return attachmentUrl ? (
    <div className="image-container">
      <Image className="card-image" alt="" src={attachmentUrl}></Image>
      <h1 className="title">Illustration</h1>
    </div>
  ) : null
}

const MainArea = ({ flashCardDef }: { flashCardDef: string }) => {
  return (
    <div className="main-area">
      <div className="blog-post">
        <p className="blog-content">{flashCardDef}</p>
      </div>
    </div>
  )
}
