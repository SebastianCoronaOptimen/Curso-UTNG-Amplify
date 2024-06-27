import './App.css';
import { Amplify } from "aws-amplify";
import amplifyconfig from './aws-exports';
import { DataStore } from 'aws-amplify/datastore';
import { Todo } from './models';
import { useEffect, useState } from 'react';
import { Card, CardActions, CardContent, Typography, Button, Grid, Box, TextField, Modal } from '@mui/material';
import image from './assets/Titulo.png'


Amplify.configure(amplifyconfig);

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {

  const [data, setData] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({})

  const handleOpen = (item) => {
    setName(item.name)
    setDescription(item.description)
    setCurrentItem(item)
    setOpen(true)
  };
  const handleClose = () => {
    setOpen(false)
    setName('')
    setDescription('')
  };

  useEffect(() => {
    queryTodo()
  }, [])

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }
  

  async function createTodo(){
    await DataStore.save(
      new Todo({
      "name": name,
      "description": description
    })
  );
  setName('')
  setDescription('')
  queryTodo()
  }

  async function queryTodo(){
    const models = await DataStore.query(Todo);
    setData(models)
    console.log(models);
  }

  async function updateTodo(){
    const original = await DataStore.query(Todo, currentItem.id)
    await DataStore.save(Todo.copyOf(original, item => {
      item.name = name
      item.description = description
    }));
    queryTodo()
    handleClose()
  }

  async function deleteTodo(item){
    const modelToDelete = await DataStore.query(Todo, item.id);
    DataStore.delete(modelToDelete);
    queryTodo()
  }

  return (
    <div className="App">
      <div style={{display:'flex', justifyContent:'space-between'}}>
      <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '50ch' },
        alignContent:'center',
        pl:2
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          required
          id="outlined-required"
          label="Name"
          defaultValue=""
          value={name}
          color='secondary'
          focused
          onChange={handleNameChange}
        />
        <TextField
          required
          id="outlined-required"
          label="Description"
          defaultValue=""
          color='secondary'
          focused
          value={description}
          onChange={handleDescriptionChange}
        />
        </div>
        <Button variant="contained" size='large' onClick={createTodo} sx={{backgroundColor:'purple',}}>Create Todo</Button>
        </Box>
        <img src={image} alt='Titulo' style={{height:250, marginTop:-37}}></img>
        </div>
      <div style={{marginTop:-50}}>
      <Box sx={{ flexGrow: 1 , p:4}}>
        <Grid container spacing={2}>
        {
          data.map((item)=>{
            return <Grid xs={4}>            
            <Card sx={{ maxWidth: 345, m:2, borderColor:'purple', borderTop:'solid 4px purple'}}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{color:'#3B126B'}}>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{color: '#3B126B'}}>
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color='secondary' onClick={()=>handleOpen(item)}>Update</Button>
                <Button size="small" color='secondary' onClick={()=>deleteTodo(item)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
          })
        }
        </Grid>
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <TextField
            focused
            color='secondary'
            sx={{p:1}}
            required
            id="outlined-required"
            label="Name"
            defaultValue={currentItem.name}
            onChange={handleNameChange}
          />
          <TextField
            focused
            color='secondary'
            fullWidth
            sx={{p:1}}
            required
            id="outlined-required"
            label="Description"
            defaultValue={currentItem.description}
            onChange={handleDescriptionChange}
          />
          <Button variant="contained" size='large' onClick={()=>updateTodo()} sx={{backgroundColor:'purple',m:1}}>Update Todo</Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default App;
