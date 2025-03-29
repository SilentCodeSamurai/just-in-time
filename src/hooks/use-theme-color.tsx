import { createContext, memo, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface ThemeColorContextType {
	color?: string | undefined;
	setColor: React.Dispatch<React.SetStateAction<string>>;
}

export interface ThemeColorProviderProps extends React.PropsWithChildren {
	storageKey?: string | undefined;
	nonce?: string | undefined;
	fallback?: string | undefined;
}

const ColorContext = createContext<ThemeColorContextType | undefined>(undefined);
const defaultContext: ThemeColorContextType = {
	color: undefined,
	setColor: () => {},
};

export const useThemeColor = () => useContext(ColorContext) ?? defaultContext;

export const ThemeColorProvider = (props: ThemeColorProviderProps): React.ReactNode => {
	const context = useContext(ColorContext);

	// Ignore nested context providers, just passthrough children
	if (context) return props.children;
	return <ThemeColor {...props} />;
};

const ThemeColor = ({ storageKey = "theme-color", fallback = "#FFFFFF", nonce, children }: ThemeColorProviderProps) => {
	const [color, setColorState] = useState(getColor(storageKey, fallback));
	const setColor = useCallback(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		(value: string) => {
			setColorState(value);
			// Save to storage
			try {
				localStorage.setItem(storageKey, value);
			} catch (e) {
				// Unsupported
			}
		},
		[color]
	);

	const applyColor = useCallback(
		(color: string | undefined) => {
			let resolved = color;
			if (!resolved) return;
			const d = document.documentElement;
			d.style.setProperty("--primary", resolved);
		},
		[color]
	);

	useEffect(() => {
		applyColor(color);
	}, [color]);

	useEffect(() => {
		const handleStorage = (e: StorageEvent) => {
			if (e.key !== storageKey) {
				return;
			}
			const theme = e.newValue || fallback;
			setColor(theme);
		};
		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, [setColor]);

	const providerValue = useMemo(
		() => ({
			color,
			setColor,
		}),
		[color, setColor, applyColor]
	);
	return (
		<ColorContext.Provider value={providerValue}>
			<ThemeColorScript
				{...{
					fallback,
					storageKey,
					nonce,
				}}
			/>
			{children}
		</ColorContext.Provider>
	);
};

const isServer = typeof window === "undefined";

const getColor = (key: string, fallback?: string) => {
	if (isServer) return undefined;
	let theme: string | undefined;
	try {
		theme = localStorage.getItem(key) || undefined;
	} catch (e) {
		// Unsupported
	}
	return theme || fallback;
};

export default ThemeColor;

const ThemeColorScript = memo(
	({ storageKey, fallback, nonce }: Omit<ThemeColorProviderProps, "children"> & { fallback: string }) => {
		const scriptArgs = JSON.stringify([storageKey, fallback]).slice(1, -1);

		return (
			<script
				suppressHydrationWarning
				nonce={typeof window === "undefined" ? nonce : ""}
				dangerouslySetInnerHTML={{ __html: `(${script.toString()})(${scriptArgs})` }}
			/>
		);
		// <></>
	}
);

export const script: (...args: any[]) => void = (storageKey, fallback) => {
	const el = document.documentElement;
	try {
		const saved = localStorage.getItem(storageKey);
		const color = saved || fallback;
		el.style.setProperty("--primary", color);
	} catch (e) {
		//
	}
};
