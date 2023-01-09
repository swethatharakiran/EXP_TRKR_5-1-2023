const f2=document.getElementById('loginform');
f2.addEventListener("submit",onloginsubmit);

async function onloginsubmit(e){
    e.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const obj2={
        email:email,
        password:password
    }
    try{
    const response=await axios.post("http://localhost:3000/login",obj2)
    
    alert(response.data.message); 
    localStorage.setItem('token',response.data.token);
    window.location.href="expense.html";
    
    }
    catch(err){console.log(err)
        document.body.innerHTML+=`<div style="color:red">${err.message}</div>`
        
    
    };
}