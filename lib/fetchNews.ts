import { gql } from "graphql-request";
import sortNewsByImage from "./sortNewsByImage";

const fetchNews = async (

    category?: Category | string,
    keywords?: string,
    isDynamic?: boolean,
) => {

    // GraphQl query
    const query = gql`
    query MyQuery(
        $access_key: String!
        $categories: String!
        $keywords: String
    ) {
        myQuery(
            access_key: $access_key
            categories: $categories
            countries: "in,us,gb"
            sort: "published_desc"
            keywords: $keywords
        ) {
            data {
                author
                category
                country
                description
                image
                language
                published_at
                source
                title
                url
            }
            pagination {
                count
                limit
                offset
                total
            }
        }
    }`;

    // fetch function with nextjs 13 caching

    const res = await fetch('https://toledo.stepzen.net/api/ranting-worm/__graphql', {
        method: 'POST',
        cache: isDynamic ? "no-cache" : "default",
        next: isDynamic ? { revalidate: 0 } : { revalidate: 20 },
        headers: {
            "Content-type": "application/json",
            Authorization: `Apikey ${process.env.STEPZEN_API_KEY}`,
        },
        body: JSON.stringify({
            query,
            variables: {
                access_key: process.env.MEDIASTACK_API_KEY,
                categories: category,
                keywords: keywords,
            }
        })
    });


    console.log(
        "Loading new data from API for category: " + category + " and keywords: " + keywords
    );

    const NewsResponse = await res.json();
    // sort function by images vs not images present

    const news = sortNewsByImage(NewsResponse.data.myQuery);

    // return news
    return news;

}

export default fetchNews;

// stepzen import curl http://api.mediastack.com/v1/news?access_key=??&sources=business,sports
// stepzen import curl http://api.mediastack.com/v1/news?access_key=??&countries=us%2Cgb&limit=100&offset=0&sort=published_desc