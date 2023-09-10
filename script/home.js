
// -------------VAR--------------
const url = "https://tarmeezacademy.com/api/v1/";
let numberOfPostPages;
let curentPage = 1;
let checkedRequest = false;
let checkedAddImage = false;
let persentageScroll = 0;
let postIdEdit = ''

// ------------------# FUNCTIONS #-------------------------
setupUi();
// ------------------//# FUNCTIONS #//-------------------------

// ----------------&& SETUP SCROLL &&----------------------------
window.addEventListener('scroll', setupScroll)
let checkScrollTop = 0
function setupScroll(){
  let checked = true
  if(window.scrollY > checkScrollTop){
    checked = true   
  }else{
    checked = false
  }
  navtoggle(checked)
  btnUpToggle(checked)
  checkScrollTop = window.scrollY
}

// ----------------NAV TOGGEL----------------------------
function navtoggle(checked){
  let nav = document.getElementById('nav')

  if(window.scrollY > 80 && checked ){
    nav.style.transform = 'translateY(-200px)'
  }else{
    nav.style.transform = 'translateY(0px)'
  }
}
// ----------------//NAV TOGGEL//-------------------------

// ----------------SCROLL UP-----------------------------
function btnUpToggle(checked){
  let btn = document.getElementById('btn-up')
  let tarmeez = document.getElementById('tarmeez')
  if(window.scrollY > window.innerHeight){
    if(checked){
      btn.style.transform = 'translateY(120px)'
      tarmeez.style.transform = 'translate(-50%,120px)'
    }else{
      btn.style.transform = 'translateY(0px)'
      tarmeez.style.transform = 'translate(-50%,0)'
    }
  }else{
    btn.style.transform = 'translateY(120px)'
    tarmeez.style.transform = 'translate(-50%,120px)'
  } 
}

function scrollUp(){
  window.scrollTo({
      top: 0,
      behavior: "smooth"
  })
}
// ----------------//SCROLL UP//--------------------------
// ----------------&& //SETUP SCROLL// &&-----------------


// -------------------infiniteScroll----------------------
window.addEventListener("scroll", infiniteScroll);
function infiniteScroll() {
  const persentagePointRequest = 80;
  let offsetHeight = (window.scrollY + window.innerHeight) * 100;
  persentageScroll = offsetHeight / document.body.clientHeight;
  if (
    persentageScroll >= persentagePointRequest &&
    curentPage < numberOfPostPages &&
    checkedRequest
  ) {
    curentPage++;
    postsRequest(curentPage);
    checkedRequest = false;
  }
}
// -------------------//infiniteScroll//--------------------

// ---------------LOADING---------------------
function loadingToggle(show = true) {
  let loading = document.getElementById('loading')
  if (show) {
    loading.style.visibility = 'visible'
  } else {
    loading.style.visibility = 'hidden'
  }
}
// ---------------//LOADING//---------------------

// --------------------POPUP ALERT--------------------
function popUpAlert(message, type = 'success') {
  let alertContainer = document.getElementById('alert-container')
  function chekedMarkType() {
    if (type == "success") {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                </svg>`;
    } else {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                </svg>`;
    }
  }
  alertContainer.innerHTML = `   
    <div class="alert alert-${type} fade show mb-0  p-1 d-flex align-items-center" role="alert" id="success-alert">
        ${chekedMarkType()}
        <p class="ps-2 m-0 ">
            ${message}   
        </p>
    </div>
    `;

  setTimeout(() => {
    const alert = bootstrap.Alert.getOrCreateInstance("#success-alert");
    alert.close();
  }, 3000);
}
// --------------------//POPUP ALERT//----------------

// ---------------TOGGLE MODAL ------------------------
function toggleModal(modalId) {
  let modal = document.getElementById(modalId);
  let modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.toggle()
}
function toggle(modalId){
  let deleteModal = new bootstrap.Modal(document.getElementById(modalId))
  deleteModal.toggle()
}
// ---------------//TOGGLE MODAL //---------------------

// -------------------STORAGE USER DATA IN LOCALSTORAGE----------
function storageUserData(response) {
  let token = response.data.token;
  let user = response.data.user;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}
// ------------------//STORAGE USER DATA IN LOCALSTORAGE//------

