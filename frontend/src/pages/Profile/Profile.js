import "./Profile.css";

// Pegar imagem pela URL
import { uploads } from "../../utils/config";

import { Link } from "react-router-dom";
import { BsFillEyeFill, BsPencilFill, BsXLg } from "react-icons/bs";

// Componentes
import Message from "../../components/Message";

// Hooks
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Redux
import { getUserDetails } from "../../slices/userSlice";
import { publishPhoto, resetMessage, getUserPhotos, deletePhoto, updatePhoto } from "../../slices/photoSlice";

// Imagem
import ImagemPadrao from '../../img/padrao.png'

const Profile = () => {
    const {id} = useParams(); // Pegar o id que vem junto na URL
    const dispatch = useDispatch(); // Poder utilizar as funções de chamar dados

    const {user, loading} = useSelector((state) => state.user);
    const {user: userAuth} = useSelector((state) => state.auth); // Por coincidência ambos state.user e state.auth foram definidos com "user", então renomeei user para userAuth
    const {photos, loading: loadingPhoto, message: messagePhoto, error: errorPhoto} = useSelector((state) => state.photo); // Loading. message e error precisaram ser renomeados por ser iguais, porém irão ter funcionalidades diferentes

    const [title, setTitle] = useState("")
    const [image, setImage] = useState("")
    const [body, setBody] = useState("")

    const [editId, setEditId] = useState("");
    const [editImage, setEditImage] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editBody, setEditBody] = useState("")

    const [showError, setShowError] = useState(false);

    const [titleError, setTitleError] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [bodyError, setBodyError] = useState(false);

    // Contagem de caracteres
    const [titleCharCount, setTitleCharCount] = useState(0);
    const [bodyCharCount, setBodyCharCount] = useState(0);

    const [titleEditCharCount, setTitleEditCharCount] = useState(0);
    const [bodyEditCharCount, setBodyEditCharCount] = useState(0);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePhotoId, setDeletePhotoId] = useState(null);

    // Novo formulário e editar
    const newPhotoForm = useRef()
    const editPhotoForm = useRef()

    // Carregar dados do usuário
    useEffect(() => {
        dispatch(getUserDetails(id)); // Pegar os detalhes do usuário
        dispatch(getUserPhotos(id)); // Pegar as postagens do usuário
    }, [dispatch, id]);

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        setTitleCharCount(newTitle.length);
    }

    const handleBodyChange = (e) => {
        const newBody = e.target.value;
        setBody(newBody);
        setBodyCharCount(newBody.length);
    }
    
    const handleTitleEdit = (e) => {
        const newTitleEdit = e.target.value;
        setEditTitle(newTitleEdit);
        setTitleEditCharCount(newTitleEdit.length);
    }

    const handleBodyEdit = (e) => {
        const newBodyEdit = e.target.value;
        setEditBody(newBodyEdit);
        setBodyEditCharCount(newBodyEdit.length);
    }

    // Modal de deletar postagem
    const handleDelete = (id) => {
        setDeletePhotoId(id);
        setShowDeleteModal(true);
    };

    // Deletar uma postagem
    const confirmDeletePhoto = (id) => {
        dispatch(deletePhoto(id));
        setShowDeleteModal(false);
        // Timer
        resetComponentMessage();
    };

    // Abrir ou fechar formulário
    const hideOrShowForms = () => {
        newPhotoForm.current.classList.toggle('hide');
        editPhotoForm.current.classList.toggle('hide');
    }

    // Atualizar uma postagem
    const handleUpdate = (e) => {
        e.preventDefault();

        const photoData = {
            title: editTitle,
            body: editBody,
            id: editId,
        }

        dispatch(updatePhoto(photoData));

        // Timer
        resetComponentMessage();
    }

    // Cancelar formulário de edição
    const handleCancelEdit = () => {
        hideOrShowForms();
    }

    // Abrir o formulário com as informações
    const handleEdit = (photo) => {
        // Checar se o formulário de edição está fechado
        if (editPhotoForm.current.classList.contains('hide')) {
            hideOrShowForms();
        }

        const newTitle = photo.title;
        const newBody = photo.body

        setEditId(photo._id);
        setEditTitle(photo.title);
        setEditBody(photo.body);
        setEditImage(photo.image);
        setTitleEditCharCount(newTitle.length);
        setBodyEditCharCount(newBody.length);
    }

    const handleFile = (e) => {
        // Irá pegar a imagem 0, ou seja, a primeira e única
        const image = e.target.files[0];
        
        // Atualizar status da imagem
        setImage(image);
    }

    const handleRemoveImage = () => {
        setImage(null);
    }
 
    const resetComponentMessage = () => {
        // Timer na mensagem de success
        setTimeout(() => {
            dispatch(resetMessage());
        }, 2000);
    }

    const submitHandle = (e) => {
        e.preventDefault();

        const photoData = {
            title,
            body,
            image
        }

        // Construir formData
        const formData = new FormData();

        // Irá criar um loop em todas as chaves do objeto photoData, e um forEach por cada chave, assim criando o photoFormData 
        const photoFormData = Object.keys(photoData).forEach(key => {
            formData.append(key, photoData[key])
        });

        // Adicionar no formData um objeto chamado "photo" com o photoFormData
        formData.append("photo", photoFormData);

        // Dar um dispatch no publishPhoto mandando os dados do formData
        dispatch(publishPhoto(formData));

        // Reset
        setTitle("");
        setBody("");

        // Timer
        resetComponentMessage();
    }

    useEffect(() => {
        if (errorPhoto) {
            setShowError(true);

            // Foi feito essa ligação para o title, image e body não serem passados na Array
            setTitleError(title => !title);
            setImageError(image => !image);
            setBodyError(body => !body);

            // Timer para tanto o erro quanto os inputs vermelhos sumirem depois de 2 segundos
            const timer = setTimeout(() => {
                setShowError(false);
                setTitleError(false);
                setImageError(false);
                setBodyError(false);
            }, 2000);

            return () => {
                clearTimeout(timer);
                setShowError(false); // Redefinir o estado ao sair da página
            };
        }
    }, [errorPhoto, setBodyError, setImageError, setTitleError])

    if(loading) {
        return (
            <div className="loading-container">
              <div className="lds-heart"><div></div></div>
            </div>
        );
    }

  return (
    <div id="profile">
        <div className="profile-header">

            {/* Caso não tenha nenhuma imagem, será puxado o "ImagemPadrao" para o local */}    
            {user.profileImage ? (
                <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} />
            ) : (
                <img src={ImagemPadrao} alt="Imagem Padrão" />
            )}

            <div>
                <div className="profile-infos">
                    <h2>{user.name}</h2>
                    <p className="profile-name">{user.profileName}</p>
                </div>
                <p className="profile-bio" style={{ whiteSpace: "pre-wrap" }}>{user.bio}</p>
            </div>
        </div>

        {id === userAuth._id && (
            <>
                <div className="new-photo" ref={newPhotoForm}>
                    <h3>Compartilhe algum momento seu! &#128508;</h3>
                    <form onSubmit={submitHandle}>
                        <label>
                        <div className="input-wrapper">
                            <span>Título:</span>
                            <div className="char-countbio">{titleCharCount}/30 caracteres</div>
                        </div>
                            <input type="text" placeholder="Insira um bom título! &#128170;" onChange={handleTitleChange} value={title || ""} className={errorPhoto && titleError ? 'error' : ''} />
                        </label>
                        <label>
                            <span>Imagem:</span>
                            <input type="file" accept=".png, .webp, .svg, .jpg, .jpeg" onChange={handleFile} className={errorPhoto && imageError ? 'error' : ''} />
                            {image && <button onClick={handleRemoveImage}>Remover imagem</button>}
                        </label>
                        <label>
                        <div className="input-wrapper">
                            <span>Corpo do texto:</span>
                            <div className="char-countbio">{bodyCharCount}/280 caracteres</div>
                        </div>
                            <textarea rows={2} wrap="soft" placeholder="Comente sobre sua postagem! &#127863;" onChange={handleBodyChange} value={body || ""} className={`bodyinput ${errorPhoto && bodyError ? "error" : ""}`}  />
                        </label>
                        {!loadingPhoto && <input type="submit" value="Postar" />}
                        {loadingPhoto && <input type="submit" value="Aguarde..." disabled />}
                        {messagePhoto && <Message msg={messagePhoto} type="success"/>}
                        {showError && <Message msg={errorPhoto} type="error"/>}
                    </form>
                </div>

                <div className="edit-photo hide" ref={editPhotoForm}>
                    <p>Editando:</p>
                    {editImage && (
                        <img src={`${uploads}/photos/${editImage}`} alt={editTitle} />
                    )}
                    <form onSubmit={handleUpdate}>
                        <label>
                            <div className="input-wrapper">
                                <span>Título:</span>
                                <div className="char-countbio">{titleEditCharCount}/30 caracteres</div>
                            </div>
                            <input type="text" placeholder="Insira um bom título! &#128170;" onChange={handleTitleEdit} value={editTitle || ""} className={errorPhoto && titleError ? 'error' : ''} />
                        </label>
                        <label>
                            <div className="input-wrapper">
                                <span>Corpo do texto:</span>
                                <div className="char-countbio">{bodyEditCharCount}/280 caracteres</div>
                            </div>
                            <textarea rows={2} wrap="soft" placeholder="Comente sobre sua postagem! &#127863;" onChange={handleBodyEdit} value={editBody || ""} className={`bodyinput ${errorPhoto && bodyError ? "error" : ""}`}  />
                        </label>
                        <input type="submit" value="Atualizar" />
                        <button className="cancel-btn" onClick={handleCancelEdit}>Voltar</button>
                        {messagePhoto && <Message msg={messagePhoto} type="success"/>}
                        {showError && <Message msg={errorPhoto} type="error"/>}
                    </form>
                </div>
            </>
        )}
        <div className="user-photos">
            <h2>Fotos publicadas:</h2>
            <div className="photos-container">
                {/* Irá conferir se é Array e irá buscar com o map */}
                {Array.isArray(photos) && photos.map(photo => (
                    <div className="photo" key={photo._id}>
                        <div className="photo-wrapper">
                            <div className="photo-wrapper-inner">
                                {/* Irá usar a imagem normalmente */}
                                <div>
                                {photo.image ? (
                                    <img src={`${uploads}/photos/${photo.image}`} alt={photo.title} />
                                ) : (
                                <div className="photo-placeholder">
                                    {photo.title && <p>{photo.title}</p>} {/* Caso não tenha imagem o título irá substituir */}
                                </div>
                                )}
                            </div>
                        </div>
                        {id === userAuth._id ? (
                            <div className="actions">
                                <Link to={`/fotos/${photo._id}`}>
                                    <BsFillEyeFill />
                                </Link>
                                <BsPencilFill onClick={() => handleEdit(photo)} />
                                <BsXLg onClick={() => handleDelete(photo._id)} /> {/* Feita uma arrow function pois sem o () => ele iria acionar sempre que abrir a página */}
                            </div>
                        ) : (
                            <div className="actions groweye">
                                <Link to={`/fotos/${photo._id}`}>
                                    <BsFillEyeFill />
                                </Link>
                            </div>
                        )}
                        </div>
                        {/* Caso o usuário seja dono da postagem irá aparecer os ícones */}
                        {/* Caso não for, aparecerá o <Link></Link> */}
                    </div>
                ))}
                {photos.length === 0 && <p>Ainda não há fotos publicadas</p>}
            </div>
        </div>

        {showDeleteModal && (
            <div className="modal">
                <div className="modal-content">
                    <h2>Está certo disso?</h2>
                        <p>Tem certeza que deseja deletar essa postagem?</p>
                        <div className="modal-actions">
                            <button className="btn-delete" onClick={() => confirmDeletePhoto(deletePhotoId)}>Deletar</button>
                            <button onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                        </div>
                </div>
            </div>
        )}

    </div>
  )
}

export default Profile