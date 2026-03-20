// DATA STORAGE
let rooms = ["A1","A2","A3","B1","B2"];

let occupied = JSON.parse(localStorage.getItem("occupied")) || [];
let dirty = JSON.parse(localStorage.getItem("dirty")) || [];
let total = parseInt(localStorage.getItem("total")) || 0;
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

// INIT
function init(){
    let sel = document.getElementById("room");
    sel.innerHTML="";

    rooms.forEach(r=>{
        sel.add(new Option(r,r));
    });

    updateUI();
}

// SAVE
function save(){
    localStorage.setItem("occupied", JSON.stringify(occupied));
    localStorage.setItem("dirty", JSON.stringify(dirty));
    localStorage.setItem("total", total);
    localStorage.setItem("bookings", JSON.stringify(bookings));
}

// SIDEBAR
function toggleSidebar(){
    document.body.classList.toggle("open");
}

// NAV
function showSection(id){
    document.querySelectorAll("section").forEach(s=>s.style.display="none");
    document.getElementById(id).style.display="block";

    if(window.innerWidth < 768){
        document.body.classList.remove("open");
    }
}

// RENDER ROOM
function renderRooms(){
    let container = document.getElementById("room-container");
    container.innerHTML="";

    rooms.forEach(r=>{
        let status="available";
        if(occupied.includes(r)) status="occupied";
        if(dirty.includes(r)) status="dirty";

        let div=document.createElement("div");
        div.className="room "+status;
        div.innerText=r;

        container.appendChild(div);
    });
}

// BOOKING
function booking(){
    let name=document.getElementById("guest").value;
    let room=document.getElementById("room").value;
    let night=document.getElementById("night").value;

    if(!name||!night) return alert("Isi semua!");

    if(occupied.includes(room)){
        alert("Kamar sudah dipakai!");
        return;
    }

    let bill = night * 200000;

    occupied.push(room);
    bookings.push({name, room, bill, status:"in"});
    total += bill;

    save();
    updateUI();
}

// CHECKOUT
function checkout(index){
    let data = bookings[index];

    occupied = occupied.filter(r=>r!==data.room);
    dirty.push(data.room);

    bookings[index].status="out";

    save();
    updateUI();
}

// TABLE
function renderTable(){
    let table = document.getElementById("table");
    table.innerHTML="";

    bookings.forEach((b,i)=>{
        let row = table.insertRow();
        row.innerHTML=`
            <td>${b.name}</td>
            <td>${b.room}</td>
            <td>${b.bill}</td>
            <td>${b.status}</td>
            <td>
                ${b.status==="in" ? `<button onclick="checkout(${i})">Out</button>` : "-"}
            </td>
        `;
    });
}

// UPDATE UI
function updateUI(){
    document.getElementById("total-rev").innerText = total;
    document.getElementById("occ-count").innerText = occupied.length;

    renderRooms();
    renderTable();
}

// RUN
init();
