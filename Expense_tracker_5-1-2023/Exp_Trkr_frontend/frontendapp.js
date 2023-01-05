const f1=document.getElementById('form1');
f1.addEventListener("submit",onsubmit);

function onsubmit(e){
    e.preventDefault();
    const username=document.getElementById('username').value;
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    document.getElementById('username').value="";
    document.getElementById('email').value="";
    document.getElementById('password').value="";
obj1={
    username:username,
    email:email,
    password:password
}
axios.post('http://localhost:3000/user/signup',obj1)
.then(res=>{
    console.log(res.data);
    
})
.catch(err=>{
    console.log(err);
})
}


