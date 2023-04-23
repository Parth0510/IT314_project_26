import React, { useEffect } from 'react'
import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TextField } from '@mui/material';
import axios from 'axios';
import {Alert} from '@mui/material';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileBase64 from 'react-file-base64';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import Container from '@mui/material/Container';
// import CssBaseline from '@mui/material/CssBaseline';
import Avatar from '@mui/material/Avatar';



const set = (keyName, keyValue, ttl) => {
  const data = {
      value: keyValue,                  // store the value within this object
      ttl: Date.now() + (ttl * 1000),   // store the TTL (time to live)
  }
  localStorage.setItem(keyName, JSON.stringify(data));
};

  const get = (keyName) => {
  const data = localStorage.getItem(keyName);
  if (!data) {     // if no value exists associated with the key, return null
      return null;
  }
  const item = JSON.parse(data);
  if (Date.now() > item.ttl) {
      localStorage.removeItem(keyName);
      return null;
  }
  return item.value;
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Material = ({announcements, course, instructor }) => {
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [changed,setChanged] = useState(false);
  

    const [open, setOpen] = React.useState(false);
    const [error1, setError1] = useState(null);
    const [title,setTitle] = useState('');
    const [item,setItem] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
      axios.get(`http://localhost:5000/course/material/${course._id}`,{headers:{'Authorization': get('token')}})
      .then((resp)=>{   // if no error
        console.log("UseEffect :\n");
        console.log(resp);
        setTimeout(()=>{
        },10)
        setRows(resp.data.data);
        console.log(rows);
      })
      .catch((err)=>{
        console.log(err);
        setError(err.response.data.error);
      })
    },[changed]);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

  const handleSave = () => {
    
    console.log({
      filename : title,
      description : description,
      data : item
    });
    axios.post(`http://localhost:5000/course/material/${course._id}`,{
      filename : title,
      data : item,
    },{headers:{'Authorization':get('token')}})
    .then((resp)=>{   // if no error
      console.log("HandleSave:\n");
      console.log(resp);
      setOpen(false);
      setChanged(!changed);
    })
    .catch((err)=>{
      console.log(err);
      setError1(err.response.data);
    })
  }
  
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/course/material/${id}?course_id=${course._id}`,{headers:{'Authorization':get('token')}})
    .then((resp)=>{   // if no error
      console.log("HandleDelete:\n");
      console.log(resp);
      setOpen(false);
      setChanged(!changed);
    })
    .catch((err)=>{
      console.log(err);
      setError(err.response.data.message);
    })
  }

  const uploadFile = ({ target: { files } }) =>{
    console.log( files[0] )
    let data = new FormData();
    data.append( 'file', files[0] )

    const options = {
      onUploadProgress: (progressEvent) => {
        const {loaded, total} = progressEvent;
        let percent = Math.floor( (loaded * 100) / total )
        console.log( `${loaded}kb of ${total}kb | ${percent}%` );

        if( percent < 100 ){
          this.setState({ uploadPercentage: percent })
        }
      }
    }

    axios.post("", data, options).then(res => { 
        console.log(res)
        this.setState({ avatar: res.data.url, uploadPercentage: 100 }, ()=>{
          setTimeout(() => {
            this.setState({ uploadPercentage: 0 })
          }, 1000);
        })
    })
  }

  return (
    <div className="announcement">
      <>
        {/* <AddAnnouncement course={course} setchanged={setChanged} changed={changed}/> */}
        <div>
          <Button variant="outlined"  onClick={handleClickOpen}>
            Add Material
          </Button>
          {error ? <Alert severity="error">{error}</Alert> : ""}
          <div style={{padding:"10px"}}></div>
          <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
          >
            <AppBar sx={{ position: 'relative' }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                  New material
                </Typography>
                <Button autoFocus color="inherit" onClick={handleSave}>
                  save
                </Button>
              </Toolbar>
            </AppBar>
            <List>
              {/* <ListItem>
                <TextField fullWidth  id="standard-basic" label="file name" variant="filled" onChange={(e) => setTitle(e.target.value)}/>
              </ListItem>
              <Divider />
              <ListItem>
                <FileBase64
                  type="file"
                  multiple={false}
                  onDone={({ base64 }) => setItem( base64 )}
                  /> */}
                {/* <TextField fullWidth  id="standard-basic" label="Description" variant="filled" multiline rows={5} onChange={(e)=>setDescription(e.target.value)}/> */}
              {/* </ListItem> */}
              {error1 ? <Alert severity="error">{error1}</Alert> : ""}
              <Container component="main" maxWidth="xs">
                {/* <CssBaseline /> */}
                <Box
                  sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <ImportContactsOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    Add Material
                  </Typography>
                  <Box  noValidate sx={{ mt: 1 }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="title"
                      label="Title"
                      name="title"
                      autoComplete="title"
                      autoFocus
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                      margin="normal"
                      fullWidth
                      name="description"
                      label="Description"
                      type="description"
                      id="description"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <FileBase64
                      type="file"
                      multiple={false}
                      onDone={({ base64 }) => setItem( base64 )}
                    />
                    {/* <div className="add - material" > */}
                      
                      {/* <div className="content"> */}
                        {/* <div className="author"> */}
                          {/* <a href="#localhost"> */}
                            {/* <Button variant="outlined" noValidate sx={{ mt: 1 }}
                            margin="normal"
                            fullWidth
                            autoFocus> */}
                              {/* <input type="file" className = "item" onChange={uploadFile} /> */}
                              {/* <FileBase64
                                type="file"
                                multiple={false}
                                onDone={({ base64 }) => setItem( base64 )}
                              /> */}
                              {/* <h4 className="title">
                                {this.props.name}
                                <small>{this.props.userName}</small>
                              </h4> */}
                            {/* </Button>
                          </a>
                        </div> */}
                        {/* <p className="description text-center">{this.props.description}</p> */}
                      {/* </div> */}
                      {/* <div className="text-center">{this.props.socials}</div> */}
                    {/* </div> */}
                    <Button
                      type="submit"
                      fullWidth
                      onClick={handleSave}
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      UPLOAD FILE
                    </Button>
                    
                  </Box>
                </Box>
              </Container>
            </List>
          </Dialog>
        </div>
        <Box sx={{ width: '100%' }}>
          <Stack spacing={2}>
          {rows.map(announcement => 
            <Item>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={announcement.filename}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {/* {announcement.description} */}
                      </Typography>
                    </React.Fragment>
                  }
                />
                <IconButton edge="end" aria-label="delete">
                  <EditIcon />
                </IconButton>
                <Divider orientation="vertical" style={{paddingLeft:"10px",paddingRight:"10px"}}/>
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon onClick={() => handleDelete(announcement._id)}/>
                </IconButton>
              </ListItem>
            </Item>
          )}
          </Stack>
        </Box>
      </>
    </div>
  );
}

export default Material