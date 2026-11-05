import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Play, X } from "lucide-react";

export default function StoryCard({
  number,
  title,
  description,
  image,
  alt,
  video,
  videoTitle,
}) {
  const [videoOpen, setVideoOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const openVideo = () => {
    setIsPlaying(false);
    setVideoOpen(true);
  };

  const closeVideo = () => {
    const player = videoRef.current;
    if (player) {
      player.pause();
      player.currentTime = 0;
    }
    setIsPlaying(false);
    setVideoOpen(false);
  };

  const togglePlayback = () => {
    const player = videoRef.current;
    if (!player) return;

    if (player.paused || player.ended) {
      if (player.ended) player.currentTime = 0;
      const playback = player.play();
      if (playback?.catch) {
        playback.catch(() => setIsPlaying(false));
      }
    } else {
      player.pause();
    }
  };

  useEffect(() => {
    if (!videoOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeVideo();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [videoOpen]);

  const videoModal = videoOpen
    ? createPortal(
        <div
          className="story-video-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${videoTitle} video`}
          onClick={closeVideo}
        >
          <div
            className="story-video-modal__panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="story-video-modal__header">
              <div className="story-video-modal__heading">
                <p>THE JACKSON CHRONICLES <span>///</span> EPISODE {number}</p>
                <h2>{videoTitle}</h2>
              </div>
              <button
                className="story-video-modal__close"
                type="button"
                onClick={closeVideo}
                aria-label="Close video"
              >
                <X size={23} strokeWidth={2.4} />
              </button>
            </div>

            <div className="story-video-modal__frame">
              <video
                ref={videoRef}
                src={video}
                autoPlay
                playsInline
                preload="auto"
                controls={false}
                disablePictureInPicture
                aria-label={videoTitle}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
              <button
                className="story-video-modal__toggle"
                type="button"
                onClick={togglePlayback}
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {!isPlaying && (
                  <span className="story-video-modal__toggle-icon">
                    <Play size={30} fill="currentColor" strokeWidth={1.5} />
                  </span>
                )}
              </button>
            </div>

            <p className="story-video-modal__hint">
              {isPlaying ? "TAP VIDEO TO PAUSE" : "TAP VIDEO TO PLAY"}
            </p>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <article
        className="story-card"
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-label={`Play ${videoTitle}`}
        onClick={openVideo}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openVideo();
          }
        }}
      >
        <div className="story-card__image-wrap">
          <img className="story-card__image" src={image} alt={alt} loading="lazy" />
          <span className="story-card__play" aria-hidden="true">
            <Play size={23} fill="currentColor" strokeWidth={1.7} />
          </span>
        </div>
        <div className="story-card__body">
          <div className="story-card__eyebrow">THE JACKSON CHRONICLES</div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </article>
      {videoModal}
    </>
  );
}
