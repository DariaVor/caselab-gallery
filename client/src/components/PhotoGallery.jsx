import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import galleryStore from "../stores/GalleryStore";
import PhotoModal from "./PhotoModal";
import Loader from "./Loader";

const PhotoGallery = observer(() => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    galleryStore.fetchPhotos(albumId);
  }, [albumId]);

  if (galleryStore.loading) {
    return <Loader />;
  }

  const handleClickOutside = (event) => {
    if (event.target === event.currentTarget) {
      setSelectedPhoto(null);
      navigate(`/album/${albumId}`, { replace: true });
    }
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const handlePageChange = (direction) => {
    const newPage = galleryStore.currentPage + direction;
    if (newPage >= 1 && newPage <= galleryStore.totalPages) {
      galleryStore.fetchPhotos(albumId, newPage);
    }
  };

  const handleNavigate = (direction) => {
    const currentIndex = galleryStore.photos.findIndex(
      (p) => p.id === selectedPhoto.id
    );
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < galleryStore.photos.length) {
      setSelectedPhoto(galleryStore.photos[newIndex]);
    }
  };

  const albumTitle = galleryStore.albumTitle;

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4 max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto break-words">
        Альбом «{albumTitle}»
      </h1>
      <button
        className="mb-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        onClick={() => navigate("/")}
      >
        Назад к альбомам
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {galleryStore.photos.map((photo) => (
          <div key={photo.id} className="relative cursor-pointer group">
            <img
              src={photo.thumbnail}
              alt={`Фото ${photo.id}`}
              className="w-full h-48 object-cover rounded shadow-md group-hover:shadow-xl transition-shadow"
              onClick={() => handlePhotoClick(photo)}
            />
          </div>
        ))}
      </div>

      {galleryStore.photos.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-l hover:bg-gray-400 disabled:bg-gray-200"
            onClick={() => handlePageChange(-1)}
            disabled={galleryStore.currentPage === 1}
          >
            Назад
          </button>
          <span className="px-4 py-2 bg-gray-200 text-gray-800">
            {galleryStore.currentPage} из {galleryStore.totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-r hover:bg-gray-400 disabled:bg-gray-200"
            onClick={() => handlePageChange(1)}
            disabled={galleryStore.currentPage === galleryStore.totalPages}
          >
            Вперёд
          </button>
        </div>
      )}

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onClickOutside={handleClickOutside}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
});

export default PhotoGallery;
