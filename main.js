let newsList = []
const menus = document.querySelectorAll(".menus button")
const sideMenus = document.querySelectorAll(".menus-side button")
menus.forEach(menu => menu.addEventListener("click", (event)=>  getNewsByCategory(event)))
sideMenus.forEach(menu => menu.addEventListener("click", (event)=> getNewsBySideCategory(event)))
let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`)

const getNews = async ()=> {
  try{
    const response = await fetch(url)
    const data = await response.json()
    if(response.status === 200){
      if(data.articles.length === 0){
        throw new Error("No result for this search")
      }
      newsList = data.articles
      render()  
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
  

  // 1. 버튼들에 클릭 이벤트를 줘야함
  // 2. 카테고리별 뉴스 가져오기
  // 3. 그 뉴스를 보여주기 render