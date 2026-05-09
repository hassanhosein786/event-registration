import Button from "./Button";

const Pagination = ({ page, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-between gap-3 text-sm text-slate-300">
      <div>
        Page <span className="font-semibold text-white">{page}</span> of{" "}
        <span className="font-semibold text-white">{totalPages}</span>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => onPageChange(Math.max(page - 1, 1))} disabled={page <= 1}>
          Previous
        </Button>
        <Button variant="secondary" onClick={() => onPageChange(Math.min(page + 1, totalPages))} disabled={page >= totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
