import { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import UserList from "./UserList";

const Sidebar = () => {
    const { user } = useAuthContext();
    const [query, setQuery] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const handleMenuClick = () => {
        const sidebar = document.querySelector(".sidebar");
        sidebar.classList.toggle("active");
    }

    const handleSearch = async () => {
        const response = await fetch(`/api/user?search=${query}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();
        setSearchResult(json);
    }

    /*
    let inputField = document.getElementById("searchUser");
    inputField.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    });
    */
    
    return (
        <div className="sidebar">
            <div className="searchWord">
                <div>Search Users</div>
                <span className="material-symbols-outlined menuSymbol" onClick={handleMenuClick}>menu</span>
            </div>

            <div className="searchBar">
                <input 
                    id="searchUser"
                    type="text"
                    placeholder="Search by name or email"
                    onChange={(e) => setQuery(e.target.value)}
                    value={query}
                    onKeyDown={handleSearch}
                />
                <span className="material-symbols-outlined personSearchSymbol" onClick={handleSearch}>person_search</span>
            </div>

            <div className="people">
                {searchResult && searchResult.map((person) => {
                    return (
                        <UserList 
                        key={person._id} 
                        person={person}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default Sidebar;