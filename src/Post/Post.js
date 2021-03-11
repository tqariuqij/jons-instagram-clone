import React, { useState, useEffect  } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from "../firebase";
import firebase from "firebase";

const Post = ({ user, postId, username, caption, imageUrl}, ref) => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
          unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
              setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }

        return () => {
            unsubscribe();
          };
        }, [postId]);

        const postComment = (e) => {
            e.preventDefault();

            db.collection("posts").doc(postId).collection("comments").add({
                text : comment,
                username: user.displayName,
                timestamp:firebase.firestore.FieldValue.serverTimestamp()
              });
              setComment("");
        }

    return (
        <div className = 'post'>
            <div className='post__header'>
                <Avatar
                    className="post__avatar"
                    alt=''
                    src='/static/images/avatar/1.jpg'
                />
                <h3>{username}</h3>
            </div>
          
            <img
                className='post__image'
                src={imageUrl}
                alt=""
             />

            <div className='post__text'>
                <p >
                    <strong>{username}: </strong> 
                    {caption}
                </p>
            </div>
             
             <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                    <strong>{comment.username}: </strong> {comment.text}
                    </p>
                ))}
            </div>

            <form className='post__commentBox'>
                <input 
                    className='post__input'
                    placeholder="post a comment"
                    type='text'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button
                    disabled={!comment}
                    className="post__button"
                    type="submit"
                    onClick={postComment}
                    >
                    Post
                </button>
            </form>

        </div>
    )
}

export default Post
