interface ToolLink {
    name: string;
    url: string;
}

interface ToolCategory {
    title: string;
    links: ToolLink[];
}

export const toolCategories: ToolCategory[] = [
    {
        title: '1. Macro View',
        links: [
            { name: 'US ISM Services PMI', url: 'https://www.investing.com/economic-calendar/ism-non-manufacturing-pmi-176' },
            { name: 'US Non-Farm Employment Change', url: 'https://www.investing.com/economic-calendar/nonfarm-payrolls-227' },
            { name: 'US Unemployment Rate', url: 'https://www.investing.com/economic-calendar/unemployment-rate-300' },
            { name: 'US Advance GDP q/q', url: 'https://www.investing.com/economic-calendar/gdp-375' },
            { name: 'US Federal Funds Rate', url: 'https://www.investing.com/economic-calendar/fed-fund-rate-168' },
            { name: 'US Inflation Rate (%)', url: 'https://www.investing.com/economic-calendar/cpi-733' },
            { name: 'Major World Market Indices', url: 'https://www.investing.com/indices/major-indices' },
            { name: 'FINVIZ.com - Stock Screener', url: 'https://finviz.com/' },
            { name: 'Earnings This Week, Earnings Calendar', url: 'https://www.earningswhispers.com/calendar' },
            { name: 'Buffett Indicator Valuation Model', url: 'https://www.currentmarketvaluation.com/models/buffett-indicator.php' },
            { name: 'FedWatch - CME Group', url: 'https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html' },
        ]
    },
    {
        title: 'Daily Routine',
        links: [
            { name: 'Coin Market Cap', url: 'https://coinmarketcap.com/' },
            { name: 'Top Trending Today', url: 'https://www.coingecko.com/discover' },
            { name: 'Feedly', url: 'https://feedly.com/' },
            { name: 'SoSoValue', url: 'https://sosovalue.xyz/' },
            { name: 'DEX Screener', url: 'https://dexscreener.com/' },
            { name: 'Tokenomist', url: 'https://tokenist.com/' },
            { name: 'Tracking Crypto Prices & Charts', url: 'https://coinstats.app/' },
            { name: 'BTC Spot ETF Daily', url: 'https://farside.co.uk/' },
            { name: 'Bitcoin ETF Overview', url: 'https://cointelegraph.com/bitcoin-etf' },
            { name: 'Cryptocurrency Analytics', url: 'https://www.cryptocompare.com/' },
            { name: 'Bitcoin Long Short Ratio', url: 'https://www.coinglass.com/LongShortRatio' },
            { name: 'Bitcoin Funding Rate Heatmap', url: 'https://www.coinglass.com/FundingRateHeatmap' },
        ]
    },
    {
        title: 'Crypto Research House',
        links: [
            { name: 'Avareum Research', url: 'https://www.avareum.com/' },
            { name: 'Cryptomind Research', url: 'https://www.cryptomind.group/research' },
            { name: 'Glassnode Insights', url: 'https://insights.glassnode.com/' },
            { name: 'Nansen Research', url: 'https://www.nansen.ai/research' },
            { name: 'Messari Research', url: 'https://messari.io/research' },
            { name: 'Delphi Digital Research', url: 'https://delphidigital.io/research' },
            { name: 'Grayscale® Research', url: 'https://www.grayscale.com/research' },
            { name: 'Bitwise', url: 'https://bitwiseinvestments.com/crypto-insights' },
            { name: 'Galaxy Research', url: 'https://www.galaxy.com/research/' },
            { name: 'The Block Research', url: 'https://www.theblock.co/research' },
        ]
    },
    {
        title: 'On-Chain Analytics',
        links: [
            { name: 'Santiment', url: 'https://santiment.net/' },
            { name: 'CryptoQuant', url: 'https://cryptoquant.com/' },
            { name: 'Glassnode', url: 'https://glassnode.com/' },
            { name: 'IntoTheBlock', url: 'https://www.intotheblock.com/' },
            { name: 'Arkham', url: 'https://platform.arkhamintelligence.com/' },
            { name: 'Nansen', url: 'https://www.nansen.ai/' },
            { name: 'Dune Analytics', url: 'https://dune.com/' },
            { name: 'Messari', url: 'https://messari.io/' },
            { name: 'altFINS', url: 'https://altfins.com/' },
            { name: 'Coin Metrics', url: 'https://coinmetrics.io/' },
            { name: 'CoinGlass', url: 'https://www.coinglass.com/' },
        ]
    },
    {
        title: 'AI Tool Directories',
        links: [
            { name: 'Futurepedia.io', url: 'https://www.futurepedia.io/' },
            { name: 'There\'s An AI For That', url: 'https://theresanaiforthat.com/' },
            { name: 'ToolPilot', url: 'https://www.toolpilot.ai/' },
            { name: 'topai.tools', url: 'https://topai.tools/' },
            { name: 'FutureTools.io', url: 'https://www.futuretools.io/' },
            { name: 'Product Hunt', url: 'https://www.producthunt.com/' },
            { name: 'Find My AI Tool', url: 'https://findmyaitool.com/' },
            { name: 'AI Directory.com', url: 'https://aidirectory.com/' },
            { name: 'AI Center', url: 'https://aicenter.com/' },
        ]
    },
     {
        title: 'GenAI',
        links: [
            { name: 'Claude A', url: 'https://claude.ai/' },
            { name: 'ChatGPT', url: 'https://chat.openai.com/' },
            { name: 'Perplexity AI', url: 'https://www.perplexity.ai/' },
            { name: 'Gemini', url: 'https://gemini.google.com/' },
            { name: 'OpenAI API Usage', url: 'https://platform.openai.com/usage' },
            { name: 'NotebookLM', url: 'https://notebooklm.google.com/' },
            { name: 'Budgie AI', url: 'https://www.budgie.ai/' },
            { name: 'Leonardo.Ai', url: 'https://leonardo.ai/' },
            { name: 'v0 by Vercel', url: 'https://v0.dev/' },
            { name: 'AI Tools for Designers', url: 'https://aitools.design/' },
            { name: 'NoteGPT - AI Summarizer', url: 'https://notegpt.io/' },
            { name: 'Qwen', url: 'https://qwen.aliyun.com/' },
        ]
    },
    {
        title: 'Web3 Projects',
        links: [
            { name: 'Binance', url: 'https://www.binance.com/' },
            { name: 'Bitkub', url: 'https://www.bitkub.com/' },
            { name: 'OKX', url: 'https://www.okx.com/' },
            { name: 'Bybit', url: 'https://www.bybit.com/' },
            { name: 'KuCoin', url: 'https://www.kucoin.com/' },
            { name: 'Gate.io', url: 'https://www.gate.io/' },
            { name: 'Kraken', url: 'https://www.kraken.com/' },
            { name: 'Coinbase', url: 'https://www.coinbase.com/' },
            { name: 'Gemini', url: 'https://www.gemini.com/' },
            { name: 'HTX', url: 'https://www.htx.com/' },
            { name: 'Bitstamp', url: 'https://www.bitstamp.net/' },
        ]
    },
    {
        title: 'Wallets',
        links: [
            { name: 'MetaMask', url: 'https://metamask.io/' },
            { name: 'Rabby', url: 'https://rabby.io/' },
        ]
    },
    {
        title: 'Utilite Tools',
        links: [
            { name: 'Icons8', url: 'https://icons8.com/' },
            { name: 'Capacities', url: 'https://capacities.io/' },
            { name: 'PDF Expert', url: 'https://pdfexpert.com/' },
            { name: 'Brave', url: 'https://brave.com/' },
            { name: 'Excalidraw', url: 'https://excalidraw.com/' },
            { name: 'TXT to CSV Converter', url: 'https://www.convertcsv.com/txt-to-csv.htm' },
            { name: 'Subly - Subscriptions Tracker', url: 'https://subly.app/' },
            { name: 'Pocket Universe', url: 'https://pocketuniverse.app/' },
            { name: 'Clockwise: AI Powered Time Management', url: 'https://www.getclockwise.com/' },
            { name: 'Xmind AI', url: 'https://xmind.ai/' },
        ]
    },
];
