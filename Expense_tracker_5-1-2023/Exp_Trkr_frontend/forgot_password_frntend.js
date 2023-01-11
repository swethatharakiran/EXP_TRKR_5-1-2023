const fp=document.getElementById('fp_form');
fp.addEventListener('submit',recoverpassword);

async function recoverpassword(e){
    e.preventDefault();
    const email=document.getElementById('email').value ;
    const obj1={
        email:email
    }
    try{
    await axios.post("http://localhost:3000/password/forgotpassword",obj1)
    }
    catch(err){
        console.log(err)}
    
}