// -------------------SHOW && ADD COMMENTS----------------------
function showComments(postId) {
  axios.get(`${url}posts/${postId}`)
    .then((response) => {
      let com
      let comments = response.data.data.comments;
      let containerComents = document.getElementById(`containerComments${postId}`);
      containerComents.innerHTML = "";
      comments.forEach((comment) => {
        containerComents.innerHTML += `
          <div class='d-flex align-items-top gap-1  mt-2 p-2 pt-0 rounded-2'>
          <img src='${checkedOwenImage(comment.author.profile_image)}' class="rounded-circle bg-dark flex-shrink-0" width="30" height="30">
              <div class="rounded-2 p-2 pt-0"style='background: #ffefef' >
                  <a href='#' class='text-decoration-none text-info'>${comment.author.name}</a>
                  <div class='pl-2' style='color: gray;'>${comment.body}</div>
                  </div>
          </div>
          `;
      })
    })
    .catch((error) => {
      let messageError = error.response.data.message;
      popUpAlert(messageError, "danger");
    })
}

function addNewComment(postId) {
  let newComment = document.getElementById("input-add-comment" + postId);
  let token = localStorage.getItem("token");
  let params = {
    body: newComment.value,
  };
  let header = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  loadingToggle(true)
  axios
    .post(`${url}posts/${postId}/comments`, params, header)
    .then(() => {
      showComments(postId);
      popUpAlert("add comment succussfull");
      newComment.value = "";
    })
    .catch((error) => {
      newComment.value = "";
      let message = error.response.data.message;
      popUpAlert(message, "danger");
    })
    .finally(() => {
      loadingToggle(false)
    })
}
// -------------------//SHOW && ADD COMMENTS//-------------------

// --------------------CHECKED OWEN IMAGE------------------------
function checkedOwenImage(image) {
  const alternativeImage = "./pics/profile-pics/profile.jpeg"
  if (typeof (image) == 'string') {
    return image
    return post.author.profile_image
  } else {
    return alternativeImage
  }
}
// --------------------//CHECKED OWEN IMAGE//--------------------

// --------------------GO TO PROFILE------------------------
function goToProfile(userId) {
  return (
    `./profile.html?user=${userId}`
  )
}
// --------------------//GO TO PROFILE//------------------------


// ------------------GET USER DATA-------------------
function userData() {
  if (localStorage.getItem('user')) {
    let user = JSON.parse(localStorage.getItem('user'))
    return user
  }
  return {}
}
// ------------------//GET USER DATA//-------------------

// ---------------------BTNS CONTROL MY POSTS (EIDT && DELETE)-----------
function btnControl(post) {
  return (`
    <div>
      <button type='button' class='btn btn-secondary' onclick='openEditPost(${JSON.stringify(post)})'>Edit</button>
      <button type='button' class='btn btn-danger ' onclick='openDeletePost(${post.id})'>delete</button>
    </div>`
  )
}
// ---------------------//BTNS CONTROL MY POSTS (EIDT && DELETE)//-----------

// -----------------OPEN MODAL EIDT POST--------------------
function openEditPost(post) {
  postIdEdit = post.id
  document.getElementById('create-post').innerHTML = 'Edit post'
  let title = document.getElementById("title-post");
  let body = document.getElementById("description-post");
  title.value = post.title
  body.value = post.body
  toggle('create-post-modal')
}
// -----------------//OPEN MODAL EIDT POST//--------------------

// -----------------OPEN MODAL CREATE POST--------------------
function openCreatePost() {
  postIdEdit = ''
  document.getElementById('create-post').innerHTML = 'creat new post'
  let title = document.getElementById("title-post");
  let body = document.getElementById("description-post");
  title.value = ''
  body.value = ''
  toggle('create-post-modal')
}
// -----------------//OPEN MODAL CREATE POST//--------------------

// -----------------OPEN MODAL DELETE POST--------------------
function openDeletePost(postId) {
  toggle('delete-modal')

  let confirmDelete = document.getElementById('confirm-delete')
  confirmDelete.addEventListener('click', () => {
    token = localStorage.getItem("token");
    let header = {
      authorization: `Bearer ${token}`,
    };

    axios.delete(`${url}posts/${postId}`, { headers: header })
      .then(() => {
        toggleModal('delete-modal')
        document.getElementById(postId).style.display = 'none'
        popUpAlert('deleted successful', 'success')

      })
      .catch((error) => {
        let message = error.response.data.message
        popUpAlert(message,'danger')
      })

  })
}
// -----------------//OPEN MODAL DELETE POST//--------------------

