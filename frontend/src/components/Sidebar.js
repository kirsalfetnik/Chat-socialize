const Sidebar = () => {

    const handleMenuClick = () => {
        const sidebar = document.querySelector(".sidebar");
        sidebar.classList.toggle("active");
    }
    
    return (
        <div className="sidebar">
            <div className="searchWord">
                <div>Search Users</div>
                <span className="material-symbols-outlined menuSymbol" onClick={handleMenuClick}>menu</span>
            </div>

            <div className="searchBar">
                <input placeholder="Search by name or email"></input>
                <span className="material-symbols-outlined personSearchSymbol">person_search</span>
            </div>
        </div>
    )
}

export default Sidebar;