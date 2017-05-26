const dotenv = require('dotenv');
const twitter = require('twit');
const Promise = require('bluebird');

const { Task } = require('blezer');

dotenv.config();

const twitterClient = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  app_only_auth: true,
  timeout_ms: 60*1000
})

async function fetchTweets(query, max_id = -1) {
  try {
    let result = await twitterClient.get('search/tweets', { q: query, count: 4, max_id: max_id });

    let tweets = result.data.statuses
      .map(({ id, created_at, text, user }) => ({ id, created_at, text, user }));

    return tweets;
  } catch (error) {
    console.log('caught error', error.stack)
    throw Error;
  }
}

async function search(query, numberOfRequests = Infinity) {
  let requestCount = 0;
  let initialTweets = await fetchTweets(query);
  let tweets = initialTweets;

  while (tweets && requestCount < numberOfRequests) {
    const max_id = tweets[tweets.length - 1].id
    tweets = await fetchTweets(query, max_id);

    requestCount++;

    initialTweets = initialTweets.concat(tweets);
  }

  return initialTweets;
}

class TwitterTask extends Task {
  async perform(args) {
    this.log(`-- Twitter Task: ${args}`);

    let tweets = await search('kuba', 2);

    this.log('Fetched tweets: ', tweets.length);
    this.log(tweets)
  }
}

module.exports = TwitterTask;
