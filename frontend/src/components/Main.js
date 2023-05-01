import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import Card from "./Card.js";

export function Main({
  cards,
  onCardLike,
  onCardTrashClick,
  onEditAvatarClick,
  onEditProfileClick,
  onAddPlaceClick,
  onCardClick,
}) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="main">
      <section className="profile">
        <div className="profile__avatar">
          <img
            src={
              currentUser.avatar
                ? currentUser.avatar
                : "https://via.placeholder.com/150/00000?text=Avatar"
            }
            alt="avatar"
            className="profile__avatar-img"
          />
          <button
            onClick={onEditAvatarClick}
            className="profile__change-avatar-button"
          />
        </div>
        <div className="profile__description">
          <div className="profile__wrapper">
            <h1 className="profile__title">{currentUser.name}</h1>
            <button
              onClick={onEditProfileClick}
              type="button"
              className="profile__button-edit"
            />
          </div>
          <p className="profile__subtitle">{currentUser.about}</p>
        </div>
        <button
          onClick={onAddPlaceClick}
          type="button"
          className="profile__button-add"
        />
      </section>
      <section className="gallery">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
            onCardTrashClick={onCardTrashClick}
          />
        ))}
      </section>
    </main>
  );
}
