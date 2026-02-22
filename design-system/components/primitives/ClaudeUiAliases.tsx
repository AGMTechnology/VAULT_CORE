import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card } from "./Card";
import { Input } from "./Input";
import { Select } from "./Select";
import { Table } from "./Table";
import { TextArea } from "./TextArea";
import { Toggle } from "./Toggle";

type BoxProps = HTMLAttributes<HTMLElement> & { readonly children?: ReactNode };

function Box({ className, ...props }: BoxProps) {
  return <section className={cn("ds-alias-box", className)} {...props} />;
}

function Inline({ className, ...props }: BoxProps) {
  return <div className={cn("ds-alias-inline", className)} {...props} />;
}

export function Accordion(props: BoxProps) { return <Box {...props} />; }
export function AlertDialog(props: BoxProps) { return <Box {...props} />; }
export function Alert(props: BoxProps) { return <Box {...props} />; }
export function AspectRatio(props: BoxProps) { return <Box {...props} />; }
export function Avatar(props: BoxProps) { return <Inline {...props} />; }
export function Breadcrumb(props: BoxProps) { return <Inline {...props} />; }
export function Calendar(props: BoxProps) { return <Box {...props} />; }
export function Carousel(props: BoxProps) { return <Box {...props} />; }
export function Chart(props: BoxProps) { return <Box {...props} />; }
export function Checkbox(props: InputHTMLAttributes<HTMLInputElement>) { return <input type="checkbox" className="ds-checkbox" {...props} />; }
export function Collapsible(props: BoxProps) { return <Box {...props} />; }
export function Command(props: BoxProps) { return <Box {...props} />; }
export function ContextMenu(props: BoxProps) { return <Box {...props} />; }
export function Dialog(props: BoxProps) { return <Box {...props} />; }
export function Drawer(props: BoxProps) { return <Box {...props} />; }
export function DropdownMenu(props: BoxProps) { return <Box {...props} />; }
export function Form(props: BoxProps) { return <Box {...props} />; }
export function HoverCard(props: BoxProps) { return <Box {...props} />; }
export function InputOtp(props: InputHTMLAttributes<HTMLInputElement>) { return <Input className="ds-input-otp" {...props} />; }
export function Label(props: HTMLAttributes<HTMLLabelElement>) { return <label className="ds-label" {...props} />; }
export function Menubar(props: BoxProps) { return <Inline {...props} />; }
export function NavigationMenu(props: BoxProps) { return <Inline {...props} />; }
export function Pagination(props: BoxProps) { return <Inline {...props} />; }
export function Popover(props: BoxProps) { return <Box {...props} />; }
export function Progress(props: BoxProps) { return <Box {...props} />; }
export function RadioGroup(props: BoxProps) { return <Box {...props} />; }
export function Resizable(props: BoxProps) { return <Box {...props} />; }
export function ScrollArea(props: BoxProps) { return <Box {...props} />; }
export function Separator(props: HTMLAttributes<HTMLHRElement>) { return <hr className="ds-divider" {...props} />; }
export function Sheet(props: BoxProps) { return <Box {...props} />; }
export function Sidebar(props: BoxProps) { return <Box {...props} />; }
export function Skeleton(props: BoxProps) { return <Box className={cn("ds-skeleton", props.className)} {...props} />; }
export function Slider(props: InputHTMLAttributes<HTMLInputElement>) { return <input type="range" className="ds-slider" {...props} />; }
export function Sonner(props: BoxProps) { return <Box {...props} />; }
export function Switch(props: InputHTMLAttributes<HTMLInputElement>) { return <Toggle {...props} />; }
export function Tabs(props: BoxProps) { return <Inline {...props} />; }
export function ToggleGroup(props: BoxProps) { return <Inline {...props} />; }
export function Tooltip(props: BoxProps) { return <Inline {...props} />; }

export const ClaudeButton = Button;
export const ClaudeBadge = Badge;
export const ClaudeCard = Card;
export const ClaudeInput = Input;
export const ClaudeSelect = Select;
export const ClaudeTextarea = TextArea;
export const ClaudeTable = Table;

export function useMobile(): boolean {
  return false;
}

export const claudeUiUtilsTodo = "TODO: Port advanced utility helpers on-demand when a concrete page requires them.";
