import { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

const PhotoModal = observer(
  ({ photo, onClose, onClickOutside, onNavigate }) => {
    const navigate = useNavigate();
    const { albumId } = useParams();

    const handleClose = useCallback(() => {
      navigate(`/album/${albumId}`, { replace: true });
      onClose();
    }, [navigate, albumId, onClose]);

    const handleNavigate = useCallback(
      (direction) => {
        onNavigate(direction);
      },
      [onNavigate]
    );

    const handleKeyDown = useCallback(
      (event) => {
        if (event.key === "ArrowLeft") {
          handleNavigate(-1);
        } else if (event.key === "ArrowRight") {
          handleNavigate(1);
        } else if (event.key === "Escape") {
          handleClose();
        }
      },
      [handleNavigate, handleClose]
    );

    useEffect(() => {
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [handleKeyDown]);

    if (!photo) return null;

    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClick={onClickOutside}
      >
        <div className="relative bg-white p-7 rounded-lg max-w-full max-h-full overflow-hidden">
          <div className="flex items-center justify-center max-w-full max-h-full">
            <img
              src={`http://localhost:8055/assets/${photo.photo}`}
              alt="Photo"
              className="max-w-[90vw] max-h-[90vh] object-contain"
            />
          </div>

          <button
            onClick={handleClose}
            className="absolute top-0 right-2 text-gray-500 text-3xl bg-transparent border-none cursor-pointer hover:text-gray-700 transition-colors"
            style={{ zIndex: 20 }}
          >
            &times;
          </button>

          <button
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white text-gray-500 text-2xl p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            onClick={() => handleNavigate(-1)}
            style={{ zIndex: 20 }}
          >
            &larr;
          </button>

          <button
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-gray-500 text-2xl p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            onClick={() => handleNavigate(1)}
            style={{ zIndex: 20 }}
          >
            &rarr;
          </button>
        </div>
      </div>
    );
  }
);

PhotoModal.propTypes = {
  photo: PropTypes.shape({
    photo: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onClickOutside: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

export default PhotoModal;
