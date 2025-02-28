import { ApiQuery } from 'san-webkit-next/api'

export type TAssetTweetsData = {
  negative: { tweets: { tweetId: string }[] }[]
  positive: { tweets: { tweetId: string }[] }[]
}
export const queryAssetTweets = ApiQuery(
  (variables: { slug: string }) => ({
    schema: `query($slug: String!){
  negative:getMostTweets(from: "utc_now-1d", to: "utc_now", size: 1, tweetType:MOST_NEGATIVE, selector:{slug:$slug}) {
    tweets { tweetId }
  }
  
  positive:getMostTweets(from: "utc_now-1d", to: "utc_now", size: 1, tweetType:MOST_POSITIVE,selector:{slug:$slug}) {
    tweets { tweetId }
  }
}`,
    variables: {
      slug: variables.slug,
    },
  }),
  (gql: TAssetTweetsData) => ({
    negative: gql.negative[0],
    positive: gql.positive[0],
  }),
)
