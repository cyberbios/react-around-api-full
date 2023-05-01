import { useState, useEffect } from "react";
import { PopupWithForm } from "./PopupWithForm";

export function AddPlacePopup({
  isLoading,
  isOpen,
  onClose,
  onAddPlaceSubmit,
}) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  const handleChangeName = (e) => {
    setName(e.target.value);
  };
  const handleChangeLink = (e) => {
    setLink(e.target.value);
  };

  const handleAddPlaceSubmit = (e) => {
    e.preventDefault();
    onAddPlaceSubmit({ name, link });
  };

  useEffect(() => {
    setName("");
    setLink("");
  }, [isOpen]);
  return (
    <PopupWithForm
      name="add-card"
      title="New place"
      buttonText={isLoading ? "Saving..." : "Save"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleAddPlaceSubmit}
    >
      <fieldset className="form__editor">
        <input
          id="title-input"
          type="text"
          placeholder="Title"
          name="name"
          value={name || ""}
          onChange={handleChangeName}
          className="form__input form__input_content_title"
          minLength="1"
          maxLength="30"
          required
        />
        <span className="title-input-error form__input-error"></span>
        <input
          id="link-input"
          type="url"
          placeholder="Image link"
          name="link"
          value={link || ""}
          onChange={handleChangeLink}
          className="form__input form__input_content_link"
          required
        />
        <span className="link-input-error form__input-error"></span>
      </fieldset>
    </PopupWithForm>
  );
}
