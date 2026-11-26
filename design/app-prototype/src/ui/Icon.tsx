/* One icon family for the whole product: Phosphor (same as the web prototype).
 Each icon is imported on its own so only the icons we use are bundled. */
import type { IconProps, IconWeight } from 'phosphor-react-native';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { HouseIcon } from 'phosphor-react-native/src/icons/House';
import { StorefrontIcon } from 'phosphor-react-native/src/icons/Storefront';
import { PackageIcon } from 'phosphor-react-native/src/icons/Package';
import { ReceiptIcon } from 'phosphor-react-native/src/icons/Receipt';
import { BellIcon } from 'phosphor-react-native/src/icons/Bell';
import { UserIcon } from 'phosphor-react-native/src/icons/User';
import { UsersIcon } from 'phosphor-react-native/src/icons/Users';
import { MagnifyingGlassIcon } from 'phosphor-react-native/src/icons/MagnifyingGlass';
import { PlusIcon } from 'phosphor-react-native/src/icons/Plus';
import { MinusIcon } from 'phosphor-react-native/src/icons/Minus';
import { ShareNetworkIcon } from 'phosphor-react-native/src/icons/ShareNetwork';
import { CheckIcon } from 'phosphor-react-native/src/icons/Check';
import { CreditCardIcon } from 'phosphor-react-native/src/icons/CreditCard';
import { ShieldCheckIcon } from 'phosphor-react-native/src/icons/ShieldCheck';
import { MapPinIcon } from 'phosphor-react-native/src/icons/MapPin';
import { ClockIcon } from 'phosphor-react-native/src/icons/Clock';
import { ListIcon } from 'phosphor-react-native/src/icons/List';
import { XIcon } from 'phosphor-react-native/src/icons/X';
import { CopyIcon } from 'phosphor-react-native/src/icons/Copy';
import { ChatCircleIcon } from 'phosphor-react-native/src/icons/ChatCircle';
import { WhatsappLogoIcon } from 'phosphor-react-native/src/icons/WhatsappLogo';
import { UploadSimpleIcon } from 'phosphor-react-native/src/icons/UploadSimple';
import { CaretRightIcon } from 'phosphor-react-native/src/icons/CaretRight';
import { CaretLeftIcon } from 'phosphor-react-native/src/icons/CaretLeft';
import { CaretDownIcon } from 'phosphor-react-native/src/icons/CaretDown';
import { ArrowLeftIcon } from 'phosphor-react-native/src/icons/ArrowLeft';
import { WarningIcon } from 'phosphor-react-native/src/icons/Warning';
import { InfoIcon } from 'phosphor-react-native/src/icons/Info';
import { LeafIcon } from 'phosphor-react-native/src/icons/Leaf';
import { EggIcon } from 'phosphor-react-native/src/icons/Egg';
import { BasketIcon } from 'phosphor-react-native/src/icons/Basket';
import { FishIcon } from 'phosphor-react-native/src/icons/Fish';
import { PlantIcon } from 'phosphor-react-native/src/icons/Plant';
import { TruckIcon } from 'phosphor-react-native/src/icons/Truck';
import { BriefcaseIcon } from 'phosphor-react-native/src/icons/Briefcase';
import { FunnelIcon } from 'phosphor-react-native/src/icons/Funnel';
import { PencilSimpleIcon } from 'phosphor-react-native/src/icons/PencilSimple';
import { ImageIcon } from 'phosphor-react-native/src/icons/Image';
import { StarIcon } from 'phosphor-react-native/src/icons/Star';
import { LockIcon } from 'phosphor-react-native/src/icons/Lock';
import { DeviceMobileIcon } from 'phosphor-react-native/src/icons/DeviceMobile';
import { PhoneIcon } from 'phosphor-react-native/src/icons/Phone';
import { TagIcon } from 'phosphor-react-native/src/icons/Tag';
import { SquaresFourIcon } from 'phosphor-react-native/src/icons/SquaresFour';
import { FileTextIcon } from 'phosphor-react-native/src/icons/FileText';
import { ListBulletsIcon } from 'phosphor-react-native/src/icons/ListBullets';
import { SignOutIcon } from 'phosphor-react-native/src/icons/SignOut';
import { EyeIcon } from 'phosphor-react-native/src/icons/Eye';
import { EyeSlashIcon } from 'phosphor-react-native/src/icons/EyeSlash';
import { EnvelopeSimpleIcon } from 'phosphor-react-native/src/icons/EnvelopeSimple';
import { SealCheckIcon } from 'phosphor-react-native/src/icons/SealCheck';
import { HandCoinsIcon } from 'phosphor-react-native/src/icons/HandCoins';
import { ScalesIcon } from 'phosphor-react-native/src/icons/Scales';
import { SunIcon } from 'phosphor-react-native/src/icons/Sun';
import { MoonIcon } from 'phosphor-react-native/src/icons/Moon';
import { CameraIcon } from 'phosphor-react-native/src/icons/Camera';
import { FlagIcon } from 'phosphor-react-native/src/icons/Flag';
import { MapTrifoldIcon } from 'phosphor-react-native/src/icons/MapTrifold';
import { PathIcon } from 'phosphor-react-native/src/icons/Path';
import { ThumbsUpIcon } from 'phosphor-react-native/src/icons/ThumbsUp';
import { GearIcon } from 'phosphor-react-native/src/icons/Gear';
import { ArrowsLeftRightIcon } from 'phosphor-react-native/src/icons/ArrowsLeftRight';
import { MonitorIcon } from 'phosphor-react-native/src/icons/Monitor';
import { SparkleIcon } from 'phosphor-react-native/src/icons/Sparkle';
import { HeartIcon } from 'phosphor-react-native/src/icons/Heart';
import { CalendarIcon } from 'phosphor-react-native/src/icons/Calendar';
import { ChartBarIcon } from 'phosphor-react-native/src/icons/ChartBar';
import { WalletIcon } from 'phosphor-react-native/src/icons/Wallet';

