import { useRef } from "react";
import { PopupWithForm } from "./PopupWithForm";

export function EditAvatarPopup({
  isLoading,
  isOpen,
  onClose,
  onUpdateAvatar,
}) {
  const currentAvatar = useRef();

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar(currentAvatar.current.value);
  }

  return (
    <PopupWithForm
      name="edit-avatar"
      title="Change profile picture"
      buttonText={isLoading ? "Saving..." : "Save"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <fieldset className="form__editor">
        <input
          id="link-avatar"
          type="url"
          placeholder="Image link"
          name="link"
          className="form__input form__input_content_link"
          ref={currentAvatar}
          required
        />
        <span className="link-avatar-error form__input-error"></span>
      </fieldset>
    </PopupWithForm>
  );
}
