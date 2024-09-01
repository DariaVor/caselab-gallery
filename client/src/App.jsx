import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AlbumList from "./components/AlbumList";
import PhotoGallery from "./components/PhotoGallery";
import NotFound from "./components/NotFound";

const App = () => {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<AlbumList />} />
          <Route path="/album/:albumId" element={<PhotoGallery />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
