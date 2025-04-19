require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
app=express();
app.use(express.json());
app.use(cors());
const PORT=3000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(()=>console.log('MongoDb connected'))
    .catch((err)=>console.log(err));
const todoSchema=new mongoose.Schema({title:{
    type:String,required:true},
    description:{
        type:String,required:true}
});
const todoModel=mongoose.model('Todo',todoSchema);  

app.get('/getTodos',async(req,res)=>{
    try{
        const todos=await todoModel.find();
        res.status(200).json(todos);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
})
app.post('/addTodos', async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTodo = new todoModel({ title, description });
        await newTodo.save();
        res.status(201).json({ message: "Todo added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/updateTodo/:id',async(req,res)=>{
    try{
        const todo=req.body;
        const id=req.params.id;
        const updatedTodo=await todoModel.findByIdAndUpdate(id,todo,{ new: true });
        if(!updatedTodo){
            return res.status(500).json({message:'Not available in db'});
        }
        res.status(200).json({ message: 'Todo updated successfully', updatedTodo }); 

    }
    catch(error){
        res.status(500).json({message:error.message});
    }
})
app.delete('/deleteTodo/:id',async(req,res)=>{
    try{
        const id=req.params.id;
        const deletedTodo=await todoModel.findByIdAndDelete(id);
        if(!deletedTodo){
            return res.status(500).json({message:'Not availablle in db'});
        }
        res.status(200).json({message:'Todo deleted successfully'});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }

})
    
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})