let newsList = []
const menus = document.querySelectorAll(".menus button")
const sideMenus = document.querySelectorAll(".menus-side button")
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

    const response = await fetch(url)
    const data = await response.json()
    console.log("ddd",data)
    if(response.status === 200){
      if(data.articles.length === 0){
        throw new Error("No result for this search")
      }
      newsList = data.articles
      totalResults = data.totalResults
      render()
      paginationRedner() 
    } else{
      throw new Error(data.message)
    }
  } catch(error){
    errorRender(error.message)
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
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`)
  getNews()
}

const getNewsBySideCategory = async (event)=>{
  const category = event.target.textContent.toLowerCase()
  console.log("category", category)
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
  

  const paginationRedner = () =>{
    // totalResult
    //page
    //pageSize
    //groupSize
    //totalPages
    const totalPages = Math.ceil(totalResults/pageSize)
    //pageGroup
    const pageGroup = Math.ceil(page/groupSize)
    //lastPage
    const lastPage = pageGroup*groupSize
    // 마지막 페이지그룹이 그룹사이즈보다 작다? lastPage = totalPage
    if(lastPage>totalPages){
      lastPage=totalPages
    }

    //firstPage
    const firstPage = lastPage-(groupSize-1)<=0? 1: lastPage-(groupSize-1)

    let paginationHTML=``

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