const MAP = {
  home: HouseIcon,
  store: StorefrontIcon,
  box: PackageIcon,
  receipt: ReceiptIcon,
  bell: BellIcon,
  user: UserIcon,
  users: UsersIcon,
  search: MagnifyingGlassIcon,
  plus: PlusIcon,
  minus: MinusIcon,
  share: ShareNetworkIcon,
  check: CheckIcon,
  card: CreditCardIcon,
  shield: ShieldCheckIcon,
  pin: MapPinIcon,
  clock: ClockIcon,
  menu: ListIcon,
  close: XIcon,
  copy: CopyIcon,
  chat: ChatCircleIcon,
  whatsapp: WhatsappLogoIcon,
  upload: UploadSimpleIcon,
  chev: CaretRightIcon,
  chevLeft: CaretLeftIcon,
  chevDown: CaretDownIcon,
  back: ArrowLeftIcon,
  alert: WarningIcon,
  info: InfoIcon,
  leaf: LeafIcon,
  egg: EggIcon,
  basket: BasketIcon,
  fish: FishIcon,
  plant: PlantIcon,
  truck: TruckIcon,
  briefcase: BriefcaseIcon,
  filter: FunnelIcon,
  edit: PencilSimpleIcon,
  image: ImageIcon,
  star: StarIcon,
  lock: LockIcon,
  phone: DeviceMobileIcon,
  call: PhoneIcon,
  tag: TagIcon,
  grid: SquaresFourIcon,
  doc: FileTextIcon,
  list: ListBulletsIcon,
  logout: SignOutIcon,
  eye: EyeIcon,
  eyeOff: EyeSlashIcon,
  mail: EnvelopeSimpleIcon,
  seal: SealCheckIcon,
  coins: HandCoinsIcon,
  scales: ScalesIcon,
  sun: SunIcon,
  moon: MoonIcon,
  camera: CameraIcon,
  flag: FlagIcon,
  map: MapTrifoldIcon,
  route: PathIcon,
  thumbsup: ThumbsUpIcon,
  gear: GearIcon,
  swap: ArrowsLeftRightIcon,
  monitor: MonitorIcon,
  sparkle: SparkleIcon,
  heart: HeartIcon,
  calendar: CalendarIcon,
  chart: ChartBarIcon,
  wallet: WalletIcon,
} as const;

export type IconName = keyof typeof MAP;

/** Decorative by default. Pass `label` when the icon is the only content of a control. */
export function Icon({ name, size = 20, color, weight = 'regular', label }: { name: IconName; size?: number; color?: string; weight?: IconWeight; label?: string }) {
  const { c } = useTheme();
  const C = MAP[name] as React.ComponentType<IconProps>;
  const icon = <C size={size} color={color ?? c.ink} weight={weight} />;
  return label ? <View accessible accessibilityRole="image" accessibilityLabel={label}>{icon}</View> : icon;
}
