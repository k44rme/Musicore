import logo from "@assets/Musicore Full.svg"
import Search from "../components/Search"

function SearchPage() {
    return (
        <>
            <img src={logo} alt="" className="logo" />
            <Search />
        </>
    )

}

export default SearchPage