import "./EditProfile.css"

import { uploads } from "../../utils/config";

// Hooks
import {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";

// Redux
import { profile, resetMessage, updateProfile } from "../../slices/userSlice";

// Componentes
import Message from '../../components/Message';
import ImagemPadrao from '../../img/padrao.png'

const EditProfile = () => {
    const dispatch = useDispatch()
    const {user, message, error, loading} = useSelector((state) => state.user)

    const [name, setName] = useState('');
    const [profileName, setProfileName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState("");

    const [showError, setShowError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [profileNameError, setProfileNameError] = useState(false);
    const [bioError, setBioError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);

    const [nameInitialValue, setNameInitialValue] = useState('');
    const [profileNameInitialValue, setProfileNameInitialValue] = useState('');
    const [bioInitialValue, setBioInitialValue] = useState('');
    const [emailInitialValue, setEmailInitialValue] = useState('');

    // Contagem de caracteres
    const [nameCharCount, setNameCharCount] = useState(0);
    const [profileNameCharCount, setProfileNameCharCount] = useState(0);
    const [bioCharCount, setBioCharCount] = useState(0);


    function handleProfileNameChange(event) {
        // Adiciona @ no início toda vez que o usuário for digitar no input
        let newValue = event.target.value;
        if (!newValue || newValue.startsWith("@")) {
          setProfileName(newValue);
        }
        else if (newValue.indexOf("@") === -1) {
          newValue = "@" + newValue;
          setProfileName(newValue);
        } else {
          setProfileName(`@${newValue}`);
        }
    
        // Feito isso para o charCount não contabilizar o @ que vem no início do profileName
        const atIndex = newValue.indexOf("@");
        setProfileNameCharCount(newValue.slice(atIndex + 1).length);
    }

    // Contagem básica para o input específico contabilizar todos os caracteres que estão sendo digitados
    const handleNameChange = (event) => {
        const newName = event.target.value;
        setName(newName);
        setNameCharCount(newName.length);
    }

    const handleBioChange = (event) => {
        const newBio = event.target.value;
        setBio(newBio);
        setBioCharCount(newBio.length);
    }

    // Carregar data do usuário
    useEffect(() => {
        dispatch(profile());
    }, [dispatch])

    // Preencher o formulário automaticamente
    useEffect(() => {
        if(user) {
            setName(user.name)
            setProfileName(user.profileName)
            setEmail(user.email)
            setBio(user.bio)
            setProfileImage(user.profileImage);

            if (user && user.profileName) {
                // Não contabilizar o @ como um caractere
                const atIndex = user.profileName.indexOf("@");
                setProfileNameCharCount(user.profileName.slice(atIndex + 1).length);

                setNameCharCount(user.name.length);

                // Por um bug anterior, precisou dessa validação caso a bio for vazia
                const bioLength = user.bio ? user.bio.length : 0;
                setBioCharCount(bioLength);
            }
        }
    }, [user])

    useEffect(() => {
        // Armazena os valores iniciais dos inputs quando o componente é montado
        setNameInitialValue(name);
        setProfileNameInitialValue(profileName);
        setBioInitialValue(bio);
        setEmailInitialValue(email);
    }, [name, bio, profileName, email]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
          name,
          profileName,
          bio,
          password,
          confirmPassword,
          profileImage,
        };
    
        const formData = new FormData();

        const userFormData = Object.keys(userData).forEach(key => {
          formData.append(key, userData[key]);
        });
    
        formData.append('user', userFormData);
    
        // Enviar os dados do formulário atualizados
        await dispatch(updateProfile(formData));
    
        // Timeout para a mensagem de "sucess" sumir
        setTimeout(() => {
          dispatch(resetMessage());
        }, 2000);
    }

    function handleFile(e) {
        // Irá pegar a imagem 0, ou seja, a primeira e única
        const image = e.target.files[0];
    
        // Preview da imagem antes mesmo de ser atualizada
        setPreviewImage(image);
    
        // Atualizar status da imagem
        setProfileImage(image);
    }

    useEffect(() => {
        if (error) {
            setShowError(true);
    
            setPasswordError(password => !password);
            setConfirmPasswordError(confirmPassword => !confirmPassword);

            // Caso o erro aconteça, esses inputs continuarão preenchidos ao em vez de serem apagados
            setName(nameInitialValue);
            setProfileName(profileNameInitialValue);
            setBio(bioInitialValue);
            setEmail(emailInitialValue);
            
            setNameError(!nameInitialValue);
            setProfileNameError(!profileNameInitialValue);
            setBioError(!bioInitialValue);

            // Timer para tanto o erro quanto os inputs vermelhos sumirem depois de 2 segundos
            const timer = setTimeout(() => {
                setShowError(false);
                setNameError(false);
                setProfileNameError(false);
                setBioError(false);
                setPasswordError(false);
                setConfirmPasswordError(false);
            }, 2000);
      
          return () => {
            clearTimeout(timer);
            setShowError(false); // Redefinir o estado ao sair da página
          };
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]); // Se colocasse os InitialValue nas dependências os inputs iriam ficar quebrados

  return (
    <div id="edit-profile">
        <h2>Editar perfil</h2>
        <p className="subtitle">Conte mais sobre você! &#127774;</p>

        {/* Preview da imagem */} {/* o "src" irá pegar a imagem na pasta uploads/users/ e irá transformar em uma URL única */}
        {(user.profileImage || previewImage) ? (
        <img className="profile-image" src={previewImage ? URL.createObjectURL(previewImage) : `${uploads}/users/${user.profileImage}`} alt={user.name} />
        ) : (
        <img className="profile-image" src={ImagemPadrao} alt="Imagem Padrão" />
        )}
        {/* Caso não tenha nenhuma imagem, será puxado o "ImagemPadrao" para o local */}

        <form onSubmit={handleSubmit}>
            <label>
                <div className="input-wrapper">
                    <input type="text" placeholder="Nome" onChange={handleNameChange} value={name || ""} className={`forminput ${error && showError && nameError ? "error" : ""}`}  />
                    <div className="char-count">{nameCharCount}/25 caracteres</div>
                </div>
            </label>
            <label>
                <div className="input-wrapper">
                    <input type="text" placeholder="Nome do usuário" onChange={handleProfileNameChange} value={profileName || ""} className={`forminput ${error && showError && profileNameError ? "error" : ""}`} />
                    <div className="char-count">{profileNameCharCount}/15 caracteres</div>
                </div>
            </label>
            <label>
                <input type="email" className="marginbottominput" disabled value={email || ""} />
            </label>
            <label>
                <span>Imagem do perfil:</span>
                <input type="file" accept=".png, .jpg, .jpeg" onChange={handleFile} />
            </label>
            <label>
                <div className="input-wrapper">
                    <span>Bio:</span>
                    <div className="char-countbio">{bioCharCount}/160 caracteres</div>
                </div>    
                <textarea type="text" placeholder="Seja criativo! &#128526;" onChange={handleBioChange} value={bio || ""} className={`bioinput ${error && showError && bioError ? "error" : ""}`} />
            </label>
            <label>
                <input type="text" placeholder="Nova senha" onChange={(e) => setPassword(e.target.value)} value={password || ""} className={`${error && showError && passwordError ? "error" : ""}`}  />
            </label>
            {password && (
            <label>
                <input type="text" placeholder="Confirme a senha" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword || ""} className={`${error && showError && confirmPasswordError ? "error" : ""}`}  />
            </label>
            )}
            {!loading && <input type="submit" value="Atualizar" />}
            {loading && <input type="submit" value="Aguarde..." disabled />}
            {message && <Message msg={message} type="success"/>}
            {showError && <Message msg={error} type="error"/>}
        </form>

    </div>
  )
}

export default EditProfile