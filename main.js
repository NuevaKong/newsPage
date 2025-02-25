let news = []

const API_KEY = `c4fb59c2796444c58987f1a6ec1757a4`
const getLatestNews = async () => {
    const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`)
    
    const response = await fetch(url)
    const data = await response.json()
    news = data.articles
    console.log("ddd", news)
}

getLatestNews();
