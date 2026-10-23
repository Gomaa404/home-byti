import React from "react";
import { cn } from "@/lib/utils";

export interface LucideProps extends React.HTMLAttributes<HTMLElement> {
  size?: number | string;
  strokeWidth?: number | string;
  color?: string;
}

export type LucideIcon = React.FC<LucideProps>;

function createIcon(iconClass: string, displayName: string): LucideIcon {
  const IconComponent: React.FC<LucideProps> = ({
    className,
    size,
    strokeWidth: _strokeWidth,
    color,
    style,
    ...props
  }) => {
    let customFontSize: string | undefined = undefined;
    if (size) {
      customFontSize = typeof size === "number" ? `${size}px` : size;
    } else if (className) {
      const match = className.match(/(?:w|h|size)-\[([0-9.]+)px\]/);
      if (match) {
        customFontSize = `${match[1]}px`;
      }
    }

    const inlineStyles: React.CSSProperties = {
      ...(customFontSize ? { fontSize: customFontSize } : {}),
      ...(color ? { color } : {}),
      ...style,
    };

    return (
      <i
        className={cn(
          "lucide-icon inline-flex items-center justify-center shrink-0 not-italic leading-none select-none",
          iconClass,
          className
        )}
        style={Object.keys(inlineStyles).length > 0 ? inlineStyles : undefined}
        aria-hidden="true"
        {...props}
      />
    );
  };

  IconComponent.displayName = displayName;
  return IconComponent;
}

