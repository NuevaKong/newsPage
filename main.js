let newsList = []
let menus = document.querySelectorAll(".menus button")
let sideMenus = document.querySelectorAll(".menus-side button")
menus.forEach(menu => menu.addEventListener("click", (event)=>  getNewsByCategory(event)))
sideMenus.forEach(menu => menu.addEventListener("click", (event)=> getNewsBySideCategory(event)))
let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`)
let totalResults = 0
let page = 1
const pageSize = 10
const groupSize = 5

const getNews = async ()=> {
  try{
    url.searchParams.set("page", page) // => &page = page
    url.searchParams.set("pageSize", pageSize)

    let response = await fetch(url)
    let data = await response.json()
    console.log("ddd",data)
    if(response.status === 200){
      if(data.articles.length === 0){
        throw new Error("No result for this search")
      }
      newsList = data.articles
      totalResults = data.totalResults
      render()
      paginationRender()
    } else{
      totalPages = 0
      page = 0
      paginationRender()
      throw new Error(data.message)
    }
  } catch(error){
    errorRender(error.message)
    totalPages = 0
    page = 0
    paginationRender()

  }
}

const getLatestNews = async () => {
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`)
    getNews()
}

getLatestNews();

const getNewsByCategory = async (event)=>{
  const category = event.target.textContent.toLowerCase()
  console.log("category ", category)
  page = 1
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`)
  getNews()
}

const getNewsBySideCategory = async (event)=>{
  const category = event.target.textContent.toLowerCase()
  console.log("category", category)
  page = 1
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`)
  getNews()
  closeNav()
}

const searchNews = async () => {
  const keyword = document.getElementById("search-input").value
  console.log("keyword", keyword)
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`)
  getNews()
}

const render=()=>{
    const newsHTML = newsList.map(news=>`<div class="row news">
          <div class="news-img col-lg-4">
            <img
              class="news-img-size"
              src="${news.urlToImage || 'https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg'}"
              onerror="this.onerror=null; this.src='https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg';"/>
          </div>
          <div class="col-lg-8">
            <h2>${news.title}</h2>
            <p>${news.description == null || news.description == ""
                ? "No content"
                : news.description.length >200
                ? news.description.substring(0, 200) + "..."
                : news.description
            }</p>
            <div>${news.source.name || "no source"} * ${moment(news.publishedAt).fromNow()}</div>
          </div>
        </div>`)
    .join("")
    document.getElementById('news-board').innerHTML=newsHTML
}


const errorRender = (errorMessage) => {
    const errorHTML = `<div class="alert alert-danger" role="alert">
      ${errorMessage}
    </div>`

    document.getElementById('news-board').innerHTML=errorHTML
}

const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
  };
  
  const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
  };
  

  const openSearchBox = () => {
    let inputArea = document.getElementById("input-area");
    if (inputArea.style.display === "inline") {
      inputArea.style.display = "none";
    } else {
      inputArea.style.display = "inline";
    }
  };
  

  const paginationRender = () =>{
    let paginationHTML=``
    
    const totalPages = Math.ceil(totalResults/pageSize)

    let pageGroup = Math.ceil(page/groupSize)

    let lastPage = pageGroup*groupSize

    if (lastPage > totalPages){
      lastPage = totalPages
    }

    const firstPage = lastPage-(groupSize-1)<=0? 1: lastPage-(groupSize-1)

    if (page > 1) {
      paginationHTML = `<li class="page-item" onclick="moveToPage(1)"><a class="page-link" href="#"> &lt;&lt; </a></li>
          <li class="page-item" onclick="moveToPage(${page - 1})"><a class="page-link" href="#">&lt;</a></li>`;
  }

    for(let i=firstPage; i<=lastPage; i++){
      paginationHTML+=
       `<li class="page-item ${i===page? "active":""}" onclick="moveToPage(${i})"><a class="page-link" href="#">${i}</a></li>`
    }

    if (page < totalPages) {
      paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})"><a class="page-link" href="#"> &gt; </a></li>
          <li class="page-item" onclick="moveToPage(${totalPages})"><a class="page-link" href="#"> &gt;&gt; </a></li>`;
  }

    document.querySelector(".pagination").innerHTML = paginationHTML
  }

const moveToPage = (pageNum) =>{
  console.log("moveToPage", pageNum)
  page = pageNum
  getNews()
}