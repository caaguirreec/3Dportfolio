import { gallery } from "../constants";
const Gallery = () => {
    
    return (
    <div className="gallery">
        {gallery.map((gallery, index) => (
            <img key= {index} src={gallery.imageUrl} className="gallery_item"/>
        ))}
            
    </div>
    );
  }

  

export default Gallery;
