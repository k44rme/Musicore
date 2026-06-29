import { lazy, Suspense } from "react";
import "@style/pages/Library.sass";
import "@style/Music.sass"
import Loader from "../Loader";

function Library() {
	const Music = lazy(() => import("../Music"));

	return (
		<div className="library-page Page">
			<Suspense fallback={<Loader />}>
				<Music />
			</Suspense>
		</div>
	);
}

export default Library;
