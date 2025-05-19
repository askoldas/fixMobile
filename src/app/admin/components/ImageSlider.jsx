import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { useImageUrl } from "@/hooks/useImageUrl";
import styles from "@/app/admin/styles/image-slider.module.scss";

export default function ImageSlider({ imageUrls = [], onAddImage }) {
  const [newImages, setNewImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fileInputRef = useRef(null);

  const totalSlides = imageUrls.length + newImages.length + 1;
  const isUploadSlide = currentIndex === totalSlides - 1;

  const storageImagePath =
    currentIndex < imageUrls.length ? imageUrls[currentIndex] : null;
  const resolvedStorageUrl = useImageUrl(storageImagePath);

  const displayedImageUrl =
    currentIndex < imageUrls.length
      ? resolvedStorageUrl
      : currentIndex < totalSlides - 1
      ? URL.createObjectURL(newImages[currentIndex - imageUrls.length])
      : null;

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImages((prev) => [...prev, file]);
      onAddImage(file);
      setCurrentIndex(totalSlides - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalSlides - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  return (
    <div className={styles.slider}>
      <div className={styles.previewWrapper}>
        {currentIndex > 0 && (
          <div className={`${styles.navArrow} ${styles.left}`} onClick={handlePrev}>
            ❮
          </div>
        )}

        {currentIndex < totalSlides - 1 && (
          <div className={`${styles.navArrow} ${styles.right}`} onClick={handleNext}>
            ❯
          </div>
        )}

        <div className={styles.preview}>
          {isUploadSlide ? (
            <div
              className={styles.uploadTile}
              onClick={() => fileInputRef.current?.click()}
            >
              + Upload Image
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageSelect}
              />
            </div>
          ) : displayedImageUrl ? (
            <img src={displayedImageUrl} alt="Preview" />
          ) : (
            <div className={styles.noImage}>No Image</div>
          )}
        </div>
      </div>
    </div>
  );
}

ImageSlider.propTypes = {
  imageUrls: PropTypes.arrayOf(PropTypes.string),
  onAddImage: PropTypes.func.isRequired,
};
