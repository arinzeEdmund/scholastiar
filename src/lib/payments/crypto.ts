// Crypto checkout options (Phase A). Phase B reads enabled providers, assets and networks from
// payment_provider_configs, so new crypto providers and coins can be added without UI changes.

export const CRYPTO_PROVIDER = { key: "cryptomus", name: "Cryptomus" } as const;

/** How long a crypto quote is held. */
export const QUOTE_MINUTES = 15;

export interface CryptoAsset {
  asset: string;
  name: string;
  /** Stablecoins are pegged to USD, so the price doesn't move while you pay. */
  stable: boolean;
  networks: { key: string; label: string }[];
}

export const CRYPTO_ASSETS: CryptoAsset[] = [
  {
    asset: "USDT",
    name: "Tether",
    stable: true,
    networks: [
      { key: "TRC20", label: "Tron (TRC20)" },
      { key: "BEP20", label: "BNB Smart Chain (BEP20)" },
      { key: "ERC20", label: "Ethereum (ERC20)" },
    ],
  },
  {
    asset: "USDC",
    name: "USD Coin",
    stable: true,
    networks: [
      { key: "POLYGON", label: "Polygon" },
      { key: "ERC20", label: "Ethereum (ERC20)" },
    ],
  },
  { asset: "BTC", name: "Bitcoin", stable: false, networks: [{ key: "BTC", label: "Bitcoin" }] },
  { asset: "ETH", name: "Ether", stable: false, networks: [{ key: "ERC20", label: "Ethereum" }] },
];
