import { PopupWithForm } from "./PopupWithForm";
import { useState, useContext, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export function EditProfilePopup({ isLoading, isOpen, onClose, onUpdateUser }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const currentUser = useContext(CurrentUserContext);

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  }

  function handleChangeName(e) {
    setName(e.target.value);
  }
  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      title="Edit profile"
      name="edit"
      buttonText={isLoading ? "Saving..." : "Save"}
      onSubmit={handleSubmit}
    >
      <fieldset className="form__editor">
        <input
          id="name-input"
          type="text"
          placeholder="Name"
          value={name || ""}
          name="name"
          onChange={handleChangeName}
          minLength="2"
          maxLength="40"
          className="form__input form__input_content_name"
          required
        />
        <span className="name-input-error form__input-error"></span>
        <input
          id="job-input"
          type="text"
          placeholder="About me"
          value={description || ""}
          name="about"
          onChange={handleChangeDescription}
          minLength="2"
          maxLength="200"
          className="form__input form__input_content_job"
          required
        />
        <span className="job-input-error form__input-error"></span>
      </fieldset>
    </PopupWithForm>
  );
}
