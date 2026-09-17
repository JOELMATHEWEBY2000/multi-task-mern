function Pagination({
    page,
    totalPages,
    onPageChange
}) {

    return (
        <div className="flex items-center justify-between mt-5">

            <button
                disabled={page <= 1}
                onClick={() =>
                    onPageChange(page - 1)
                }
                className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-40"
            >
                Previous
            </button>

            <span className="text-gray-600">
                Page {page} of {totalPages || 1}
            </span>

            <button
                disabled={page >= totalPages}
                onClick={() =>
                    onPageChange(page + 1)
                }
                className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-40"
            >
                Next
            </button>

        </div>
    );
}

export default Pagination;