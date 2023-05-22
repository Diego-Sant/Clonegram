import "./Photo.css";

import { uploads } from "../../utils/config";

import ImagemPadrao from '../../img/padrao.png';
import { BsTrash3Fill } from "react-icons/bs";

// Componentes
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import PhotoItem from "../../components/PhotoItem";
import LikeAndComment from "../../components/LikeAndComment";

// Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getPhoto, like, unlike, comment } from "../../slices/photoSlice";

// Redux

const Photo = () => {
  const {id} = useParams();
  const {user} = useSelector((state) => state.auth);
  const {photo, loading, error, message} = useSelector((state) => state.photo);

  const dispatch = useDispatch();

  const [commentText, setCommentText] = useState('');

  // Criado para ser usado no timer
  const [showError, setShowError] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const [commentCharCount, setCommentCharCount] = useState(0);

  // Desabilitar o like/unlike por 2 segundos ao clicar
  const [likeButtonDisabled, setLikeButtonDisabled] = useState(false);

  // Carregar dados da postagem
  useEffect(() => {
    dispatch(getPhoto(id));
  }, [dispatch, id])

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

  // Adicionar um comentário
  const handleComment = (e) => {
    e.preventDefault();

    const commentData  = {
      comment: commentText,
      id: photo._id
    }

    dispatch(comment(commentData))

    setCommentText("");
  };

  const handleCommentTextarea = (e) => {
    const newComment = e.target.value;
    setCommentText(newComment);
    setCommentCharCount(newComment.length)
  }

  useEffect(() => {
    if(error) {
      setShowError(true);

      const timer = setTimeout(() => {
        setShowError(false);
      }, 2000);

      return () => {
        clearTimeout(timer);
        setShowError(false); // Redefinir o estado ao sair da página
      };
    }
  }, [error])

  useEffect(() => {
    if(message) {
      setShowMessage(true);

      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 2000);

      return () => {
        clearTimeout(timer);
        setShowMessage(false); // Redefinir o estado ao sair da página
      };
    }
  }, [message])

  if(loading) {
    return (
        <div className="loading-container">
          <div className="lds-heart"><div></div></div>
        </div>
    );
  }

  return (
    <div id="photo">
      <PhotoItem photo={photo}/>
      <LikeAndComment photo={photo} user={user} handleLike={handleLike} handleUnlike={handleUnlike} likeButtonDisabled={likeButtonDisabled} handleComment={handleComment}/>
      <div className="comments">
        {photo.comments && (
          <>
            <h3>Comentários: ({photo.comments.length})</h3>
            <form onSubmit={handleComment}>
            <div className="input-wrapper">
                <span className="titleComment">Comentário:</span>
                <div className="char-countcomment">{commentCharCount}/280 caracteres</div>
            </div>
              <textarea
                  type="text"
                  placeholder="Insira seu comentário..."
                  value={commentText || ""}
                  onChange={handleCommentTextarea}
              />
              <input type="submit" value="Enviar" />
            </form>
            {photo.comments.length === 0 && <p>Ainda não há comentários...&#127811;</p>}
            {photo.comments.map((comment) => (
              <div className="commentary" key={comment.comment}>
                <div className="author">
                  {comment.userImage ? (
                    <img src={`${uploads}/users/${comment.userImage}`} alt={comment.userName} />
                  ) : (
                    <img src={ImagemPadrao} alt="Imagem Padrão" />
                  )}
                  <Link to={`/usuarios/${comment.userId}`}>
                    <div className="flexusers">
                      <p className="user-name">{comment.userName} </p>
                      <p className="user-profile"> {comment.userProfileName}</p>
                    </div>
                  </Link>
                </div>
                <p className="comment-text">{comment.comment}</p>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="message-container">
        {showError && <Message msg={error} type="error"/>}
        {showMessage && <Message msg={message} type="success"/>}
      </div>
    </div>
  )
}

export default Photo