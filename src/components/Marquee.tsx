import { ReactNode, useEffect, useRef, useState } from "react";
import "@style/Marquee.sass";

function Marquee({
	children,
	className,
	style
}: {
	children: ReactNode;
	className?: string;
	style?: React.CSSProperties
}) {

	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const [shouldScroll, setShouldScroll] = useState(false);
	const [contentWidth, setContentWidth] = useState(0);

	useEffect(() => {
		const checkOverflow = () => {
			const container = containerRef.current;
			const content = contentRef.current;

			if (container && content) {
				const isOverflowing =
					content.offsetWidth > 310;
				setShouldScroll(isOverflowing);
				setContentWidth(content.offsetWidth)

				if (shouldScroll) {
					content.classList.add("animate-marquee")
					content.classList.remove("marquee")
				} else {
					content.classList.remove("animate-marquee")
					content.classList.add("marquee")
				}

				content.addEventListener("change", () => {
					content.style.transform = "translate(0%)" 
				})
			}
		};

		checkOverflow();
		window.addEventListener("resize", checkOverflow);

		return () => {
			window.removeEventListener("resize", checkOverflow);
		};
	});

	return (
		<div
			className={"marquee-container " + `${className}`}
			style={style}
            ref={containerRef}
		>
			<div
				className="marquee-content"
                ref={contentRef}
			>
				{children}
				{shouldScroll && children}
			</div>
			<style lang="css">
				{`
					
					.animate-marquee {
						animation: marquee-left calc(${contentWidth} * 0.007s) linear infinite;
					}

					.marquee {
						animation: none;
						text-align: center;
					}

				`}
			</style>
		</div>
	);
}

export default Marquee;
