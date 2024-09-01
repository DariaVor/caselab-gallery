import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import galleryStore from "../stores/GalleryStore";
import Loader from "./Loader";

const AlbumList = observer(() => {
  useEffect(() => {
    galleryStore.fetchAlbums();
  }, []);

  if (galleryStore.loading) {
    return <Loader />;
  }

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Альбомы</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryStore.albums.map((album) => (
          <Link
            key={album.id}
            to={`/album/${album.id}`}
            className="border p-4 cursor-pointer rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between h-80"
          >
            <img
              src={
                album.coverPhoto
                  ? `http://localhost:8055/assets/${album.coverPhoto}`
                  : "/icon.svg"
              }
              alt={`Обложка альбома ${album.title}`}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <div className="flex flex-col flex-grow">
              <h2 className="text-xl font-semibold truncate">{album.title}</h2>
              <p className="text-gray-500 mt-2">{album.photoCount} фото</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});

export default AlbumList;
