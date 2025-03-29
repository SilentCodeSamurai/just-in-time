"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
	value: string;
	onChange: (value: string) => void;
	onBlur?: () => void;
}

function ColorPicker({
	disabled,
	value,
	onChange,
	onBlur,
	name,
	className,
	...props
}: Omit<React.ComponentProps<"button">, "value" | "onChange" | "onBlur"> & ColorPickerProps) {
	const [open, setOpen] = useState(false);

	const parsedValue = useMemo(() => {
		return value || "#FFFFFF";
	}, [value]);

	return (
		<Popover onOpenChange={setOpen} open={open}>
			<PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
				<Button
					{...props}
					className={cn("block", className)}
					name={name}
					onClick={() => {
						setOpen(true);
					}}
					size="icon"
					style={{
						backgroundColor: parsedValue,
					}}
					variant="outline"
				>
					<div />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full">
				<HexColorPicker color={parsedValue} onChange={onChange} />
				<Input
					maxLength={7}
					onChange={(e) => {
						onChange(e?.currentTarget?.value);
					}}
					value={parsedValue}
				/>
			</PopoverContent>
		</Popover>
	);
}

ColorPicker.displayName = "ColorPicker";

export { ColorPicker };
