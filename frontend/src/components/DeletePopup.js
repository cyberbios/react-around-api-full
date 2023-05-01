import { PopupWithForm } from "./PopupWithForm";
export function DeletePopup({
  isLoading,
  isOpen,
  onClose,
  onDeleteCard,
  card,
}) {
  function handleDeleteCard(e) {
    e.preventDefault();
    onDeleteCard(card);
  }

  return (
    <PopupWithForm
      title="Are you sure?"
      name="deleteCard"
      isOpen={isOpen}
      onClose={onClose}
      buttonText={isLoading ? "Removing..." : "Yes"}
      onSubmit={handleDeleteCard}
    />
  );
}
