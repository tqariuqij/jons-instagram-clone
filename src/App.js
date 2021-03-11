import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post/Post';
import { auth, db } from './firebase'; 
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import ImageUpload from './ImageUpload/ImageUpload';
 

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    height:'300px',
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    height: 100,
    width: 200,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [modalStyle] = useState(getModalStyle);
  const [user, setUser] = useState(null);

  const signUp = (e) => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName:username,
      })
    })
    .catch((error) => alert(error.message));
    setOpen(false);
  };

  useEffect(() => {
    const unsubscribe =  auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        console.log(authUser);
        setUser(authUser);

        // if (authUser.displayName) {
        //   // dont update username
        // } else {
        //   return authUser.updateProfile({
        //     displayName: username,
        //   });
        // }
      } else {
        // user has logged out
        setUser(null);
      }
    })
    return () => {
      //perform some clean up action
      unsubscribe();
    }

  }, [user,username]);
  

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()})
        ))
    })
  }, []);

  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

      setOpenSignIn(false);
  }
  
  return (
    <div className="App">
    
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
            <center>
              <h1>meme city</h1>
            </center>
            <Input
                placeholder='username'
                type='text'
                value={username}
                onChange={(e) =>setUsername(e.target.value)}
              />
            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) =>setEmail(e.target.value)}
            />
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) =>setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signUp}>Sign up</Button>
          </form>
        

        </div>  
      </Modal>


      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
            <center>
            <h1>meme city</h1>
            </center>
            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) =>setEmail(e.target.value)}
            />
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) =>setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signIn}>Sign in</Button>
          </form>
        

        </div>  
      </Modal>

      <div className = 'app__header'>
        <div className= 'app__logo'>
          <img
            className = "app__headerImage"
            src='https://res.cloudinary.com/johnte/image/upload/v1612937605/jonslogo_yyhtwo.png'
            alt=''
          />
          <h1>
            meme city kenya
          </h1>
        </div>
        {user ? (
        <Button onClick={() => auth.signOut()}>Logout</Button>
      ) : (
        <div className='app__loginContainer'>
          <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
          <Button onClick={() => setOpen(true)}>Sign up</Button>

        </div>
       
      )}
      </div>

      <div className= 'app__intro'>
        <h2>welcome to meme city</h2> 
        <h3>your number one source of memes in kenya.</h3>
        <h4><p>Sit back 
        relax and enjoy,</p></h4>
        also you can sign up (you dont have to use your real name or email)
        <p>and post your favourite memes</p>
      </div>
      
      <div className='app__posts'>
        {
          posts.map(({id, post}) => (
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
        }
      </div>
      
     
      {user?.displayName? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )}
      


      
 
    </div>
  );
}

export default App;
