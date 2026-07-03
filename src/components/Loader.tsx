function Loader() {
	return (
		<>
			<div className="flex">
				<div className="custom-loader"></div>
			</div>
			<style lang="css">
				{`
                    @import url('../styles/Variables.sass');

                    .custom-loader {
                        width: 50px;
                        height: 50px;
                        display: grid;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        border:4px solid #0000;
                        border-radius: 50%;
                        border-color: #E4E4ED #0000;
                        animation: s6 3s infinite linear;
                        transition: none !important;
                    }
                    .custom-loader::before,
                    .custom-loader::after {    
                        content: "";
                        grid-area: 1/1;
                        margin: 2px;
                        border: inherit;
                        border-radius: 50%;
                    }
                    .custom-loader::before {
                        border-color: var(--accent, #E36A6A) #0000;
                        animation: inherit; 
                        animation-duration: 0.5s;
                        animation-direction: reverse;
                    }
                    .custom-loader::after {
                        margin: 8px;
                    }

                    @keyframes s6 { 
                        100%{transform: rotate(1turn)}
                    }
                `}
			</style>
		</>
	);
}

export default Loader;
