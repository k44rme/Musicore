import search from "@assets/icons/search_icon.svg";
import "@style/Search.sass";
import { useEffect, useState } from "react";

export default function Search() {
  const [val, setVal] = useState("");

  function onSubmitFunc(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("search_key", val)
  }

  useEffect(() => {
    let value = localStorage.getItem("search_key");
    if (value?.length != null ) console.log(value);
    
  })

  function searchField(e: React.ChangeEvent<HTMLInputElement>) {
    setVal(e.target.value); // update val on every change
  }

  return (
    <>
      <form className="search-box" action="/search" /* onSubmit={onSubmitFunc} */>
        <input
          type="text"
          name="q"
          id="search-field"
          value={val}
          onChange={searchField}
          placeholder="Search..."
        />
        <button type="submit" id="search-btn" onSubmit={onSubmitFunc}>
          <img src={search} />
        </button>
      </form>
    </>
  );
}