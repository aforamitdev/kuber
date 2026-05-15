import {
  BankIcon,
  BookOpenIcon,
  BriefcaseIcon,
  BuildingsIcon,
  CarIcon,
  ChartLineUpIcon,
  ChartPieSliceIcon,
  CoinsIcon,
  CreditCardIcon,
  CrownIcon,
  CurrencyCircleDollarIcon,
  DatabaseIcon,
  DotsThreeOutlineIcon,
  FlagBannerIcon,
  ForkKnifeIcon,
  GlobeIcon,
  HandCoinsIcon,
  HouseIcon,
  LaptopIcon,
  LightningIcon,
  MapPinIcon,
  PackageIcon,
  PercentIcon,
  RocketIcon,
  ShieldIcon,
  ShoppingCartIcon,
  StarIcon,
  UserIcon,
  WalletIcon,
} from '@phosphor-icons/react'

export type IconComponent = typeof BankIcon

export const MARKET_ICONS: Record<string, IconComponent> = {
  globe: GlobeIcon,
  flag: FlagBannerIcon,
  bank: BankIcon,
  buildings: BuildingsIcon,
  chart: ChartLineUpIcon,
  coins: CoinsIcon,
  pin: MapPinIcon,
  dollar: CurrencyCircleDollarIcon,
}

export const PORTFOLIO_ICONS: Record<string, IconComponent> = {
  briefcase: BriefcaseIcon,
  rocket: RocketIcon,
  shield: ShieldIcon,
  pie: ChartPieSliceIcon,
  lightning: LightningIcon,
  star: StarIcon,
  wallet: WalletIcon,
  database: DatabaseIcon,
}

export const ASSET_KIND_ICONS: Record<string, IconComponent> = {
  residential: HouseIcon,
  commercial: BuildingsIcon,
  land: MapPinIcon,
  car: CarIcon,
  gold: CrownIcon,
  other: PackageIcon,
}

export function assetKindIcon(key: string): IconComponent {
  return ASSET_KIND_ICONS[key] ?? PackageIcon
}

export const INCOME_KIND_ICONS: Record<string, IconComponent> = {
  salary: BriefcaseIcon,
  freelance: LaptopIcon,
  business: BuildingsIcon,
  rental: HouseIcon,
  dividend: ChartPieSliceIcon,
  interest: PercentIcon,
  other: CoinsIcon,
}

export function incomeKindIcon(key: string): IconComponent {
  return INCOME_KIND_ICONS[key] ?? CoinsIcon
}

export const LOAN_KIND_ICONS: Record<string, IconComponent> = {
  home: HouseIcon,
  car: CarIcon,
  personal: UserIcon,
  education: BookOpenIcon,
  credit: CreditCardIcon,
  business: BuildingsIcon,
  other: HandCoinsIcon,
}

export function loanKindIcon(key: string): IconComponent {
  return LOAN_KIND_ICONS[key] ?? HandCoinsIcon
}

export const CATEGORY_ICONS: Record<string, IconComponent> = {
  cart: ShoppingCartIcon,
  house: HouseIcon,
  bolt: LightningIcon,
  fork: ForkKnifeIcon,
  car: CarIcon,
  dots: DotsThreeOutlineIcon,
  wallet: WalletIcon,
  star: StarIcon,
}

export const MARKET_ICON_KEYS = Object.keys(MARKET_ICONS)
export const PORTFOLIO_ICON_KEYS = Object.keys(PORTFOLIO_ICONS)
export const CATEGORY_ICON_KEYS = Object.keys(CATEGORY_ICONS)

export function marketIcon(key: string): IconComponent {
  return MARKET_ICONS[key] ?? GlobeIcon
}

export function portfolioIcon(key: string): IconComponent {
  return PORTFOLIO_ICONS[key] ?? BriefcaseIcon
}

export function categoryIcon(key: string): IconComponent {
  return CATEGORY_ICONS[key] ?? DotsThreeOutlineIcon
}
