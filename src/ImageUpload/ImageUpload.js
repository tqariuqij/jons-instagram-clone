import React, { useState } from 'react';
import './ImageUpload.css'
import { Button } from '@material-ui/core';
import firebase from 'firebase';
import { storage, db } from '../firebase'
 
const ImageUpload = ({username}) => {

    const [caption, setCaption] = useState('');
    // const [url, setUrl] = useState('');
    const [progress, setprogress] = useState('');
    const [image, setimage] = useState(null);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setimage(e.target.files[0]);
        } 
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
              // progress function ...
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setprogress(progress);
        },
        (error) => {
            //error function
            console.log(error);
            alert(error.message)
        },
        () => {
            //the complete uploading function
            storage
                .ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    db.collection('posts').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username:username
                    });

                    setprogress(0);
                    setCaption('');
                    setimage(null);
                })

            }
        );      
    }

    return (
        <div className='imageupload'>
            <progress className='imageupload__progress' value={progress} max='100' />
            <input  type='text' 
                    placeholder='what is in your ....'
                    onChange={e => setCaption(e.target.value)}
                    value={caption}
            />
            <input type='file' onChange={handleChange}/>
            <Button className='imageupload__button' onClick={handleUpload} >
                upload
            </Button>
        </div>
    )
}

export default ImageUpload
