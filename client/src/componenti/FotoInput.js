import './css/FotoInput.css';
import cameraIcon from './camera.svg';
import { useEffect, useState } from 'react';
import {serverHost} from '../host.js';
import AvatarEditor from 'react-avatar-editor';
import checkIcon from './check.svg';

function FotoInput(props)
{
    const [coverDisplay, setCoverDisplay] = useState('none');
    const [modalOpen, setModalOpen] = useState('none');
    const [avatarSize, setAvatarSize] = useState(1.2);
    const [selectedIMG, setSelectedIMG] = useState('none');
    const [editorRefer, setEditorRefer] = useState(false);
    const [blob, setBlob] = useState('none');

    const changeAvatarImg = () => {
        if(editorRefer)
        {
            const canvasScaled = editorRefer.getImageScaledToCanvas().toDataURL();

            fetch(canvasScaled)
            .then(res => res.blob())
            .then(blob => {
                setBlob(window.URL.createObjectURL(blob));
                props.handle(blob);
                setModalOpen('none');
            });
        } 
    }

    useEffect(() => {
        if(modalOpen === 'none')
        {
            document.body.style.pointerEvents = 'all';
        }
        else
        {
            document.body.style.pointerEvents = 'none';
        }
    }, [modalOpen]);

    const getFileName = () => {
        const inputFile = document.getElementById('customInputFile');
        inputFile.click();

        inputFile.addEventListener('change', () => {
            const formData = new FormData();
            formData.append('foto', inputFile.files[0]);

            fetch(serverHost + '/temp_foto', {
                method: 'POST',
                body: formData
            })
            .then(res => res.text())
            .then(res => {
                if(res==='ok')
                {
                    setSelectedIMG(serverHost + '/temp/' + inputFile.files[0].name);
                    setModalOpen('flex');
                }
            });
        });
    }

    const setEditorRef = (editor) => {
         setEditorRefer(editor); 
    }

    return (
        <div>
            <div className="FotoInput" onMouseOver={() => setCoverDisplay('flex')} onMouseOut={() => setCoverDisplay('none')} onClick={() => getFileName()}>
                <input type="file" style={{display: 'none'}} id="customInputFile"></input>
                <img src={(blob === 'none')? props.foto : blob } style={{width: "100%"}}></img>
                <div className="fotoInputCover" style={{display: coverDisplay}}>
                    <img className="fotoInputCoverIMG" src={cameraIcon}></img>
                </div>
            </div>

            <div className="regolaFoto" style={{display: modalOpen}}>
                <div className="regolaFotoContainer">
                    <div className="regolaFotoTop">
                        <svg className="modalCloseIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" onClick={() => setModalOpen('none')}><path fill="white" d="M19.1 17.2l-5.3-5.3 5.3-5.3-1.8-1.8-5.3 5.4-5.3-5.3-1.8 1.7 5.3 5.3-5.3 5.3L6.7 19l5.3-5.3 5.3 5.3 1.8-1.8z"></path></svg>
                    </div>

                    <div className="avatarContainer">                  
                        <AvatarEditor
                            image={selectedIMG}
                            width={320}
                            height={320}
                            border={0}
                            color={[255, 255, 255, 0.6]} // RGBA
                            scale={avatarSize}
                            borderRadius={200}
                            rotate={0}
                            ref={setEditorRef}
                            crossOrigin={"anonymous"}
                            
                        />
                        <div className="avatarResize">
                            <button type="button" className="buttonResize" onClick={() => setAvatarSize(avatarSize+0.2)}>+</button>
                            <button type="button" className="buttonResize" onClick={() => (avatarSize - 0.2 >= 1)? setAvatarSize(avatarSize-0.2) : setAvatarSize(1)}>-</button>
                        </div>
                    </div>
                    
                    <div className="regolaFotoFooter">
                        <button type="button" id="avatarSave" onClick={() => changeAvatarImg()}><img src={checkIcon}></img></button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default FotoInput;