export const AlertCircle = createIcon("icon-alert-circle", "AlertCircle");
export const AlertTriangle = createIcon("icon-alert-triangle", "AlertTriangle");
export const Armchair = createIcon("icon-armchair", "Armchair");
export const ArrowLeft = createIcon("icon-arrow-left", "ArrowLeft");
export const ArrowLeftRight = createIcon("icon-arrow-left-right", "ArrowLeftRight");
export const ArrowRight = createIcon("icon-arrow-right", "ArrowRight");
export const ArrowRightLeft = createIcon("icon-arrow-right-left", "ArrowRightLeft");
export const ArrowUpDown = createIcon("icon-arrow-up-down", "ArrowUpDown");
export const ArrowUpRight = createIcon("icon-arrow-up-right", "ArrowUpRight");
export const AtSign = createIcon("icon-at-sign", "AtSign");
export const BadgeCheck = createIcon("icon-badge-check", "BadgeCheck");
export const Banknote = createIcon("icon-banknote", "Banknote");
export const BarChart2 = createIcon("icon-bar-chart-2", "BarChart2");
export const BarChart3 = createIcon("icon-bar-chart-3", "BarChart3");
export const Battery = createIcon("icon-battery", "Battery");
export const BatteryCharging = createIcon("icon-battery-charging", "BatteryCharging");
export const BatteryMedium = createIcon("icon-battery-medium", "BatteryMedium");
export const Bed = createIcon("icon-bed", "Bed");
export const BedDouble = createIcon("icon-bed-double", "BedDouble");
export const Bell = createIcon("icon-bell", "Bell");
export const Bookmark = createIcon("icon-bookmark", "Bookmark");
export const BookmarkCheck = createIcon("icon-bookmark-check", "BookmarkCheck");
export const Bot = createIcon("icon-bot", "Bot");
export const BrushCleaning = createIcon("icon-brush-cleaning", "BrushCleaning");
export const Building = createIcon("icon-building", "Building");
export const Building2 = createIcon("icon-building-2", "Building2");
export const Calendar = createIcon("icon-calendar", "Calendar");
export const CalendarCheck = createIcon("icon-calendar-check", "CalendarCheck");
export const CalendarDays = createIcon("icon-calendar-days", "CalendarDays");
export const CalendarPlus = createIcon("icon-calendar-plus", "CalendarPlus");
export const CalendarSync = createIcon("icon-calendar-sync", "CalendarSync");
export const CalendarX = createIcon("icon-calendar-x", "CalendarX");
export const CalendarX2 = createIcon("icon-calendar-x-2", "CalendarX2");
export const Camera = createIcon("icon-camera", "Camera");
export const Check = createIcon("icon-check", "Check");
export const CheckCheck = createIcon("icon-check-check", "CheckCheck");
export const CheckCircle = createIcon("icon-check-circle", "CheckCircle");
export const CheckCircle2 = createIcon("icon-check-circle-2", "CheckCircle2");
export const CheckSquare = createIcon("icon-check-square", "CheckSquare");
export const ChevronDown = createIcon("icon-chevron-down", "ChevronDown");
export const ChevronLeft = createIcon("icon-chevron-left", "ChevronLeft");
export const ChevronRight = createIcon("icon-chevron-right", "ChevronRight");
export const Circle = createIcon("icon-circle", "Circle");
export const CirclePause = createIcon("icon-circle-pause", "CirclePause");
export const ClipboardList = createIcon("icon-clipboard-list", "ClipboardList");
export const Clock = createIcon("icon-clock", "Clock");
export const Clock3 = createIcon("icon-clock-3", "Clock3");
export const Coffee = createIcon("icon-coffee", "Coffee");
export const Copy = createIcon("icon-copy", "Copy");
export const Cpu = createIcon("icon-cpu", "Cpu");
export const CreditCard = createIcon("icon-credit-card", "CreditCard");
export const Crosshair = createIcon("icon-crosshair", "Crosshair");
export const DollarSign = createIcon("icon-dollar-sign", "DollarSign");
export const DoorClosed = createIcon("icon-door-closed", "DoorClosed");
export const DoorOpen = createIcon("icon-door-open", "DoorOpen");
export const Download = createIcon("icon-download", "Download");
export const Edit = createIcon("icon-edit", "Edit");
export const ExternalLink = createIcon("icon-external-link", "ExternalLink");
export const Eye = createIcon("icon-eye", "Eye");
export const EyeOff = createIcon("icon-eye-off", "EyeOff");
export const FileCheck = createIcon("icon-file-check", "FileCheck");
export const FileDown = createIcon("icon-file-down", "FileDown");
export const FileEdit = createIcon("icon-file-edit", "FileEdit");
export const FileSignature = createIcon("icon-file-signature", "FileSignature");
export const FileText = createIcon("icon-file-text", "FileText");
export const Filter = createIcon("icon-filter", "Filter");
export const Flag = createIcon("icon-flag", "Flag");
export const Globe = createIcon("icon-globe", "Globe");
export const HelpCircle = createIcon("icon-help-circle", "HelpCircle");
export const History = createIcon("icon-history", "History");
export const Home = createIcon("icon-home", "Home");
export const Hourglass = createIcon("icon-hourglass", "Hourglass");
export const HousePlus = createIcon("icon-house-plus", "HousePlus");
export const IdCard = createIcon("icon-id-card", "IdCard");
export const Image = createIcon("icon-image", "Image");
export const Info = createIcon("icon-info", "Info");
export const Key = createIcon("icon-key", "Key");
export const KeyRound = createIcon("icon-key-round", "KeyRound");
export const Landmark = createIcon("icon-landmark", "Landmark");
export const Laptop = createIcon("icon-laptop", "Laptop");
export const Layers = createIcon("icon-layers", "Layers");
export const LayoutGrid = createIcon("icon-layout-grid", "LayoutGrid");
export const Loader2 = createIcon("icon-loader-2", "Loader2");
export const Lock = createIcon("icon-lock", "Lock");
export const LogIn = createIcon("icon-log-in", "LogIn");
export const LogOut = createIcon("icon-log-out", "LogOut");
export const Mail = createIcon("icon-mail", "Mail");
export const Map = createIcon("icon-map", "Map");
export const MapPin = createIcon("icon-map-pin", "MapPin");
export const Maximize2 = createIcon("icon-maximize-2", "Maximize2");
export const Menu = createIcon("icon-menu", "Menu");
export const MessageSquare = createIcon("icon-message-square", "MessageSquare");
export const Minus = createIcon("icon-minus", "Minus");
export const MinusCircle = createIcon("icon-minus-circle", "MinusCircle");
export const Moon = createIcon("icon-moon", "Moon");
export const MoreHorizontal = createIcon("icon-more-horizontal", "MoreHorizontal");
export const MoreVertical = createIcon("icon-more-vertical", "MoreVertical");
export const Navigation = createIcon("icon-navigation", "Navigation");
export const Network = createIcon("icon-network", "Network");
export const Pause = createIcon("icon-pause", "Pause");
export const Pencil = createIcon("icon-pencil", "Pencil");
export const Percent = createIcon("icon-percent", "Percent");
export const Phone = createIcon("icon-phone", "Phone");
export const PhoneCall = createIcon("icon-phone-call", "PhoneCall");
export const Plane = createIcon("icon-plane", "Plane");
export const Play = createIcon("icon-play", "Play");
export const Plus = createIcon("icon-plus", "Plus");
export const PlusCircle = createIcon("icon-plus-circle", "PlusCircle");
export const Radio = createIcon("icon-radio", "Radio");
export const Receipt = createIcon("icon-receipt", "Receipt");
export const RefreshCw = createIcon("icon-refresh-cw", "RefreshCw");
export const RotateCcw = createIcon("icon-rotate-ccw", "RotateCcw");
export const Save = createIcon("icon-save", "Save");
export const Search = createIcon("icon-search", "Search");
export const Send = createIcon("icon-send", "Send");
export const SendHorizontal = createIcon("icon-send-horizontal", "SendHorizontal");
export const Settings = createIcon("icon-settings", "Settings");
export const Shapes = createIcon("icon-shapes", "Shapes");
export const Share2 = createIcon("icon-share-2", "Share2");
export const Shield = createIcon("icon-shield", "Shield");
export const ShieldAlert = createIcon("icon-shield-alert", "ShieldAlert");
export const ShieldCheck = createIcon("icon-shield-check", "ShieldCheck");
export const Sliders = createIcon("icon-sliders", "Sliders");
export const SlidersHorizontal = createIcon("icon-sliders-horizontal", "SlidersHorizontal");
export const Smartphone = createIcon("icon-smartphone", "Smartphone");
export const Sparkles = createIcon("icon-sparkles", "Sparkles");
export const SquareCheck = createIcon("icon-square-check", "SquareCheck");
export const SquarePen = createIcon("icon-square-pen", "SquarePen");
export const Star = createIcon("icon-star", "Star");
export const StickyNote = createIcon("icon-sticky-note", "StickyNote");
export const Tag = createIcon("icon-tag", "Tag");
export const Thermometer = createIcon("icon-thermometer", "Thermometer");
export const Ticket = createIcon("icon-ticket", "Ticket");
export const ToggleRight = createIcon("icon-toggle-right", "ToggleRight");
export const Trash2 = createIcon("icon-trash-2", "Trash2");
export const TrendingUp = createIcon("icon-trending-up", "TrendingUp");
export const Tv = createIcon("icon-tv", "Tv");
export const Upload = createIcon("icon-upload", "Upload");
export const User = createIcon("icon-user", "User");
export const UserCheck = createIcon("icon-user-check", "UserCheck");
export const UserCircle2 = createIcon("icon-user-circle-2", "UserCircle2");
export const UserPlus = createIcon("icon-user-plus", "UserPlus");
export const UserRound = createIcon("icon-user-round", "UserRound");
export const UserSearch = createIcon("icon-user-search", "UserSearch");
export const Users = createIcon("icon-users", "Users");
export const Users2 = createIcon("icon-users-2", "Users2");
export const Video = createIcon("icon-video", "Video");
export const Wallet = createIcon("icon-wallet", "Wallet");
export const Wand2 = createIcon("icon-wand-2", "Wand2");
export const Wifi = createIcon("icon-wifi", "Wifi");
export const WifiOff = createIcon("icon-wifi-off", "WifiOff");
export const Wind = createIcon("icon-wind", "Wind");
export const Workflow = createIcon("icon-workflow", "Workflow");
export const Wrench = createIcon("icon-wrench", "Wrench");
export const X = createIcon("icon-x", "X");
export const XCircle = createIcon("icon-x-circle", "XCircle");
export const Zap = createIcon("icon-zap", "Zap");

// Common aliases used in components
export const CalendarIcon = Calendar;
