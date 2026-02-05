import { DEFAULT_CATEGORIES, DEFAULT_ACCOUNTS, DEFAULT_SUBSCRIPTIONS, DEFAULT_CREDIT_CARDS, DEFAULT_CONTACTS } from '../constants';
import type { AppData, Transaction, Tool, ToolGroup, LastWill, VisionBoardItem, VisionBoardCategory, BookReview } from '../types';

const defaultToolGroups: ToolGroup[] = [
    { id: "group-1", title: "1. Macro View", order: 0 },
    { id: "group-2", title: "2. Crypto Market Overview", order: 1 },
    { id: "group-3", title: "3. Market Sentiment", order: 2 },
    { id: "group-4", title: "4. Bitcoin", order: 3 },
    { id: "group-5", title: "5. On-Chain Data", order: 4 },
    { id: "group-6", title: "6. ETFs", order: 5 },
    { id: "group-7", title: "7. News", order: 6 },
    { id: "group-8", title: "Daily Routine", order: 7 },
    { id: "group-9", title: "Cryptocurrency price", order: 8 },
    { id: "group-10", title: "Trading", order: 9 },
    { id: "group-11", title: "Portfolio", order: 10 },
    { id: "group-12", title: "Partners -Ticketing", order: 11 },
    { id: "group-13", title: "Copy of News and analyse", order: 12 },
    { id: "group-14", title: "Copy of Data and Metrics - Finance", order: 13 },
    { id: "group-15", title: "Copy of For Researcher", order: 14 },
    { id: "group-16", title: "Crypto Research House", order: 15 },
    { id: "group-17", title: "Copy of Web3 Wallet Security", order: 16 },
    { id: "group-18", title: "GenAI", order: 17 },
    { id: "group-19", title: "New widget", order: 18 },
    { id: "group-20", title: "Copy of Venture Capital", order: 19 },
    { id: "group-21", title: "Copy of Blockchain Explorer", order: 20 },
    { id: "group-22", title: "Copy of Cryptocurrency price by Market Cap", order: 21 },
    { id: "group-23", title: "On-Chain Analytics", order: 22 },
    { id: "group-24", title: "Copy of Data and Metrics - Social", order: 23 },
    { id: "group-25", title: "Copy of X", order: 24 },
    { id: "group-26", title: "Copy of Mining", order: 25 },
    { id: "group-27", title: "Copy of Job's", order: 26 },
    { id: "group-28", title: "Copy of Screener", order: 27 },
    { id: "group-29", title: "Copy of Follow the flows", order: 28 },
    { id: "group-30", title: "AI Tool Directories", order: 29 },
    { id: "group-31", title: "Web3 Projects", order: 30 },
    { id: "group-32", title: "CEX", order: 31 },
    { id: "group-33", title: "DEX", order: 32 },
    { id: "group-34", title: "Bridge", order: 33 },
    { id: "group-35", title: "Fauce", order: 34 },
    { id: "group-36", title: "Wallets", order: 35 },
    { id: "group-37", title: "Blockchain Explorer", order: 36 },
    { id: "group-38", title: "Airdrops", order: 37 },
    { id: "group-39", title: "VC Portfolio", order: 38 },
    { id: "group-40", title: "Crypto Fund", order: 39 },
    { id: "group-41", title: "Macro", order: 40 },
    { id: "group-42", title: "Avareum's G-Suite", order: 41 },
    { id: "group-43", title: "Avareum", order: 42 },
    { id: "group-44", title: "Personal", order: 43 },
    { id: "group-45", title: "Data Visualization", order: 45 },
    { id: "group-46", title: "Avareum's Tools", order: 46 },
    { id: "group-47", title: "Utilitie Tools", order: 47 },
    { id: "group-48", title: "Youtube - Productive", order: 48 },
    { id: "group-49", title: "Youtube - Financial", order: 49 },
    { id: "group-50", title: "Books", order: 51 },
    { id: "group-51", title: "Social Media", order: 52 },
    { id: "group-52", title: "Online Course", order: 53 },
    { id: "group-53", title: "Communication", order: 54 },
    { id: "group-54", title: "Health", order: 55 }
];

