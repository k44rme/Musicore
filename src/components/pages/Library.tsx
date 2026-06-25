import { lazy, Suspense } from "react";
import "@style/pages/LibraryPage.sass";
import "@style/Music.sass"

function Library() {
	const Music = lazy(() => import("../Music"));

	return (
		<div className="library-page">
			<Suspense fallback={<Loading />}>
				<Music />
			</Suspense>
		</div>
	);
}

function Loading() {
	return (
		<span
			style={{
				position: "absolute",
				transform: "translateX(25vw)",
				marginTop: "50dvh",
			}}
		>
			Loading...
		</span>
	);
}

export default Library;
