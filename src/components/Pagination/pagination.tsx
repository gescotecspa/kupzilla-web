import "../../styles/components/_pagination.scss"; // Archivo opcional para estilos.
import LeftArrow from "../../assets/icons/left.svg";
import RightArrow from "../../assets/icons/right.svg";
import DoubleLeftArrow from "../../assets/icons/leftx2.svg";
import DoubleRightArrow from "../../assets/icons/rightx2.svg";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ totalPages, currentPage, onPageChange }: PaginationProps) => {
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getVisiblePages = () => {
    const maxVisiblePages = 3;
    const pages: number[] = [];
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) pages.push(1); 
      if (startPage > 2) pages.push(-1); 

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) pages.push(-1); 
      if (endPage < totalPages) pages.push(totalPages); 
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="pagination">
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="page-button-arrow"
      >
        <img src={DoubleLeftArrow} alt="Primera página" className="arrow-icon" />
      </button>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="page-button-arrow"
      >
        <img src={LeftArrow} alt="Página anterior" className="arrow-icon" />
      </button>

      {visiblePages.map((page, index) =>
        page === -1 ? (
          <span key={`ellipsis-${index}`} className="ellipsis">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`page-button ${currentPage === page ? "active" : ""}`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="page-button-arrow"
      >
        <img src={RightArrow} alt="Página siguiente" className="arrow-icon" />
      </button>
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="page-button-arrow"
      >
        <img src={DoubleRightArrow} alt="Última página" className="arrow-icon" />
      </button>
    </div>
  );
};

export default Pagination;
