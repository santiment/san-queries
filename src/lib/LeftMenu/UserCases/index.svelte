<script lang="ts">
  import MenuItem from '../MenuItem.svelte'
  import Folder from '../Folder.svelte'
  import Item from './Item.svelte'

  const NFTs = [
    {
      name: 'Check the number of unique wallets that have owned an NFT last 7 days.',
      sql: `SELECT countDistinct(buyer_address) AS uniqueBuyers
FROM nft_trades
WHERE dt >= (now() - INTERVAL 6 DAY)`,
    },
    {
      name: 'Check the platforms ordered by sales for last 7 days',
      sql: `SELECT
    platform,
    count(platform) AS sales
FROM nft_trades
WHERE (complete = 1) AND (dt >= (now() - toIntervalDay(7)))
GROUP BY platform
ORDER BY sales DESC`,
    },
    {
      name: 'Sales for platform for last 5 months split by month',
      sql: `SELECT
    toStartOfMonth(dt) AS month,
    count(platform) AS sales
FROM nft_trades
WHERE (complete = 1) AND (dt >= (now() - toIntervalMonth(4))) AND (platform = 'opensea')
GROUP BY month`,
    },

    {
      name: 'Top 10 buyers ordered by completed purchases count for last 5 days',
      sql: `SELECT
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
      sql: `SELECT
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
      sql: `SELECT
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
      sql: `SELECT
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
  ]

  const BALANCEs = [
    {
      name: 'Check my current BTC balance using btc_balances',
      sql: `/* To use the query properly add a parameter of type text 
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
      sql: `/* BTC and btcInUSD for myBTCAddress */
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
  ]
</script>

<Folder title="NFT tables">
  {#each NFTs as item}
    <Item {item} />
  {/each}
</Folder>

<Folder title="DEX trades tables">
  {#each BALANCEs as item}
    <Item {item} />
  {/each}
</Folder>

<style lang="scss">
</style>
