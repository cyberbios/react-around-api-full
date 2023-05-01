import Popup from "./Popup";
export function PopupWithForm({
  title,
  name,
  buttonText,
  isOpen,
  children,
  onClose,
  onSubmit,
}) {
  return (
    <Popup isOpen={isOpen} name={name} onClose={onClose}>
      <div className="popup__content">
        <button type="button" onClick={onClose} className="popup__close" />
        <h2 className="popup__header">{title}</h2>
        <form name={name} onSubmit={onSubmit} className="form popup__form">
          {children}
          <button type="submit" className="form__button">
            {buttonText}
          </button>
        </form>
      </div>
    </Popup>
  );
}