// --------------------createPost--------------------
function createEditPost() {
  let title = document.getElementById("title-post").value;
  let body = document.getElementById("description-post").value;

  let dataPost = new FormData();
  dataPost.append("title", title);
  dataPost.append("body", body);

  token = localStorage.getItem("token");
  let header = {
    "content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };

  if (checkedAddImage) {
    let image = document.getElementById("pic-post").files[0];
    dataPost.append("image", image);

    checkedAddImage = false
  }

  function checkedRequest() {
    if (postIdEdit != '') {

      dataPost.append("_method", "put")
      return (
        axios.post(`${url}posts/${postIdEdit}`, dataPost, { headers: header })
      )

    } else {
      return (
        axios.post(`${url}posts`, dataPost, { headers: header })
      )
    }
  }
  loadingToggle(true)
  checkedRequest()
    .then(() => {
      setupUi()

      toggleModal("create-post-modal")
      popUpAlert("successfull create new post", "success");
    })
    .catch((error) => {
      let message = error.response.data.message
      popUpAlert(message,'danger')
    }).finally(()=>{
      loadingToggle(false)
    })


}

let BtnAddImage = document.getElementById('pic-post')
BtnAddImage.addEventListener('change', () => {
  checkedAddImage = true
})
// --------------------//createPost//--------------------

// ------------------------LOGIN--------------------------
function login() {
  let userName = document.getElementById("user-name").value;
  let password = document.getElementById("password").value;
  let params = {
    username: userName,
    password: password,
  };
  loadingToggle(true)
  // >>>>>REQUEST<<<<<
  axios
    .post(url + "login", params)
    .then((response) => {
      storageUserData(response)
      toggleModal("login-modal");
      popUpAlert("Login Successfull", "success");
      setupUi();
    })
    .catch((error) => {
      let message = error.response.data.message
      popUpAlert(message,'danger')
    })
    .finally(() => {
      loadingToggle(false)
    })
}
// ----------------------//LOGIN//----------------------
// ----------------------SIGN IN----------------------
function signup(){
  toggleModal("login-modal");
  toggle('register-modal')
}
// ----------------------//LOGIN//----------------------

// ---------------------- REGISTER------------------------
function register() {
  let username = document.getElementById("register-user-name").value;
  let password = document.getElementById("register-password").value;
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let image = document.getElementById("pic-profile").files[0];

  let registerUserData = new FormData();
  registerUserData.append("username", username);
  registerUserData.append("password", password);
  registerUserData.append("name", name);
  registerUserData.append("email", email);
  registerUserData.append("image", image);

  let header = {
    "content-Type": "multipart/form-data",
  };

  loadingToggle(true)
  axios
    .post(url + "register", registerUserData, { headers: header })
    .then((response) => {
      storageUserData(response)
      toggleModal("register-modal")
      setupUi();
      popUpAlert("Rgiester Successfull");
    })
    .catch((error) => {
      let messageError = error.response.data.message;
      popUpAlert(messageError, "danger");
    }).finally(() => {
      loadingToggle(false)
    })
}
// ----------------------//REGISTER//------------------------

// --------------------LOGOUT-----------------------------------
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUi();
  popUpAlert("Logout Successfull");
}
// --------------------//LOGOUT//-------------------------------

//======================== ** SETUP UI ** ========================
function setupUi() {
  let containerBtnPost = document.getElementById("container-btn-post");
  let btnsNav = document.getElementById("btns-nav");

  if (localStorage.getItem("token") == null) {
    btnsNav.innerHTML = `
      <button class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#login-modal" type="button">
          Login
      </button>
      <button class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#register-modal" type="button">
      Register
      </button>
    `;
    containerBtnPost.innerHTML = "";
  } else {
    btnsNav.innerHTML = `
      <button id="logout" class="btn btn-outline-success" type="button" onclick="logout()">
          Logout
      </button>
      <a role='button' class="text-decoration-none text-dark text-capitalize" href='${goToProfile(userData().id)}'>
        <img src='${checkedOwenImage(userData().profile_image)}'  alt="" class="rounded-circle" width="40" height="40">
      </a>
    `;
    containerBtnPost.innerHTML = `
      <button type="button" id="open-create-post" onclick="openCreatePost()" class="btn btn-primary shadow z-3 position-fixed bottom-0 end-0  rounded-circle fs-1 text-align-center m-5 d-flex align-items-center justify-content-center " style="width: 60px; height: 60px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
        </svg>
      </button>
    `;
  }

  postsRequest()
}
//========================// ** SETUP UI ** //========================