const defaultTools: Tool[] = [
    { id: "tool-1", name: "US ISM Services PMI", url: "https://www.forexfactory.com/calendar/253-us-ism-services-pmi", groupId: "group-1", order: 0 },
    { id: "tool-2", name: "US Non-Farm Employment Change", url: "https://www.forexfactory.com/calendar/66-us-non-farm-employment-change", groupId: "group-1", order: 1 },
    { id: "tool-3", name: "US Unemployment Rate", url: "https://www.forexfactory.com/calendar/56-us-unemployment-rate", groupId: "group-1", order: 2 },
    { id: "tool-4", name: "US Advance GDP q/q", url: "https://www.forexfactory.com/calendar/2-us-advance-gdp-qq", groupId: "group-1", order: 3 },
    { id: "tool-5", name: "US Federal Funds Rate", url: "https://www.forexfactory.com/calendar/1-us-federal-funds-rate", groupId: "group-1", order: 4 },
    { id: "tool-6", name: "US Inflation Rate (%)", url: "https://tradingeconomics.com/united-states/inflation-cpi", groupId: "group-1", order: 5 },
    { id: "tool-7", name: "Major World Market Indices", url: "https://www.investing.com/indices/major-indices", groupId: "group-1", order: 6 },
    { id: "tool-8", name: "FINVIZ.com - Stock Screener", url: "https://finviz.com", groupId: "group-1", order: 7 },
    { id: "tool-9", name: "Earnings This Week, Earnings Calendar", url: "https://earningshub.com", groupId: "group-1", order: 8 },
    { id: "tool-10", name: "Bringing clarity to investment decisions | MSCI", url: "https://www.msci.com", groupId: "group-1", order: 9 },
    { id: "tool-11", name: "Buffett Indicator Valuation Model", url: "https://www.currentmarketvaluation.com/models/buffett-indicator.php", groupId: "group-1", order: 10 },
    { id: "tool-12", name: "FedWatch - CME Group", url: "https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html", groupId: "group-1", order: 11 },
    { id: "tool-13", name: "Crypto Market Overview", url: "https://coinmarketcap.com/charts", groupId: "group-2", order: 0 },
    { id: "tool-14", name: "Live Heatmap & Market Caps.", url: "https://coin360.com", groupId: "group-2", order: 1 },
    { id: "tool-15", name: "Crypto Bubbles", url: "https://cryptobubbles.net", groupId: "group-2", order: 2 },
    { id: "tool-16", name: "Altcoin Season Indicator", url: "https://coinank.com/indexdata/altcoinSeason", groupId: "group-2", order: 3 },
    { id: "tool-17", name: "Cryptocurrency Fund Flows", url: "https://coinank.com/fund/fundSwap?productType=SPOT", groupId: "group-2", order: 4 },
    { id: "tool-18", name: "Cryptocurrency Fund Flow by Category", url: "https://coinank.com/fund/fundCategories", groupId: "group-2", order: 5 },
    { id: "tool-19", name: "Live Cryptocurrency Market Overview", url: "https://quantifycrypto.com/markets", groupId: "group-2", order: 6 },
    { id: "tool-20", name: "Top Investment Coins in the Crypto Market", url: "https://quantifycrypto.com/terminal", groupId: "group-2", order: 7 },
    { id: "tool-21", name: "Cryptocurrency Heatmaps", url: "https://quantifycrypto.com/heatmaps", groupId: "group-2", order: 8 },
    { id: "tool-22", name: "Ethereum Outflow", url: "https://app.artemisanalytics.com/flows?tab=ecosystemFlows&destinationChains=all%2Cacala%2Calgorand%2Captos%2Carbitrum%2Caurora%2Cavalanche%2Cbase%2Cblast%2Cboba%2Cbitcoin%2Cbsc%2Ccanto%2Ccosmos_ecosystem%2Ccelo%2Ccronos%2Cdfk%2Cdogechain%2Cethereum%2Cfantom%2Charmony%2Clinea%2Cinjective%2Ckarura%2Cklaytn%2Cmetis%2Cmoonbeam%2Cmoonriver%2Cnear%2Coasis%2Coptimism%2Cpolygon%2Csei%2Csolana%2Cstarknet%2Csui%2Cterra2%2Cterra%2Cxpla%2Czksync", groupId: "group-2", order: 9 },
    { id: "tool-23", name: "Blockchain Net Inflow-Outflow", url: "https://app.artemisanalytics.com/flows?tab=flow&destinationChains=all%2Cacala%2Calgorand%2Captos%2Carbitrum%2Caurora%2Cavalanche%2Cbase%2Cblast%2Cboba%2Cbitcoin%2Cbsc%2Ccanto%2Ccosmos_ecosystem%2Ccelo%2Ccronos%2Cdfk%2Cdogechain%2Cethereum%2Cfantom%2Charmony%2Clinea%2Cinjective%2Ckarura%2Cklaytn%2Cmetis%2Cmoonbeam%2Cmoonriver%2Cnear%2Coasis%2Coptimism%2Cpolygon%2Csei%2Csolana%2Cstarknet%2Csui%2Cterra2%2Cterra%2Cxpla%2Czksync", groupId: "group-2", order: 10 },
    { id: "tool-24", name: "Artemis Terminal", url: "https://app.artemisanalytics.com/home", groupId: "group-2", order: 11 },
    { id: "tool-25", name: "Sector Performance (%)", url: "https://app.artemisanalytics.com/home", groupId: "group-2", order: 12 },
    { id: "tool-26", name: "Market Movers", url: "https://app.artemisanalytics.com/activity-monitor/composition", groupId: "group-2", order: 13 },
    { id: "tool-27", name: "SoSoValue: Advanced AI-Powered Crypto Investment", url: "https://sosovalue.com/?from=moved", groupId: "group-2", order: 14 },
    { id: "tool-28", name: "AI Crypto Screener", url: "https://www.cryptometer.io/ai-crypto-screener", groupId: "group-2", order: 15 },
    { id: "tool-29", name: "AMAZON (AMZN) - Overview", url: "https://unusualwhales.com/stock/AMZN/overview", groupId: "group-2", order: 16 },
    { id: "tool-30", name: "Rating Score and Price by TokenInsight", url: "https://tokeninsight.com/en/coins/daidai/rating", groupId: "group-2", order: 17 },
    { id: "tool-31", name: "Crypto Data Dashboard", url: "https://www.theblock.co/data/crypto-markets/spot", groupId: "group-2", order: 18 },
    { id: "tool-32", name: "Top Crypto Gainers & Losers Today | CoinGecko", url: "https://www.coingecko.com/en/crypto-gainers-losers", groupId: "group-2", order: 19 },
    { id: "tool-33", name: "Token Terminal | Dashboard", url: "https://tokenterminal.com/explorer", groupId: "group-2", order: 20 },
    { id: "tool-34", name: "Crypto Total Market Cap", url: "https://www.tradingview.com/chart/4ILLeo3T/?symbol=BITSTAMP%3ABTCUSD", groupId: "group-3", order: 0 },
    { id: "tool-35", name: "Bitcoin US Dollar Price Chart [Graph]", url: "https://www.tradingview.com/chart/4ILLeo3T/?symbol=BITSTAMP%3ABTCUSD", groupId: "group-3", order: 1 },
    { id: "tool-36", name: "Bitcoin Dominance (%)", url: "https://www.tradingview.com/chart/4ILLeo3T/?symbol=BITSTAMP%3ABTCUSD", groupId: "group-3", order: 2 },
    { id: "tool-37", name: "Ethereum Dominance (%)", url: "https://www.tradingview.com/chart/4ILLeo3T/?symbol=BITSTAMP%3ABTCUSD", groupId: "group-3", order: 3 },
    { id: "tool-38", name: "Alternative Coin Dominance (%)", url: "https://www.tradingview.com/chart/4ILLeo3T/?symbol=BITSTAMP%3ABTCUSD", groupId: "group-3", order: 4 },
    { id: "tool-39", name: "Bitcoin US Dollar Price Chart", url: "https://tradingeconomics.com/btcusd:cur", groupId: "group-3", order: 5 },
    { id: "tool-40", name: "RSI Heatmap", url: "https://coinank.com/RsiMapChart", groupId: "group-3", order: 6 },
    { id: "tool-41", name: "Trending Coins - Best Crypto to buy now?", url: "https://www.blockchaincenter.net/en/trending-coins", groupId: "group-3", order: 7 },
    { id: "tool-42", name: "Alts Buy Signal", url: "https://dune.com/cryptokoryo/crypto-buy-signal", groupId: "group-3", order: 8 },
    { id: "tool-43", name: "Narratives Tokens Breakdown", url: "https://dune.com/cryptokoryo/btc-pairs", groupId: "group-3", order: 9 },
    { id: "tool-44", name: "Crypto Narratives", url: "https://dune.com/cryptokoryo/narratives", groupId: "group-3", order: 10 },
    { id: "tool-45", name: "Capriole Investments | Charts", url: "https://capriole.com/charts/?chart=mvrv-z-score-btc", groupId: "group-3", order: 11 },
    { id: "tool-46", name: "M2 Global Growth vs Bitcoin", url: "https://bitcoincounterflow.com/charts/m2-global", groupId: "group-3", order: 12 },
    { id: "tool-47", name: "Solana Cross-Chain Explorer | Analytics", url: "https://solana.range.org/analytics", groupId: "group-3", order: 13 },
    { id: "tool-48", name: "Premarket Movers", url: "https://www.marketwatch.com/tools/screener/premarket", groupId: "group-3", order: 14 },
    { id: "tool-49", name: "Trending Stocks on Reddit", url: "https://apewisdom.io/?utm_source=chatgpt.com", groupId: "group-3", order: 15 },
    { id: "tool-50", name: "Meme Stock Rankings", url: "https://www.quiverquant.com/scores/memestocks?utm_source=chatgpt.com", groupId: "group-3", order: 16 },
    { id: "tool-51", name: "Bitcoin Fear And Greed Index", url: "https://www.bitcoinmagazinepro.com/charts/bitcoin-fear-and-greed-index", groupId: "group-4", order: 0 },
    { id: "tool-52", name: "Bitcoin MVRV Z-Score", url: "https://www.bitcoinmagazinepro.com/charts/mvrv-zscore", groupId: "group-4", order: 1 },
    { id: "tool-53", name: "Bitcoin Stock-to-Flow Model", url: "https://www.bitcoinmagazinepro.com/charts/stock-to-flow-model", groupId: "group-4", order: 2 },
    { id: "tool-54", name: "Bitcoin Rainbow Price Chart Indicator", url: "https://www.bitcoinmagazinepro.com/charts/bitcoin-rainbow-chart", groupId: "group-4", order: 3 },
    { id: "tool-55", name: "Bitcoin Market Cycle Indicators", url: "https://www.bitcoinmagazinepro.com/charts", groupId: "group-4", order: 4 },
    { id: "tool-56", name: "Bitcoin Liquidation Heatmap", url: "https://coinank.com/liqHeatMapChart", groupId: "group-4", order: 5 },
    { id: "tool-57", name: "Bitcoin Ahr999 Index", url: "https://coinank.com/indexdata/ahrIndex", groupId: "group-4", order: 6 },
    { id: "tool-58", name: "Bitcoin Month Profit (%)", url: "https://coinank.com/indexdata/profit", groupId: "group-4", order: 7 },
    { id: "tool-59", name: "Bitcoin 1Y+ HODL Wave", url: "https://coinank.com/indexdata/holdWave", groupId: "group-4", order: 8 },
    { id: "tool-60", name: "Bitcoin MVRV Z-Score", url: "https://coinank.com/indexdata/score", groupId: "group-4", order: 9 },
    { id: "tool-61", name: "Bitcoin Exchange Net Position Change", url: "https://coinank.com/indexdata/btcNetPosExChange", groupId: "group-4", order: 10 },
    { id: "tool-62", name: "Top 50 Performance over the last month", url: "https://www.blockchaincenter.net/en/altcoin-season-index", groupId: "group-4", order: 11 },
    { id: "tool-63", name: "RHODL Ratio", url: "https://www.bitcoinmagazinepro.com/charts/rhodl-ratio", groupId: "group-4", order: 12 },
    { id: "tool-64", name: "Percent Addresses in Loss", url: "https://www.bitcoinmagazinepro.com/charts/percent-addresses-in-loss", groupId: "group-4", order: 13 },
    { id: "tool-65", name: "Percent Addresses in Profit", url: "https://www.bitcoinmagazinepro.com/charts/percent-addresses-in-profit", groupId: "group-4", order: 14 },
    { id: "tool-66", name: "Value Days Destroyed (VDD) Multiple", url: "https://www.bitcoinmagazinepro.com/charts/value-days-destroyed-multiple", groupId: "group-4", order: 15 },
    { id: "tool-67", name: "200 Week Moving Average Heatmap", url: "https://www.bitcoinmagazinepro.com/charts/200-week-moving-average-heatmap", groupId: "group-4", order: 16 },
    { id: "tool-68", name: "ChainExposed - Short Term Holder Coin SOPR", url: "https://chainexposed.com/XthSOPRShortTermHolderCoin.html", groupId: "group-4", order: 17 },
    { id: "tool-69", name: "BitcoinTreasuries.NET - Private Companies", url: "https://bitcointreasuries.net/private-companies", groupId: "group-4", order: 18 },
    { id: "tool-70", name: "Bitcoin ETF Flow", url: "https://farside.co.uk/btc", groupId: "group-4", order: 19 },
    { id: "tool-71", name: "Total Value Locked All Chains", url: "https://defillama.com/chains", groupId: "group-5", order: 0 },
    { id: "tool-72", name: "Top Protocols by Blockchain", url: "https://defillama.com/top-protocols", groupId: "group-5", order: 1 },
    { id: "tool-73", name: "Top TVL by Categories", url: "https://defillama.com/categories", groupId: "group-5", order: 2 },
    { id: "tool-74", name: "Narrative Tracker by Category", url: "https://defillama.com/narrative-tracker", groupId: "group-5", order: 3 },
    { id: "tool-75", name: "Firedancer", url: "https://fd-mainnet.stakingfacilities.com", groupId: "group-5", order: 4 },
    { id: "tool-76", name: "Altcoin Season Index", url: "https://www.blockchaincenter.net/en/altcoin-season-index", groupId: "group-5", order: 5 },
    { id: "tool-77", name: "Top 50 Performance over the last season (90 days)", url: "https://www.blockchaincenter.net/en/altcoin-season-index", groupId: "group-5", order: 6 },
    { id: "tool-78", name: "Solscan", url: "https://solscan.io", groupId: "group-5", order: 7 },
    { id: "tool-79", name: "SoSoValue", url: "https://sosovalue.xyz/assets/etf/us-btc-spot", groupId: "group-6", order: 0 },
    { id: "tool-80", name: "Bitcoin ETF Flow", url: "https://farside.co.uk/btc", groupId: "group-6", order: 1 },
    { id: "tool-81", name: "CoinGlass", url: "https://www.coinglass.com/bitcoin-etf", groupId: "group-6", order: 2 },
    { id: "tool-82", name: "Bitcoin ETF", url: "https://www.theblock.co/data/crypto-markets/bitcoin-etf", groupId: "group-6", order: 3 },
    { id: "tool-83", name: "Bitcoin ETF Tracker", url: "https://blockworks.co/bitcoin-etf", groupId: "group-6", order: 4 },
    { id: "tool-84", name: "Live BTC ETF Tracker", url: "https://cryptonary.com/bitcoin-etf-inflows-tracker", groupId: "group-6", order: 5 },
    { id: "tool-85", name: "BTC: US Bitcoin Spot ETF Flows", url: "https://studio.glassnode.com/metrics?a=BTC&m=institutions.BtcUsSpotEtfFlowsAll", groupId: "group-6", order: 6 },
    { id: "tool-86", name: "Feedly", url: "https://feedly.com/", groupId: "group-7", order: 0 },
    { id: "tool-87", name: "Blockworks", url: "https://blockworks.co/", groupId: "group-7", order: 1 },
    { id: "tool-88", name: "The Block", url: "https://www.theblock.co", groupId: "group-7", order: 2 },
    { id: "tool-89", name: "Cointelegraph", url: "https://cointelegraph.com", groupId: "group-7", order: 3 },
    { id: "tool-90", name: "Decrypt", url: "https://decrypt.co", groupId: "group-7", order: 4 },
    { id: "tool-91", name: "CoinDesk", url: "https://www.coindesk.com", groupId: "group-7", order: 5 },
    { id: "tool-92", name: "Bloomberg Crypto", url: "https://www.bloomberg.com/crypto", groupId: "group-7", order: 6 },
    { id: "tool-93", name: "THE STANDARD", url: "https://thestandard.co/homepage/?utm_source=TSD+Desktop&utm_medium=Website&utm_campaign=TSDFORUM2024", groupId: "group-7", order: 7 },
    { id: "tool-94", name: "Rekt", url: "https://rekt.news", groupId: "group-7", order: 8 },
    { id: "tool-95", name: "Bitcoin Addict", url: "https://bitcoinaddict.org", groupId: "group-7", order: 9 },
    { id: "tool-96", name: "LlamaFeed", url: "https://feed.defillama.com", groupId: "group-7", order: 10 },
    { id: "tool-97", name: "DL News", url: "https://www.dlnews.com", groupId: "group-7", order: 11 },
    { id: "tool-98", name: "Linn's Leverage", url: "https://linns.substack.com", groupId: "group-7", order: 12 },
    { id: "tool-99", name: "Forbes Digital Assets", url: "https://www.forbes.com/digital-assets/?sh=4d28dbdf4605", groupId: "group-7", order: 13 },
    { id: "tool-100", name: "The Defiant", url: "https://thedefiant.io", groupId: "group-7", order: 14 },
    { id: "tool-101", name: "Blockchain Review", url: "https://blockchain-review.co.th", groupId: "group-7", order: 15 },
    { id: "tool-102", name: "Siam Blockchain", url: "https://siamblockchain.com", groupId: "group-7", order: 16 },
    { id: "tool-103", name: "CryptoSlate", url: "https://cryptoslate.com", groupId: "group-7", order: 17 },
    { id: "tool-104", name: "CryptoPanic", url: "https://cryptopanic.com", groupId: "group-7", order: 18 },
    { id: "tool-105", name: "Coin Market Cap", url: "https://coinmarketcap.com/", groupId: "group-8", order: 0 },
    { id: "tool-106", name: "Top Trending Today", url: "https://www.coingecko.com/en/highlights/trending-crypto", groupId: "group-8", order: 1 },
    { id: "tool-107", name: "SoSoValue", url: "https://sosovalue.xyz", groupId: "group-8", order: 2 },
    { id: "tool-108", name: "DEX Screener", url: "https://dexscreener.com/", groupId: "group-8", order: 3 },
    { id: "tool-109", name: "Tokenomist", url: "https://tokenomist.ai", groupId: "group-8", order: 4 },
    { id: "tool-110", name: "Tracking Crypto Prices & Charts", url: "https://www.geckoterminal.com", groupId: "group-8", order: 5 },
    { id: "tool-111", name: "BTC Spot ETF Daily", url: "https://sosovalue.xyz/assets/etf/us-btc-spot", groupId: "group-8", order: 6 },
    { id: "tool-112", name: "Bitcoin ETF Overview", url: "https://www.coinglass.com/bitcoin-etf", groupId: "group-8", order: 7 },
    { id: "tool-113", name: "Cryptocurrency Analytics", url: "https://quantifycrypto.com/coin-screener", groupId: "group-8", order: 8 },
    { id: "tool-114", name: "Bitcoin Long Short Ratio", url: "https://www.coinglass.com/LongShortRatio", groupId: "group-8", order: 9 },
    { id: "tool-115", name: "Bitcoin Funding Rate Heatmap", url: "https://www.coinglass.com/FundingRateHeatMap", groupId: "group-8", order: 10 },
    { id: "tool-116", name: "BTC/USDT Liquidation Heatmap", url: "https://www.coinglass.com/pro/futures/LiquidationHeatMapNew", groupId: "group-8", order: 11 },
    { id: "tool-117", name: "Unusual Whales", url: "https://unusualwhales.com", groupId: "group-8", order: 12 },
    { id: "tool-118", name: "Check Crypto Fees", url: "https://cryptofees.info", groupId: "group-8", order: 13 },
    { id: "tool-119", name: "Crypto Flows", url: "https://cryptoflows.info", groupId: "group-8", order: 14 },
    { id: "tool-120", name: "L2BEAT", url: "https://l2beat.com/scaling/summary", groupId: "group-8", order: 15 },
    { id: "tool-121", name: "Nansen", url: "https://app.nansen.ai", groupId: "group-8", order: 16 },
    { id: "tool-122", name: "Crypto Fear & Greed Index", url: "https://alternative.me/crypto/fear-and-greed-index", groupId: "group-8", order: 17 },
    { id: "tool-123", name: "Ethereum Gas Tracker", url: "https://www.ethgastracker.com/?source=ethgas.watch&referrer=ethgas.watch", groupId: "group-8", order: 18 },
    { id: "tool-124", name: "DEXTools", url: "https://www.dextools.io/app/en/hot-pairs", groupId: "group-8", order: 19 },
    { id: "tool-125", name: "Crypto Calendar", url: "https://www.cryptocraft.com/calendar?utm_source=twitter&utm_medium=timelines&utm_campaign=CC-Calendar&utm_id=inf_dat&utm_content=desktop", groupId: "group-8", order: 20 },
    { id: "tool-126", name: "CoinParticle", url: "https://www.coinparticle.com", groupId: "group-8", order: 21 },
    { id: "tool-127", name: "Bitcoin Sentiment – Bull & Bear Index", url: "https://www.augmento.ai/bitcoin-sentiment", groupId: "group-8", order: 22 },
    { id: "tool-128", name: "Social Media Analytics on LunarCrush", url: "https://lunarcrush.com", groupId: "group-8", order: 23 },
    { id: "tool-129", name: "Artemis Terminal", url: "https://app.artemis.xyz/home", groupId: "group-8", order: 24 },
    { id: "tool-130", name: "Map of Zones in COSMOS", url: "https://mapofzones.com", groupId: "group-8", order: 25 },
    { id: "tool-131", name: "VC Deal flow by CRYPTO fundraising", url: "https://crypto-fundraising.info/deal-flow", groupId: "group-8", order: 26 },
    { id: "tool-132", name: "Current Market Valuation", url: "https://www.currentmarketvaluation.com", groupId: "group-8", order: 27 },
    { id: "tool-133", name: "MacroMicro", url: "https://en.macromicro.me", groupId: "group-8", order: 28 },
    { id: "tool-134", name: "Global Macro Report", url: "https://en.macromicro.me/macro", groupId: "group-8", order: 29 },
    { id: "tool-135", name: "CME FedWatch", url: "https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html", groupId: "group-8", order: 30 },
    { id: "tool-136", name: "Ethereum Gas Tracker", url: "https://etherscan.io/gastracker", groupId: "group-8", order: 31 },
    { id: "tool-137", name: "Ethereum Gas Fees Today", url: "https://milkroad.com/ethereum/gas", groupId: "group-8", order: 32 }
];

