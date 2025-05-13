import React from 'react';
import Button from '@/global/components/base/Button';
import styles from './pagination.module.scss';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className={styles.pagination}>
      <Button
        size="s"
        variant="secondary"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span className={styles.pageInfo}>
        {currentPage} of {totalPages}
      </span>
      <Button
        size="s"
        variant="secondary"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
