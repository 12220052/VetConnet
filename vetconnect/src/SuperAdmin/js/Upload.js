import React, { useState } from 'react';
// import Alert from '../../components/Alert';
import "../css/style.css";

export default function Upload() {
    const [fileInputState, setFileInputState] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [selectedFile, setSelectedFile] = useState();
    const [successMsg, setSuccessMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const Alert = ({ msg, type }) => {
        return msg ? <div className={`alert alert-${type}`}>{msg}</div> : null;
    };
    
    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        previewFile(file);
        setSelectedFile(file);
        setFileInputState(e.target.value);
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };

    const handleSubmitFile = (e) => {
        e.preventDefault();
        if (!selectedFile) return;
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
            uploadImage(reader.result);
        };
        reader.onerror = () => {
            console.error('error');
            setErrMsg('something went wrong!');
        };
    };

    const uploadImage = async (base64EncodedImage) => {
        try {
            const response = await fetch('http://localhost:8080/api/upload', {
                method: 'POST',
                body: JSON.stringify({ data: base64EncodedImage }),
                headers: { 'Content-Type': 'application/json' },
            });
    
            const result = await response.json(); // Expecting JSON response
    
            if (!response.ok) {
                throw new Error(result.message || 'Upload failed');
            }else{
    
            setFileInputState('');
            setPreviewSource('');
            setSuccessMsg('Image uploaded successfully');
            setErrMsg('');}
        } catch (err) {
            console.error(err);
            setErrMsg('Something went wrong! Please check the server.');
            setSuccessMsg('');
        }
    };
    
    return (
        <div>
            <h1 className="title">Upload an Image</h1>
            {errMsg && <Alert msg={errMsg} type="danger" />}
            {successMsg && <Alert msg={successMsg} type="success" />}
            <form onSubmit={handleSubmitFile} className="form">
                <input
                    id="fileInput"
                    type="file"
                    name="image"
                    onChange={handleFileInputChange}
                    value={fileInputState}
                    className="form-input"
                />
                <button className="btn" type="submit">
                    Submit
                </button>
            </form>
            {previewSource && (
                <img
                    src={previewSource}
                    alt="chosen"
                    style={{ height: '300px' }}
                />
            )}
        </div>
    );
}
