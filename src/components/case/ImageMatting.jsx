import classNames from "classnames";
import { useMemo, useEffect, useState } from "react";
import { ReactComponent as ChevronLeftIcon } from "./icons/ChevronLeft.svg";
import { ReactComponent as EditIcon } from "./icons/Edit.svg";
import { ReactComponent as SpinnerIcon } from "./icons/Spinner.svg";
import { ReactComponent as UploadIcon } from "./icons/Upload.svg";
import classes from "./ImageMatting.module.css";
import { useImageMatting } from "./ImageMattingContext";
import { getCropped, getBorders } from "image-trim";

const IMAGE_URLS = [
  {
    url: "https://images.unsplash.com/photo-1569339500890-0740003e2f47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1335&q=80",
    alt: "Templo Bahá'í de Sudamérica, Santiago de Chile.",
  },
  {
    url: "https://images.unsplash.com/photo-1688257609244-3f2a893f19d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1838&q=80",
    alt: "Bahá’í house of worship in India.",
  },
  {
    url: "https://images.unsplash.com/photo-1661925207347-fedec12e0982?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80",
    alt: "Bahá’í House of Worship in North America (Chicago - Wilmette, Illinois)",
  },
  // {
  //   url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=pauline-loroy-U3aF7hgUSrk-unsplash.jpg&w=1920',
  //   alt: 'white and brown long coat large dog by Pauline Loroy'
  // },
  {
    url: "https://images.unsplash.com/photo-1540492649367-c8565a571e4b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=andreas-m-p40QuGwGCcw-unsplash.jpg&w=1920",
    alt: "green plant on yellow ceramic pot by Andreas M",
  },
];

const generateRandomFileName = () => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  return `image_${timestamp}_${randomString}.jpg`;
};

const handleDownloadImage = async (imageUrl, crop) => {
  try {
    // Fetch the image data
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Create a URL for the blob
    const blobUrl = URL.createObjectURL(blob);
    const fileName = generateRandomFileName();

    // let newUrl = await trimCanvas(blobUrl);
    // console.log(blobUrl, newUrl);
    if (crop) {
     let uri = await getCropped(blobUrl, {});

      // Create a download link and simulate a click to download the image
      const link = document.createElement("a");
      link.href = uri[0];
      link.download = fileName;
      link.click();

      // Clean up the URL object
      URL.revokeObjectURL(blobUrl);
    } else {
      // Create a download link and simulate a click to download the image
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      link.click();

      // Clean up the URL object
      URL.revokeObjectURL(blobUrl);
    }
  } catch (error) {
    console.error("Error downloading the image:", error);
  }
};

function ImageMatting({ openEditor }) {
  const {
    imageUrl,
    hasProcessedImage,
    isProcessing,
    processMessage,
    resetState,
    processImage,
    inferenceTime,
  } = useImageMatting();

  const [stopwatch, setStopwatch] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const showUploadScreen = useMemo(() => {
    return !isProcessing && !hasProcessedImage;
  }, [isProcessing, hasProcessedImage]);

  useEffect(() => {
    let timerInstance;

    if (isProcessing) {
      timerInstance = setInterval(() => {
        setStopwatch((time) => time + 0.01);
      }, 10);
    } else {
      clearInterval(timerInstance);
      setStopwatch(0);
    }

    return () => clearInterval(timerInstance);
  }, [isProcessing, processMessage, isProcessing]);

  return (
    <div className={classes.block}>
      {hasProcessedImage && (
        <div>
          <button className={classes.ghost} onClick={() => resetState()}>
            <ChevronLeftIcon /> <span>New Image</span>
          </button>
        </div>
      )}

      <div
        className={classNames(classes.preview, {
          [classes.dragging]: isDragging,
        })}
        onDragLeave={(e) => {
          if (!showUploadScreen) return;

          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDragEnter={(e) => {
          if (!showUploadScreen) return;

          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          if (!showUploadScreen) return;

          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDrop={(e) => {
          if (!showUploadScreen) return;

          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
          let draggedData = e.dataTransfer;
          let [file] = draggedData.files;
          const objectURL = URL.createObjectURL(file);

          processImage(objectURL);
        }}
      >
        {(isProcessing || hasProcessedImage) && (
          <img
            className={classNames(classes.imagePreview, {
              [classes.blurred]: isProcessing,
            })}
            style={{
              opacity: imageUrl && imageUrl !== "" ? 1 : 0,
            }}
            src={imageUrl}
            alt={hasProcessedImage ? "Processed Image" : "Uploaded Image"}
          />
        )}

        {hasProcessedImage && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "auto",
              marginRight: "auto",
              justifyContent: "center",
            }}
          >
            {/* <button
              style={{ margin: "2px" }}
              className={classes.primary}
              onClick={() => openEditor()}
            >
              <EditIcon /> Edit in CE.SDK
            </button> */}
               <button
              style={{ margin: "2px", marginRight: "auto", marginLeft: "auto" }}
              className={classes.primary}
              onClick={() => {
                handleDownloadImage(imageUrl, false);
              }}
            >
              download
            </button>
            <button
              style={{ margin: "2px", marginRight: "auto", marginLeft: "auto" }}
              className={classes.primary}
              onClick={() => {
                handleDownloadImage(imageUrl, true);
              }}
            >
              download and crop
            </button>
         
          </div>
        )}

        {!isProcessing && !hasProcessedImage && (
          <div className={classes.uploadControls}>
            <UploadIcon />
            <label className={classes.upload}>
              Upload to Remove Background
              <input
                className={classes.hidden}
                type="file"
                onChange={(event) => {
                  const [file] = event.target.files;
                  const objectURL = URL.createObjectURL(file);

                  processImage(objectURL);
                }}
                accept="image/png, image/jpeg"
              />
            </label>
            <small className={classes.filetypeNotice}>PNG or JPEG</small>
          </div>
        )}

        {isProcessing && processMessage && (
          <div className={classes.processingOverlay}>
            <SpinnerIcon />
            <p className={classes.processMessage}>{processMessage}</p>
            {isProcessing && (
              <p className={classes.processStatus}>
                {stopwatch.toFixed(2) + "s"}
                {inferenceTime !== 0 && "/" + inferenceTime.toFixed(2) + "s"}
              </p>
            )}
          </div>
        )}
      </div>
      {showUploadScreen && (
        <div className={classes.sampleImagesWrapper}>
          <span>Or try these examples:</span>

          <div className={classes.sampleImages}>
            {IMAGE_URLS.map(({ url, alt }) => (
              <button
                key={url}
                className={classes.sampleImage}
                onClick={() => {
                  processImage(url);
                }}
              >
                <img src={url} alt={alt} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageMatting;
