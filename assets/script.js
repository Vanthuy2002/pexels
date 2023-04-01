let apiImage = "https://api.pexels.com/v1/curated?";
let apiKey = "3CpFBdnUh1S6H9uhyLqRbPxCq7mPH7KF81o84vCK5l9aSmtQ03UHrBDV";
let galery = document.querySelector(".galery__images");
let load = document.querySelector(".load");
let search = document.querySelector("input[type=text]");
let searchBtn = document.querySelector(".btn");
let modal = document.querySelector(".modal");
let imgSrcModal = document.querySelector(".previews");
let photographer = document.querySelector(".info span");
let searchValue = null;
let page = 1;
let num = 10;

document.body.onclick = (e) => {
  if (e.target.closest(".modal-overlay")) {
    modal.classList.add("hide");
  } else if (e.target.closest(".btn__info")) {
    downloadImg(imgSrcModal.src);
  }
};

async function getImage(api) {
  try {
    let reponse = await fetch(api, {
      headers: { Authorization: apiKey },
    });
    let data = await reponse.json();

    function render() {
      let html = data.photos.map((image) => {
        return `<li class="card__image">
          <img src=${image?.src.large} alt="${image.photographer}"/>
          <div class="details">
            <img src="./assets/images/user.svg" alt="" />
            <span>${image?.photographer}</span>
            <button class="download" data-src=${image.src.large}>
              <img src="./assets/images/download.svg" alt="" />
            </button>
          </div>
        </li>`;
      });
      galery.insertAdjacentHTML("beforeend", html.join(""));
    }
    return render();
  } catch (error) {}
}
getImage(`${apiImage}page=${page}&per_page=${num}`);

async function loadMore() {
  load.textContent = "Loading...";
  let apiUrl = `${apiImage}page=${page}&per_page=${num}`;
  apiUrl = searchValue
    ? `https://api.pexels.com/v1/search?query=${searchValue}&page=${page}&per_page=${num}`
    : apiUrl;
  await getImage(apiUrl);
  load.textContent = "Load More";
}

load.onclick = () => {
  page++;
  loadMore();
};

searchBtn.onclick = () => {
  galery.innerHTML = "";
  searchValue = search.value;
  getImage(
    `https://api.pexels.com/v1/search?query=${searchValue}&per_page=${num}`
  );
};

galery.addEventListener("click", (e) => {
  if (e.target.closest(".download")) {
    let downImg = e.target.closest(".download");
    downloadImg(downImg.dataset.src);
  } else if (e.target.closest(".card__image")) {
    showModal(e.target.src, e.target.alt);
  }
});

async function downloadImg(imgUrl) {
  //fetch data , trả về kiểu blob
  let reponse = await fetch(imgUrl);
  let data = await reponse.blob();
  //tạo chức năng download
  let a = document.createElement("a");
  a.href = URL.createObjectURL(data);
  a.download = new Date().getTime();
  a.click();
}

function showModal(urlImg, name) {
  modal.classList.remove("hide");
  imgSrcModal.src = urlImg;
  photographer.textContent = name;
}

function hideModal() {
  modal.classList.add("hide");
}
