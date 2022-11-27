import { newPanel } from '@/stores/dashboard'

export const Dashbaord = (
  title: string,
  panels: { name: string; query: string; parameters?: SAN.Queries.SQL['parameters'] }[],
) => ({
  title,
  panels: panels.map(({ name, query, parameters }) => {
    const panel = newPanel(name, undefined, query)
    panel.submetricOf = 1
    if (parameters) panel.sql.parameters = parameters
    return panel
  }),
})

export const PremadeDashboards = [
  Dashbaord('Exploring dataset (SQL tutorial)', [
    {
      name: 'Step 1',
      query: `/*
Here is how to explore our data:

1) Type "SHOW TABLES" to see the complete list of tables that we have

2) You can search for tables whose names contain a certain substring.
   For example to find Bitcoin specific tables you can run
   "SHOW TABLES LIKE '%btc%'"

3) To see the structure of a given table you can use DESCRIBE TABLE
   or SHOW CREATE TABLE. For example "DESCRIBE TABLE btc_balances" or 
   "SHOW CREATE TABLE btc_balances"

4) Finally to see what data is in a table you can use a SELECT command
   with a LIMIT clause. For example to get some data from "btc_balances" table
   run "SELECT * FROM btc_balances LIMIT 10" 

Go on now. Try to find out what you can discover with those commands.
*/
 SELECT * FROM btc_balances LIMIT 5
 `,
    },
    {
      name: 'Step 2',
      query: `/*
If we dont want to get all the columns we can write down the name of the columns 
we want or the ones we want to exclude. For example in our btc_balances table
if we want to get just a few columns we can use
*/
SELECT dt, balance, address FROM btc_balances LIMIT 5
`,
    },
    {
      name: 'Step 3',
      query: `/*
In simmilar way if we just want to exclude a column(if you want to exclude more than one separate them with a comma) the txID for example we can use 
*/
SELECT * EXCEPT txID FROM btc_balances LIMIT 5
`,
    },
    {
      name: 'Step 4',
      query: `/*
If we want to get more specific data we can use the WHERE command.
With it you can filter out the data with 1 or more expressions.
For example if we want to get only btc_balances only happened 
within the last day we can use the function now() which gets 
the current DateTime and substract from it given interval of time. 
To set the specific interval we can use the functions starting with toInterval 
in this case toIntervalDay(1). 
We would also want to ORDER our results by a column. 
There are 2 types of ordering DESCending and ASCending. 
In this case we will ORDER BY dt DESCending so we can get the most recent ones 
*/
SELECT * FROM btc_balances WHERE dt > now() - toIntervalDay(1) ORDER BY dt DESC limit 5
`,
    },
    {
      name: 'Step 5',
      query: `/*
If we just want to count how many balance changes have occured we can use 
the function count(). 
We will use the last query but this time we wont have a limit or order by 
because we want to count all the data in the given time period 
but not to return the actual data.
*/
SELECT count() FROM btc_balances WHERE dt > now() - toIntervalDay(1)
`,
    },
    {
      name: 'Step 6',
      query: `/*
We can also count all the data for each day.
For this task we will need to select count() and the counted column to keep track what are we counting.
But first we need to convert our dt to have only days (remove the timestamp). 
We can use toDate(dt) which will convert our dt and we will also make an alias for it AS countedDay so we can reuse it in the query. 
We will specify a time period (last 5 days) with the WHERE command and 
we will use GROUP BY countedDay which will group together all rows for which the already converted dt (countedDay) is repeating. 
We will also order them DESCending so we can have the most recent ones at the top.
*/
SELECT count(), toDate(dt) as countedDay FROM btc_balances WHERE countedDay > now() - toIntervalDay(5) GROUP BY countedDay ORDER BY countedDay DESC
`,
    },
  ]),

  Dashbaord('Balances', [
    {
      name: 'Check my current BTC balance using btc_balances',
      query: `/* To use the query properly add a parameter of type text 
with value the address you want to search for and name myBTCAddress*/
	SELECT 
		dt as latestChange,
		balance as BTC,
		address 
	FROM btc_balances
	WHERE address = {{myBTCAddress}} 
	ORDER BY dt DESC
	LIMIT 1`,
      parameters: { myBTCAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
    },
    {
      name: 'Check my current BTC balance in dollar amount',
      query: `/* BTC and btcInUSD for myBTCAddress */
SELECT 
	dt as latestChange,
	balance as BTC,
	BTC*(select price_usd from asset_prices_v3 where slug='bitcoin' order by dt desc limit 1) as btcInUSD
FROM btc_balances
WHERE address = {{myBTCAddress}} 
ORDER BY dt DESC
LIMIT 1`,

      parameters: { myBTCAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
    },
  ]),

  Dashbaord('NFT Trades', [
    {
      name: 'Check the number of unique wallets that have owned an NFT last 7 days.',
      query: `SELECT countDistinct(buyer_address) AS uniqueBuyers
FROM nft_trades
WHERE dt >= (now() - INTERVAL 6 DAY)`,
    },
    {
      name: 'Check the platforms ordered by sales for last 7 days',
      query: `SELECT
    platform,
    count(platform) AS sales
FROM nft_trades
WHERE (complete = 1) AND (dt >= (now() - toIntervalDay(7)))
GROUP BY platform
ORDER BY sales DESC`,
    },
    {
      name: 'Sales for platform for last 5 months split by month',
      query: `SELECT
    toStartOfMonth(dt) AS month,
    count(platform) AS sales
FROM nft_trades
WHERE (complete = 1) AND (dt >= (now() - toIntervalMonth(4))) AND (platform = 'opensea')
GROUP BY month`,
    },

    {
      name: 'Top 10 buyers ordered by completed purchases count for last 5 days',
      query: `SELECT
    buyer_address,
    platform,
    count(platform) AS purchases
FROM nft_trades
WHERE (complete = 1) AND (dt >= (now() - toIntervalDay(4)))
GROUP BY
    buyer_address,
    platform
ORDER BY purchases DESC
LIMIT 10`,
    },
    {
      name: 'Top 10 sellers ordered by completed purchases count for last 5 days',
      query: `SELECT
    seller_address,
    platform,
    count(platform) AS sales
FROM nft_trades
WHERE (complete = 1) AND (dt >= (now() - toIntervalDay(4)))
GROUP BY
    seller_address,
    platform
ORDER BY sales DESC
LIMIT 10`,
    },
    {
      name: 'Unique assets for the last 7 days',
      query: `SELECT
    DISTINCT tb1.asset_ref_id,
    tb1.platform,
    tb2.name,
    tb1.sum_amount
FROM
(
    SELECT
    	platform,
        asset_ref_id,
        sum(CAST(amount, 'UInt64')) AS sum_amount
    FROM nft_trades
    WHERE
    	dt >= (now() - INTERVAL 6 DAY)
    GROUP BY platform, asset_ref_id
	order by sum_amount
) AS tb1
INNER JOIN asset_metadata AS tb2 ON tb1.asset_ref_id = tb2.asset_ref_id
ORDER BY sum_amount DESC`,
    },
    {
      name: 'Unique assets for the last 7 days for a single platform( or seller/buyer) with summed amounts',
      query: `SELECT
    DISTINCT tb1.asset_ref_id,
    tb2.name,
    tb1.sum_amount
FROM
(
    SELECT
        asset_ref_id,
        sum(CAST(amount, 'UInt64')) AS sum_amount
    FROM nft_trades
    WHERE
    	dt >= (now() - INTERVAL 6 DAY) and platform = 'opensea'
    GROUP BY asset_ref_id
	order by sum_amount
) AS tb1
INNER JOIN asset_metadata AS tb2 ON tb1.asset_ref_id = tb2.asset_ref_id
ORDER BY sum_amount DESC`,
    },
  ]),
]

/*

    {
      name: '',
      query: ``,
    },
*/