export const DEFAULT_BOOK_REVIEWS: BookReview[] = [
    {
        id: 'br-1',
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        coverImageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1589139567l/41881472.jpg',
        category: 'Finance',
        readingTime: 8,
        difficulty: 'Beginner',
        tagline: 'Timeless lessons on wealth, greed, and happiness by exploring the psychology behind our financial decisions.',
        keyTakeaways: [
            "Financial success is less about what you know and more about how you behave.",
            "Luck and risk are powerful forces. Be humble in success and forgiving in failure.",
            "The highest dividend money pays is the ability to control your own time.",
            "Getting wealthy and staying wealthy are two separate skills. The first requires risk-taking, the second requires humility.",
            "True wealth is what you don't see—it's the financial assets that haven't been converted into stuff."
        ],
        coreIdeas: [
            {
                concept: "No One's Crazy",
                explanation: "Your personal experiences with money shape your financial worldview. What seems crazy to one person makes perfect sense to another based on their unique background.",
                relevance: "It teaches empathy and helps us understand that there's no single 'right' answer in finance. We must make decisions that work for our own goals and risk tolerance."
            },
            {
                concept: "The Seduction of Pessimism",
                explanation: "Pessimism sounds smarter and more plausible than optimism. Progress happens too slowly to notice, but setbacks happen too quickly to ignore.",
                relevance: "In investing, being an optimist about the long-term future is the most realistic stance, even though pessimism often grabs more headlines and feels more urgent."
            }
        ],
        frameworks: [
            {
                name: "Man in the Car Paradox",
                description: "When we see someone in a fancy car, we rarely think, 'Wow, that person is cool.' Instead, we think, 'Wow, if I had that car, people would think I'm cool.' The paradox is that wealth is used to signal admiration, but it rarely works that way."
            }
        ],
        quotes: [
            {
                text: "The ability to do what you want, when you want, with who you want, for as long as you want, is priceless.",
                context: "On defining the ultimate goal of wealth."
            },
            {
                text: "Use money to gain control over your time, because not having control of your time is such a powerful and universal drag on happiness.",
                context: "On the connection between money, time, and well-being."
            }
        ],
        reflections: "This book fundamentally changed how I view wealth and happiness. It’s less of a 'how-to' guide and more of a 'how-to-think' guide. The emphasis on behavior over technical skill is a powerful reminder for any investor. It has made me focus more on long-term consistency and the 'sleep-at-night' factor of my portfolio rather than chasing the highest possible returns.",
        whoShouldRead: [
            "Anyone looking to build a healthier, less anxious relationship with money.",
            "Investors who focus too much on charts and not enough on behavior.",
            "Young professionals starting their financial journey."
        ],
        qualitativeRating: {
            insightDepth: 5,
            practicality: 5,
            timelessness: 5
        },
        verdict: "A foundational read that should be on everyone's bookshelf. It provides a mental framework for financial success that will remain relevant for decades.",
        dateRead: '2023-05-15T00:00:00.000Z',
    },
    {
        id: 'br-2',
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        coverImageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1420585954l/23692271.jpg',
        category: 'History',
        readingTime: 12,
        difficulty: 'Intermediate',
        tagline: 'A sweeping narrative of humanity’s journey, from an insignificant ape to the ruler of the planet.',
        keyTakeaways: [
            "Homo Sapiens conquered the world thanks to our unique ability to believe in collective fictions like gods, nations, and money.",
            "The Agricultural Revolution was 'history's biggest fraud,' leading to a harder life for the average person.",
            "The unification of humankind is driven by three universal orders: the monetary order, the imperial order, and the religious order.",
            "The Scientific Revolution is built on the willingness to admit ignorance ('we don't know').",
            "We are more powerful than ever before, but not necessarily happier."
        ],
        coreIdeas: [
            {
                concept: "The Cognitive Revolution",
                explanation: "Around 70,000 years ago, Sapiens developed new ways of thinking and communicating, primarily through the ability to discuss fictional entities. This allowed for cooperation in large, flexible groups.",
                relevance: "This is the foundation of modern society. Companies, laws, and nations are all inter-subjective realities (fictions) we collectively agree to uphold."
            },
        ],
        frameworks: [
            {
                name: "The Three Great Revolutions",
                description: "Human history is framed by three major transformations: The Cognitive Revolution (emergence of imagination), The Agricultural Revolution (domestication of plants/animals), and The Scientific Revolution (the pursuit of knowledge through observation and experiment)."
            }
        ],
        quotes: [
            {
                text: "You could never convince a monkey to give you a banana by promising him limitless bananas after death in monkey heaven.",
                context: "Explaining the unique human ability to believe in abstract concepts."
            }
        ],
        reflections: "Sapiens provides a powerful macro-lens through which to view not just history, but our current world. Understanding that concepts like 'company' or 'money' are powerful fictions changes how one approaches business and finance. It's a book that recalibrates your perspective on everything, making the familiar seem strange and the strange, familiar.",
        whoShouldRead: [
            "Anyone curious about the deep history of our species.",
            "Thinkers who want to understand the foundational structures of society.",
            "People looking for a 'big picture' perspective on humanity's place in the world."
        ],
        qualitativeRating: {
            insightDepth: 5,
            practicality: 3,
            timelessness: 5
        },
        verdict: "An essential, mind-expanding read. While not a practical guide, it provides a crucial context for understanding the world we live in today.",
        dateRead: '2022-11-20T00:00:00.000Z',
    }
];

