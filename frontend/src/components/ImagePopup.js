import Popup from "./Popup";

export function ImagePopup({ card, isOpen, onClose }) {
  return (
    <Popup isOpen={isOpen} name={"card"} onClose={onClose}>
      <div className="popup__card">
        <button
          type="button"
          onClick={onClose}
          className="popup__close"
        ></button>
        <img src={card.link} alt={card.name} className="popup__image" />
        <p className="popup__description">{card.name}</p>
      </div>
    </Popup>
  );
}
