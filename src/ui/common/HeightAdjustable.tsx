import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const HeightAdjustableContext = createContext({} as any);

type Props = {
	initialHeight: Number
}

export const HeightAdjustable = ({ children, initialHeight, ...props }) => {
	const [adjustedHeight, setAdjustedHeight] = useState<number>(initialHeight);
	const yDividerPos = useRef<number | null>(null);

	const onMouseHoldDown = (e: MouseEvent) => {
		yDividerPos.current = e.clientY;
	};

	const onMouseHoldUp = () => {
		yDividerPos.current = null;
	};

	const onMouseHoldMove = (e: MouseEvent) => {
		if (yDividerPos.current) {
			setAdjustedHeight(window.innerHeight - e.clientY);

			yDividerPos.current = e.clientY;
		}
	};

	useEffect(() => {
		document.addEventListener("mouseup", onMouseHoldUp);
		document.addEventListener("mousemove", onMouseHoldMove);

		return () => {
			document.removeEventListener("mouseup", onMouseHoldUp);
			document.removeEventListener("mousemove", onMouseHoldMove);
		};
	});

	return (
		<div className="bg-obs-primary" style={{ height: adjustedHeight + 'px' }} {...props}>
			<HeightAdjustableContext.Provider
				value={{
					onMouseHoldDown,
				}}
			>
				{children}
			</HeightAdjustableContext.Provider>
		</div>
	);
};

export const HeightAdjustableHandle = (props) => {
	const { onMouseHoldDown } = useContext(HeightAdjustableContext);

	return <div {...props} className="relative w-full bg-obs-modifier-border h-4px">
		<div className="absolute left-0 right-0 bg-transparent opacity-50 -top-3 -bottom-3" style={{ cursor: 'row-resize' }} onMouseDown={onMouseHoldDown}></div>
	</div>;
};
