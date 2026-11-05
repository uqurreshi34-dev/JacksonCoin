import { useRef, useState } from "react";
import { Play } from "lucide-react";

export default function StoryCard({
  number,
  title,
  description,
  image,
  alt,
  video,
  videoTitle,
}) {
  const [videoActive, setVideoActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const toggleCardPlayback = () => {
    const player = videoRef.current;
    if (!player) return;

    if (!videoActive) {
      player.currentTime = 0;
      setVideoActive(true);

      // Start directly from the card tap so mobile browsers allow audio playback.
      const playback = player.play();
      if (playback?.catch) {
        playback.catch(() => {
          setVideoActive(false);
          setIsPlaying(false);
        });
      }
      return;
    }

    if (player.paused || player.ended) {
      if (player.ended) player.currentTime = 0;
      const playback = player.play();
      if (playback?.catch) playback.catch(() => setIsPlaying(false));
    } else {
      player.pause();
    }
  };

  const handleVideoEnded = () => {
    const player = videoRef.current;
    if (player) player.currentTime = 0;
    setIsPlaying(false);
    setVideoActive(false);
  };

  const handleVideoError = () => {
    setIsPlaying(false);
    setVideoActive(false);
  };

  return (
    <article
      className="story-card"
      role="button"
      tabIndex={0}
      aria-pressed={videoActive && isPlaying}
      aria-label={`${isPlaying ? "Pause" : "Play"} ${videoTitle} in this card`}
      onClick={toggleCardPlayback}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleCardPlayback();
        }
      }}
    >
      <div className="story-card__image-wrap">
        <img className="story-card__image" src={image} alt={alt} loading="lazy" />
        <video
          ref={videoRef}
          className={`story-card__video${videoActive ? " is-active" : ""}`}
          src={video}
          poster={image}
          preload="none"
          playsInline
          controls={false}
          disablePictureInPicture
          aria-label={videoTitle}
          tabIndex={-1}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleVideoEnded}
          onError={handleVideoError}
        />
        {!videoActive && (
          <span className="story-card__play" aria-hidden="true">
            <Play size={23} fill="currentColor" strokeWidth={1.7} />
          </span>
        )}
        {videoActive && !isPlaying && (
          <span className="story-card__resume" aria-hidden="true">
            <Play size={25} fill="currentColor" strokeWidth={1.7} />
          </span>
        )}
      </div>
      <div className="story-card__body">
        <div className="story-card__eyebrow">THE JACKSON CHRONICLES</div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
}
