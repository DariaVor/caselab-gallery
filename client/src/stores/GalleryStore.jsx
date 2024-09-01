import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";

class GalleryStore {
  albums = [];
  photos = [];
  albumTitle = "";
  currentPage = 1;
  totalPages = 1;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setLoading(loading) {
    this.loading = loading;
  }

  setAlbums(albums) {
    this.albums = albums;
  }

  setPhotos(photos) {
    this.photos = photos;
  }

  setAlbumTitle(title) {
    this.albumTitle = title;
  }

  setCurrentPage(page) {
    this.currentPage = page;
  }

  setTotalPages(pages) {
    this.totalPages = pages;
  }

  async fetchAlbums() {
    this.setLoading(true);
    try {
      const response = await axios.get("http://localhost:8055/items/albums");
      const albums = response.data.data;

      const updatedAlbums = await Promise.all(
        albums.map(async (album) => {
          const photoResponse = await axios.get(
            `http://localhost:8055/items/photos?filter[album][id][_eq]=${album.id}`
          );
          const photos = photoResponse.data.data;
          const coverPhoto = photos.length > 0 ? photos[0].photo : null;
          const photoCount = photos.length;

          return {
            ...album,
            coverPhoto,
            photoCount,
          };
        })
      );

      runInAction(() => {
        this.setAlbums(updatedAlbums);
      });
    } catch (error) {
      console.error("Error fetching albums:", error);
    } finally {
      this.setLoading(false);
    }
  }

  async fetchPhotos(albumId, page = 1) {
    this.setLoading(true);
    try {
      const limit = 12;
      const offset = (page - 1) * limit;
      const response = await axios.get(
        `http://localhost:8055/items/photos?filter[album][id][_eq]=${albumId}&limit=${limit}&offset=${offset}`
      );
      const photos = response.data.data;

      const photosWithThumbnails = photos.map((photo) => ({
        ...photo,
        thumbnail: `http://localhost:8055/assets/${photo.photo}?fit=cover&width=292&height=192&quality=100`,
      }));

      const countResponse = await axios.get(
        `http://localhost:8055/items/photos?filter[album][id][_eq]=${albumId}&fields=id`
      );
      const totalPhotos = countResponse.data.data.length;
      const totalPages = Math.ceil(totalPhotos / limit);

      const albumResponse = await axios.get(
        `http://localhost:8055/items/albums/${albumId}`
      );
      const albumTitle = albumResponse.data.data.title;

      runInAction(() => {
        this.setPhotos(photosWithThumbnails);
        this.setAlbumTitle(albumTitle);
        this.setCurrentPage(page);
        this.setTotalPages(totalPages);
      });
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      this.setLoading(false);
    }
  }
}

const galleryStore = new GalleryStore();
export default galleryStore;
