import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function Card({ card, onCardClick, onCardLike, onCardTrashClick }) {
  const currentUser = useContext(CurrentUserContext);

  // Checking if the current user is the owner of the current card
  const isOwn = card.owner._id === currentUser._id;
  const cardDeleteButtonClassName = `card__button-trash ${
    isOwn ? "card__button-trash_visible" : "card__button-trash_hidden"
  }`;
  // Check if the card was liked by the current user
  const isLiked = card.likes.some((user) => user._id === currentUser._id);
  const cardLikeButtonClassName = `card__button-like ${
    isLiked ? "card__button-like_liked" : ""
  }`;

  const handleLike = (e) => {
    onCardLike(card);
  };

  function handleClick() {
    onCardClick(card);
  }

  function handleCardTrashClick() {
    onCardTrashClick(card);
  }
  return (
    <div className="card">
      <img
        onClick={handleClick}
        src={card.link}
        alt={card.name}
        className="card__image"
      />

      <button
        type="button"
        className={cardDeleteButtonClassName}
        onClick={handleCardTrashClick}
      ></button>
      <div className="card__description">
        <h2 className="card__title">{card.name}</h2>
        <div className="card__like-info">
          <button
            type="button"
            className={cardLikeButtonClassName}
            onClick={handleLike}
          ></button>
          <span className="card__likes-count">{card.likes.length}</span>
        </div>
      </div>
    </div>
  );
}

export default Card;
