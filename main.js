let newsList = []

const getLatestNews = async () => {
    const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`)
    
    const response = await fetch(url)
    const data = await response.json()
    newsList = data.articles
    render()
    console.log(newsList)
}

getLatestNews();


const render=()=>{
    const newsHTML = newsList.map(news=>`<div class="row news">
          <div class="news-img col-lg-4">
            <img
              class="news-img-size"
              src="${news.urlToImage || "https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg"}"/>
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
  