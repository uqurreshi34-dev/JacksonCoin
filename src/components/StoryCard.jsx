export default function StoryCard({ title, description, image, alt }) {
  return (
    <article className="story-card">
      <div className="story-card__image-wrap">
        <img className="story-card__image" src={image} alt={alt} loading="lazy" />
      </div>
      <div className="story-card__body">
        <div className="story-card__eyebrow">THE JACKSON CHRONICLES</div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
}