// ======================== ** POSTS REQUEST ** ========================
function postsRequest(page = 1) {
  loadingToggle(true)
  axios.get(`${url}posts?limit=10&page=${page}`)
    .then((response) => {
      let posts = response.data.data;
      let postsContainer = document.getElementById("posts-container");
      function addCommentHtml(post) {
        return ( `
        <div class="d-flex align-items-center gap-1 mt-1">
          <img src='${checkedOwenImage(userData().profile_image)}' class="rounded-circle bg-dark flex-shrink-0" width="40" height="40">
          <input type="text" class="form-control" id='input-add-comment${post.id}' placeholder='add new comment....' />
          <button type="button" class="btn btn-primary" onclick='addNewComment(${post.id})' >add</button>
        </div>
      `)
      }
      page == 1 ? postsContainer.innerHTML = '' : null;
      numberOfPostPages = response.data.meta.last_page;
      posts.forEach((post) => {
        let checkedOwenPost = post.author.id == userData().id
        let postHtml = `
          <div class="container col-lg-7 p-0" ${checkedOwenPost ? 'id="' + post.id + '"' : ''}>
            <div class="d-flex justify-content-center ">
              <div class="card border-0 my-3 w-100 shadow">

                <div class="card-header border-0 d-flex justify-content-between align-items-center">
                  <a role='button' class="text-decoration-none text-dark text-capitalize" href='${goToProfile(post.author.id)}'>
                  <img src="${checkedOwenImage(post.author.profile_image)}"  alt="" class="rounded-circle" width="40" height="40">
                  <b>${post.author.name}</b>
                  </a>
                  ${checkedOwenPost ? btnControl(post) : ''}
                </div>


                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.body}</p>
                    <img src="${post.image}" alt="" class="w-100 rounded-3 mt-1">  
                    <div class="text-body-secondary fs-6 px-2">${post.created_at}</div>
                </div>


                <div class="card-footer text-body-secondary">

                  <div class="accordion accordion-flush" id="accordionFlushExample ">
                    <div class="accordion-item " style="background-color: transparent !important">

                      <button  class="accordion-button collapsed d-flex  p-1 mb-2  gap-1 bg-light " type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample${post.id}" aria-expanded="false" aria-controls="flush-collapseOne" style="border-radius: 8px !important">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-text-wrap" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5Zm0 4a.5.5 0 0 1 .5-.5h9a2.5 2.5 0 0 1 0 5h-1.293l.647.646a.5.5 0 0 1-.708.708l-1.5-1.5a.5.5 0 0 1 0-.708l1.5-1.5a.5.5 0 0 1 .708.708l-.647.646H11.5a1.5 1.5 0 0 0 0-3h-9a.5.5 0 0 1-.5-.5Zm0 4a.5.5 0 0 1 .5-.5H7a.5.5 0 0 1 0 1H2.5a.5.5 0 0 1-.5-.5Z"/>
                        </svg>
                        <span>(${post.comments_count})</span>
                        <b>comments</b>
                      </button>

                      <div class="collapse" id="collapseExample${post.id}">
                        <div id='containerComments${post.id}' class="card card-body bg-light">
                          ${post.comments_count != 0 ? showComments(post.id) : "No comments yet , Add comment"}
                        </div>
                      <div>
                      ${isNaN(userData().id) ? '' : addCommentHtml(post)}               
                    </div>
                  </div>
                </div>
                      


              </div>
            </div>
          </div>
              
            
        `;

        postsContainer.innerHTML += postHtml;
      })
      checkedRequest = true;
    })
    .catch((error) => {
      let message = error.response.data.message
      popUpAlert(message,'danger')
    })
    .finally(() => {
      loadingToggle(false)
    })
}
// ========================// ** POSTS REQUEST ** //========================
