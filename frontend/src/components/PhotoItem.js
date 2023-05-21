import "./PhotoItem.css"

import { uploads } from "../utils/config"
import { Link } from "react-router-dom"

const PhotoItem = ({photo}) => {

  return (
    <div className="photo-item">
        <p className="photo-author">
            <Link to={`/usuarios/${photo.userId}`}>{photo.userName}</Link>
        </p>
        <p className="profileName">
            <Link to={`/usuarios/${photo.userId}`}>{photo.userProfileName}</Link>
        </p>
        <h2 className="title">{photo.title}</h2>
        <p className="wrapbody">{photo.body}</p>
        {photo.image && (
            <img src={`${uploads}/photos/${photo.image}`} alt={photo.title}/>
        )}
    </div>
  )
}

export default PhotoItem