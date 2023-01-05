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
const obj1={
    username:username,
    email:email,
    password:password
}
axios.post('http://localhost:3000/user/signup',obj1)
    .then(response=>{console.log(response.data);
    alert(response.data.message);
    })
    
.catch(err=>{
    console.log((err));
    document.body.innerHTML+=`<div style="color:red">${err.message}</div>`
})
}


