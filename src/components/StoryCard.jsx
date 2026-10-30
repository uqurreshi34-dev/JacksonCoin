import { ArrowUpRight } from "lucide-react";

export default function StoryCard({ number, title, description, image, alt }) {
  return (
    <article className="story-card">
      <div className="story-card__image-wrap">
        <img className="story-card__image" src={image} alt={alt} loading="lazy" />
        <span className="story-card__number">{number}</span>
      </div>
      <div className="story-card__body">
        <div className="story-card__eyebrow">THE JACKSON CHRONICLES</div>
        <h3>{title}</h3>
        <p>{description}</p>
        <span className="story-card__arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
      </div>
    </article>
  );
}
