export default function sortNewsByImage(news: NewsResponse) {
    const newsWithImage = news.data.filter((item) => item.image !== null);
    const newsWithoutImages = news.data.filter((item) => item.image === null);
    
    const sortedNewsResponse = {
        pagination: news.pagination,
        data: [...newsWithImage, ...newsWithoutImages],
    }

    return sortedNewsResponse;
}