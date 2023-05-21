import "./Search.css"

// Hooks
import {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "../../hooks/useQuery";

// Componentes
import LikeContainer from "../../components/LikeAndComment";
import PhotoItem from "../../components/PhotoItem";
import { Link, useNavigate } from "react-router-dom";

// Redux
import { searchPhotos, like, unlike } from "../../slices/photoSlice";

const Search = () => {
    const query = useQuery();
    const search = query.get("q")

    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const {user} = useSelector((state) => state.auth)
    const {photos, loading} = useSelector((state) => state.photo)

    const [likeButtonDisabled, setLikeButtonDisabled] = useState(false);

    useEffect(() => {
        dispatch(searchPhotos(search))
    },[dispatch, search, navigate])

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
    <div id="search">
        {photos && photos.map((photo) => (
            <div className="borderphoto" key={photo._id}>
                <PhotoItem photo={photo}/>
                <LikeContainer photo={photo} user={user} handleLike={handleLike} handleUnlike={handleUnlike}/>
                <Link className="btn" to={`/fotos/${photo._id}`}>Ver mais</Link>
            </div>
        ))}
        {photos && photos.length === 0 && (
            <h2 className="no-photos">
            Não há resultados para "{search}"
            </h2>
        )}
    </div>
  )
}

export default Search