export const generateSeedData = (): AppData => {
    const accounts = [...DEFAULT_ACCOUNTS];
    const categories = [...DEFAULT_CATEGORIES];
    const transactions: Transaction[] = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    let balance = 75000;

    // Generate recurring transactions for the past 12 months
    for (let i = 0; i < 12; i++) {
        const month = currentMonth - i;
        const date = new Date(currentYear, month, 1);
        if (date > today) continue;

        // Salary
        const salaryDate = new Date(currentYear, month, 28);
        if (salaryDate <= today) {
            transactions.push({
                id: `tx-seed-salary-${i}`,
                date: salaryDate.toISOString(),
                amount: 60000,
                type: 'income',
                categoryId: 'income-salary',
                accountId: 'acc-2',
                note: 'Monthly Salary',
            });
            balance += 60000;
        }

        // Social Security
        transactions.push({
            id: `tx-seed-ss-${i}`,
            date: new Date(currentYear, month, 28).toISOString(),
            amount: 750,
            type: 'expense',
            categoryId: 'taxes-social-security',
            accountId: 'acc-2',
            note: 'Social Security',
        });
        balance -= 750;

        // Recurring Expenses
        const recurringExpenses = [
            { catId: 'expenses-housing-internet', amount: 640.93, note: 'Internet' },
            { catId: 'expenses-housing-phone', amount: 278.20, note: 'Phone Bill' },
            { catId: 'expenses-health-gym', amount: 1990, note: 'Fitness Membership' },
            { catId: 'expenses-subscriptions-netflix', amount: 105, note: 'Netflix' },
            { catId: 'expenses-subscriptions-youtube', amount: 90, note: 'YouTube Premium' },
            { catId: 'expenses-family-mom-phone', amount: 175, note: 'Mom Phone' },
            { catId: 'expenses-family-mom-electricity', amount: 650, note: 'Mom Electricity' },
            { catId: 'expenses-debt-cash-plus', amount: 1525, note: 'UOB Cash Plus' },
        ];

        recurringExpenses.forEach((exp, idx) => {
             transactions.push({
                id: `tx-seed-recurring-${i}-${idx}`,
                date: new Date(currentYear, month, 5 + idx).toISOString(),
                amount: exp.amount,
                type: 'expense',
                categoryId: exp.catId,
                accountId: 'acc-2',
                note: exp.note,
            });
            balance -= exp.amount;
        });
        
        // Random Food expenses
        for(let j=0; j < 8; j++) {
            const foodAmount = Math.floor(Math.random() * (1200 - 300 + 1)) + 300;
            transactions.push({
                 id: `tx-seed-food-${i}-${j}`,
                date: new Date(currentYear, month, Math.floor(Math.random() * 28) + 1).toISOString(),
                amount: foodAmount,
                type: 'expense',
                categoryId: 'expenses-food',
                accountId: 'acc-2',
                note: 'Groceries or Dining',
            });
            balance -= foodAmount;
        }
    }
    
    // Set final calculated balance
    const mainAccount = accounts.find(a => a.id === 'acc-2');
    if (mainAccount) {
        mainAccount.balance = balance;
    }


    const budgets = [
        {
            id: 'bud-1',
            categoryId: 'expenses-food',
            amount: 8660,
            period: 'monthly' as const,
            startDate: new Date(today.getFullYear(), today.getMonth(), 1).toISOString(),
        },
    ];

    const goals = [
        {
            id: 'goal-1',
            name: 'New Laptop',
            targetAmount: 100000,
            currentAmount: 25000,
            deadline: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString(),
            category: 'Technology',
        },
        {
            id: 'goal-2',
            name: 'เงินสำรองฉุกเฉิน',
            targetAmount: 100000,
            currentAmount: 30000,
            deadline: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString(),
            category: 'Financial',
        }
    ];
    
    const subscriptions = [...DEFAULT_SUBSCRIPTIONS];
    const creditCards = [...DEFAULT_CREDIT_CARDS];
    const contacts = [...DEFAULT_CONTACTS];
    const profile = {};
    const riskProfile = {};
    const toolGroups = [...defaultToolGroups];
    const tools = [...defaultTools];
    const lastWill: LastWill = {
        assetBeneficiaries: {},
        specificGifts: [],
        digitalAssets: [],
    };
    
    const visionBoardCategories: VisionBoardCategory[] = [
        { id: 'vbcat-1', name: 'Health', color: 'green' },
        { id: 'vbcat-2', name: 'Career', color: 'sky' },
        { id: 'vbcat-3', name: 'Travel', color: 'indigo' },
        { id: 'vbcat-4', name: 'Finance', color: 'amber' },
        { id: 'vbcat-5', name: 'Relationships', color: 'rose' },
        { id: 'vbcat-6', name: 'Personal Growth', color: 'purple' },
        { id: 'vbcat-7', name: 'Home', color: 'teal' },
    ];

    const visionBoardItems: VisionBoardItem[] = [
        { id: 'vb-1', year: new Date().getFullYear(), imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800', title: 'Visit Lake Braies, Italy', notes: 'Iconic travel destination.', order: 0, categoryId: 'vbcat-3', achieved: false },
        { id: 'vb-2', year: new Date().getFullYear(), imageUrl: 'https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=800', title: 'Master Personal Finances', notes: 'Increase savings rate to 30%.', order: 1, categoryId: 'vbcat-4', achieved: false },
        { id: "vb-3", year: new Date().getFullYear(), imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800', title: 'Career Advancement', notes: 'Achieve a leadership role.', order: 2, categoryId: 'vbcat-2', achieved: false },
        { id: "vb-8", year: new Date().getFullYear(), imageUrl: 'https://images.unsplash.com/photo-1599818498358-b1724220d9d2?q=80&w=800', title: 'Helicopter Ski Trip', notes: 'Experience heli-skiing in the Alps.', order: 3, categoryId: 'vbcat-3', achieved: false },
        { id: "vb-9", year: new Date().getFullYear(), imageUrl: 'https://images.unsplash.com/photo-1616422285855-ab153a0094e2?q=80&w=800', title: 'Acquire a Classic Sports Car', notes: 'Dream car: vintage red Porsche.', order: 4, categoryId: 'vbcat-7', achieved: false },
        { id: "vb-10", year: new Date().getFullYear(), imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800', title: 'Build a Home Gym', notes: 'Invest in personal health and fitness.', order: 5, categoryId: 'vbcat-1', achieved: false },
        { id: "vb-11", year: new Date().getFullYear(), imageUrl: 'https://images.unsplash.com/photo-1616594418296-e1f26274f8a1?q=80&w=800', title: 'Design a Rec Room', notes: 'With a pool table and entertainment area.', order: 6, categoryId: 'vbcat-7', achieved: false },
        { id: "vb-12", year: new Date().getFullYear(), imageUrl: 'https://images.unsplash.com/photo-1559586473-2d9b6d85579b?q=80&w=800', title: 'Play Tennis by the Coast', notes: 'Vacation with a view.', order: 7, categoryId: 'vbcat-1', achieved: false },
        { id: "vb-13", year: new Date().getFullYear(), imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800', title: 'Invest in a Restaurant', notes: 'Explore new business ventures.', order: 8, categoryId: 'vbcat-4', achieved: false },
        { id: "vb-14", year: new Date().getFullYear(), imageUrl: 'https://images.unsplash.com/photo-1551952214-86d9e7a5a82e?q=80&w=800', title: 'Build an Indoor Sports Court', notes: 'Personal basketball court.', order: 9, categoryId: 'vbcat-7', achieved: false },
        { id: "vb-6", year: new Date().getFullYear() + 1, imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7185743?q=80&w=800', title: 'Buy a House', order: 0, categoryId: 'vbcat-7', achieved: false },
        { id: "vb-7", year: new Date().getFullYear() - 1, imageUrl: 'https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3?q=80&w=800', title: 'Run a half marathon', order: 0, categoryId: 'vbcat-1', achieved: true },
    ];

    const bookReviews = [...DEFAULT_BOOK_REVIEWS];


    return {
        profile,
        riskProfile,
        transactions,
        categories,
        accounts,
        budgets,
        goals,
        subscriptions,
        creditCards,
        contacts,
        toolGroups,
        tools,
        lastWill,
        visionBoardItems,
        visionBoardCategories,
        bookReviews,
    };
};