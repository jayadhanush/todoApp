    import {useState,useEffect} from 'react';
    import './TodoComponet.css';
        function TodoComponent(){
        const [title,setTitle]=useState('');
        const [description,setDescription]=useState('');
        const [todos,setTodos]=useState([]);
        const [error,setError]=useState('');
        const [message,setMessage]=useState("");
        const apiUrl=import.meta.env.VITE_API_URL;

        const [editId,setEditId]=useState(-1);
        const [editTitle,setEditTitle]=useState('');    
        const [editDescription,setEditDescription]=useState('');
        const handleSubmit=(event)=>{
            event.preventDefault();
            setError("");
            if(title.trim()!=="" && description.trim()!==""){
                fetch(apiUrl+'addTodos',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({title,description})
                })
                .then((res)=>res.json())
                .then((data)=>{
                    if(data.message){
                        setMessage(data.message);
                        setTodos([...todos,{title,description}]);
                        setTimeout(()=>{
                            setMessage("");
                        },2000);
                        setTitle('');
                        setDescription('');
                    }
                    else{
                        setError("Error adding todo");
                    }
                })
            }

        }
        useEffect(()=>{getData()},[]);
        const getData=()=>{
            fetch(apiUrl+'getTodos')
            .then((res)=>res.json())
            .then((data)=>{
                setTodos(data);
            })
            .catch((err)=>{
                setError("Error fetching todos");
            })
        }
        const handleEdit=(todo)=>{
            setEditId(todo._id);
            setEditTitle(todo.title);
            setEditDescription(todo.description);

        }
        const handleUpdate=()=>
        {
            setError("");
            if(editTitle.trim()!=="" && editDescription.trim()!==""){
                fetch(apiUrl+'updateTodo/'+editId,{
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({title: editTitle,description: editDescription})
                })
                .then((res)=>
                {
                    if(res.ok)
                    {
                        setTodos(todos.map((todo)=>
                        {if(todo._id===editId){
                            todo.title=editTitle;
                            todo.description=editDescription;
                            }
                            return todo;
                        } 
                        
                          

                    ))
                        setEditId(-1);
                        setEditTitle('');
                        setEditDescription('');
                        setMessage("Todo updated successfully");
                        setTimeout(()=>{
                            setMessage("");
                        },2000);
                    }
                    else{
                        setError("Error updating todo");
                    }
                })
            }
        }
        const handleDelete=(id)=>{
            setError("");
            fetch(apiUrl+'deleteTodo/'+id,{
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then((res)=>{
                if(res.ok){
                    setTodos(todos.filter((todo)=>todo._id!==id));
                    setMessage("Todo deleted successfully");
                    setTimeout(()=>{
                        setMessage("");
                    },2000);
                }
                else{
                    setError("Error deleting todo");
                }
            })
            .catch((err)=>{
                setError("Error deleting todo");
            })
        }

        return(
            <>
            <div className="header">
                <h1>Todo App</h1>
                <p>Get it done</p>
            </div>
            <form>
                {error && <p className="error">{error}</p>}
                {message && <p className="message">{message}</p>}
                <div>
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                </div>
                <div>
                <label htmlFor="description">Description:</label>
                <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                </div>
                <button type="submit" onClick={handleSubmit}>Add Todo</button>
            </form>
            <div className="todo-list">
                <h2>TASKS</h2>
                <ul>
                    {todos.map((todo) => (
                        <li key={todo._id}>
                            {editId ==-1 || editId!== todo._id?<><h3>{todo.title}</h3>
                            <p>{todo.description}</p></>
                            :
                            <div key={todo._id}>
                                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                                <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                            </div>}
                            <div>
                                {editId == -1 ?<button onClick={() => handleEdit(todo)}>Edit</button>: <button onClick={(handleUpdate)}>Update</button>}
                                <button onClick={() => handleDelete(todo._id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>

                </div>
            </>
        );
    }
    export default TodoComponent;
