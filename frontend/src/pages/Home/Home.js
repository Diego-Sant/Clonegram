import "./Home.css"

import LikeContainer from "../../components/LikeAndComment";
import PhotoItem from "../../components/PhotoItem";
import { Link } from "react-router-dom";

// Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { getPhotos, like, unlike } from "../../slices/photoSlice";

const Home = () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);
  const {photos, loading} = useSelector((state) => state.photo)

  const [likeButtonDisabled, setLikeButtonDisabled] = useState(false);

  // Carregar todas as postagens
  useEffect(() => {
    dispatch(getPhotos())
  }, [dispatch])

    // Likes
    const handleLike = (photo) => {
      if (!likeButtonDisabled) {
        dispatch(like(photo._id));
        setLikeButtonDisabled(true);
        setTimeout(() => {
          setLikeButtonDisabled(false);
        }, 2000);
      }
    };
  
    // Retirar like
    const handleUnlike = (photo) => {
      if (!likeButtonDisabled) {
        dispatch(unlike(photo._id));
        setLikeButtonDisabled(true);
        setTimeout(() => {
          setLikeButtonDisabled(false);
        }, 2000);
      }
    };

    if(loading) {
      return (
          <div className="loading-container">
            <div className="lds-heart"><div></div></div>
          </div>
      );
    }

  return (
    <div id="home">
      <h1 className="titlehome">Bem-vindo ao Clonegram</h1>
      <p className="paragraphhome">A rede social mais legal do mundo!</p>

      {photos && photos.map((photo) => (
        <div className="borderphoto" key={photo._id}>
            <PhotoItem photo={photo}/>
            <LikeContainer photo={photo} user={user} handleLike={handleLike} handleUnlike={handleUnlike}/>
            <Link className="btn" to={`/fotos/${photo._id}`}>Ver mais</Link>
        </div>
      ))}
      {photos && photos.length === 0 && (
        <h2 className="no-photos">
          Ninguém postou ainda &#128532; <Link className="colorpurple" to={`/usuarios/${user._id}`}>Seja o primeiro!</Link>
        </h2>
      )}

    </div>
  )
}

export default Home