//const Razorpay=require('razorpay');
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
    const token=localStorage.getItem('token');
    const response=await axios.post("http://localhost:3000/expense/add-expense",expense,{headers:{"Authorization":token}})
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
    const token=localStorage.getItem('token');
    axios.get(`http://localhost:3000/expense/delete-expense/${id1}`,{headers:{"Authorization":token}})
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

window.addEventListener('DOMContentLoaded',()=>{ //getdata() to get expenses
    const page=1;
    
        const token=localStorage.getItem('token');
        const decodedtoken=parseJwt(token);
        const ispremiumuser=decodedtoken.ispremiumuser;
        if(ispremiumuser){
            const btn1=document.getElementById('razorpay-btn');
            btn1.remove();
            document.getElementById('premium').innerHTML=`<div><b>You are a premium user now</b></div>`
            showleaderboard();   
    
        }
        else{
            const b2=document.getElementById('downloadexpense');
            b2.remove();
        }
        getexpenses(page);
    });

function getexpenses(page){
        const ul=document.getElementById('expenselist');
        ul.innerText="";
        
        const token=localStorage.getItem('token');
        axios.get(`http://localhost:3000/expense/get-expense?page=${page}`,{headers:{"Authorization":token}})
        .then((result)=>{

            console.log(result.data);//all exp in that page
            for(let i=0; i<result.data.allexpenses.length;i++){
                showlist(result.data.allexpenses[i]);
            }
            showpagination(result.data);
            //console.log(result.data.allexpense);
            
            //console.log("FROM FRONTEND",result.data.downloadedfilesurl.length);
            //for(let i=0; i<result.data.downloadedfilesurl.length;i++){
              //  listofurls(result.data.downloadedfilesurl[i]);
            //}
    
        })
        .catch(err=>console.log(err));
    
    
    //function listofurls(link){
      //  var ul=document.getElementById('downlodedfiles');
        //var a = document.createElement("a");
          //      a.href = link.fileURL;
            //   a.download = "myexpense";
        //ul.appendChild(a);
         
    //}
}


function showpagination(data){
    const currentpage=data.currentpage;
    const hasnextpage=data.hasnextpage;
    const nextpage=data.nextpage;
    const haspreviouspage=data.haspreviouspage;
    const previouspage=data.previouspage;
    const lastpage=data.lastpage;
    const pagination=document.getElementById('pagination');
    pagination.innerHTML='';

    if(haspreviouspage){
        const prev_btn=document.createElement('button');
        prev_btn.innerHTML=previouspage;
        prev_btn.class="btn btn-secondary";
        prev_btn.addEventListener('click',()=>getexpenses(previouspage))
        pagination.appendChild(prev_btn);
    }

    const curr_btn=document.createElement('button');
    curr_btn.class="btn btn-secondary";
    curr_btn.innerHTML=`<h3>${currentpage}</h3>`;
    curr_btn.addEventListener('click',()=>getexpenses(currentpage));
    pagination.appendChild(curr_btn);

    if(hasnextpage){
        const nxt_btn=document.createElement('button');
        nxt_btn.class="btn btn-secondary";
        nxt_btn.addEventListener('click',()=>getexpenses(nextpage));
        pagination.appendChild(nxt_btn);
    }
    const last_btn=document.createElement('button');
    last_btn.class="btn btn-secondary";
    last_btn.innerHTML=`<h3>${lastpage}</h3>`;
    last_btn.addEventListener('click',()=>getexpenses(lastpage));
    pagination.appendChild(last_btn);

}

document.getElementById('razorpay-btn').onclick=async function(e){
    e.preventDefault();
    const token=localStorage.getItem('token');//userid
   
    
     const obj1={};
     const response=await axios.post("http://localhost:3000/purchase/buymembership",obj1,
     {headers:{"Authorization":token}})
     console.log("checking for paymentid");
     console.log(response.data.order.id);
     var options=
     {
        "key":response.data.key_id,
        "orderid":response.data.order.id,
        "handler": async function(response){
            const result=await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
                orderid:options.orderid,
                paymentid:response.razorpay_payment_id,
            }, {headers:{"Authorization":token}})

            alert("You are a premium user now!!")
            document.getElementById('razorpay-btn').style.visibility="hidden";
            
            document.getElementById('premium').innerHTML+=`<div><b>You are a premium user now</b></div>`
            localStorage.setItem('token',result.data.token);
            showleaderboard();
        }
    }

    const rzp1=new Razorpay(options);
    
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed',function(response){
        //console.log(response);
        alert("Something went wrong");
    });
  
    
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function showleaderboard(){
    const lb_btn=document.createElement('input');
    lb_btn.type="button";
    lb_btn.value="Leaderboard";
    document.getElementById('premium').appendChild(lb_btn);
    lb_btn.onclick=async()=>{
        const token=localStorage.getItem('token');
        const lb_array=await axios.get("http://localhost:3000/premium/showleaderboard",
        {headers:{"Authorization":token}})

        var lb_ele=document.getElementById('leaderboard');
        lb_ele.innerHTML+=`<h2>Leader board</h2>`
        console.log("HELLO")
        console.log(lb_array);
        lb_array.data.forEach(userdetails => {
            console.log(userdetails);
            lb_ele.innerHTML+=`<li> Name-${userdetails.username} Total: ${userdetails.total}</li>`;
        });

    }

}


function download(){
    const token=localStorage.getItem('token');
    axios.get('http://localhost:3000/download', { headers: {"Authorization" : token} })
    .then((response) => {
        console.log("HELLO--")
        if(response.status === 201){
            console.log(response.data);
            //backend is sending a download link
            // open in browser, the file would download
            var a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = "myexpense";
            a.click();
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        console.log(err);
    });
}