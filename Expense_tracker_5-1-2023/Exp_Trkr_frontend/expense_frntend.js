const f3=document.getElementById('expenseform');
const ul=document.getElementById('expenselist');

f3.addEventListener("submit",addexpense);
async function addexpense(e){
    e.preventDefault();
    const expense={
        amount:document.getElementById('amount').value,
        desc:document.getElementById('desc').value,
        category:document.getElementById('category').value

    }
    try{
    const response=await axios.post("http://localhost:3000/expense/add-expense",expense)
    alert("added successfully");
    //console.log(response.data);
    showlist(response.data);
    }
    catch(err){
        document.body.innerHTML+=`<div "style=color:red">${err.message}</div>`
    }
}

function showlist(obj){
   console.log(obj);

    ul.innerHTML+=`<li class='item' id="${obj.id}">
    ${obj.amount}-${obj.desc}-${obj.category} 
    <button class='btn btn-primary' onclick='delete_exp(${obj.id})'>Delete</button>
    <button class='btn btn-primary' onclick='edit_exp(${obj.id})'>Edit</button></li>`;
    
}

function delete_exp(id1){
    axios.get(`http://localhost:3000/expense/delete-expense/${id1}`)
    .then(()=>{
        const childnode=document.getElementById(id1)
        ul.removeChild(childnode);
    })
    .catch(e=>console.log(e))
    
}

function edit_exp(id1){
    axios.get(`http://localhost:3000/expense/edit-expense/${id1}`)
    .then((response)=>{
        document.getElementById('amount').value=response.data.amount;
        document.getElementById('desc').value=response.data.desc;
        document.getElementById('category').value=response.data.category;
        delete_exp(id1);
    })
}

window.addEventListener('DOMContentLoaded',getdata);

function getdata(){
    axios.get("http://localhost:3000/expense/get-expense/")
    .then((result)=>{
        console.log(result.data.allexpense);
        for(let i=0; i<result.data.allexpense.length;i++){
            showlist(result.data.allexpense[i]);
        }
    })
    .catch(err=>console.log(err));
}