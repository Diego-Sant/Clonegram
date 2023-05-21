import { useState } from "react";
import "./LikeAndComment.css"

import {BsHeart, BsHeartFill} from 'react-icons/bs';

const LikeContainer = ({photo, user, handleLike, handleUnlike, likeButtonDisabled }) => {
  const [clicked, setClicked] = useState(false);

  const handleLikeClick = () => {
    if (photo.likes.includes(user._id)) {
      handleUnlike(photo);
    } else {
      handleLike(photo);
      setClicked(true);
      setTimeout(() => {
        setClicked(false);
      }, 2000);
    }
  };

  const handleUnlikeClick = () => {
    handleUnlike(photo);
  };

  return (
    <div className="commentAndLike">
      <div className={`like ${likeButtonDisabled ? "disabled" : ""}`}>
          {photo.likes && user && (
            <>
              {photo.likes.includes(user._id) ? (
                <BsHeartFill onClick={handleUnlikeClick} className={`heart-icon filled ${clicked ? "clicked" : ""}`}/>
              ) : (
                <BsHeart onClick={handleLikeClick} className={`heart-icon empty ${clicked ? "clicked" : ""}`}/>
              )}

              <p>{photo.likes.length}</p>
            </>
          )}
      </div>
    </div>
  )
}

export default LikeContainer