let body = document.querySelector("body");
let modal = document.getElementById("img-modal");

function openImgModal() {
    modal.style.display = "flex";
    modal.classList.add("show");
    body.classList.add("modal-open");
}

function closeImgModal() {
    modal.style.display = "none";
    modal.classList.remove("show");
    body.classList.remove("modal-open");
}