const Pagination = ({ usersPerPage, totalUsers, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="bg-white dark:bg-gray-900 p-4 flex  items-center justify-center">
            <ul className="pagination flex">
                {pageNumbers.map((number) => (
                    <li key={number} className="page-item">
                        <a onClick={() => paginate(number)} href="#" className={currentPage === number ? 'bg-gray-300 dark:bg-gray-600 px-4 py-2 rounded-lg m-2' : 'bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg m-2'}>
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination