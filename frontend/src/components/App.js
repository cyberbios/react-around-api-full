import { Switch, Route, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header } from "./Header.js";
import { Main } from "./Main.js";
import { Footer } from "./Footer.js";
import { ImagePopup } from "./ImagePopup.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import { EditProfilePopup } from "./EditProfilePopup.js";
import { EditAvatarPopup } from "./EditAvatarPopup";
import { AddPlacePopup } from "./AddPlacePopup.js";
import { DeletePopup } from "./DeletePopup.js";
import { Login } from "./Login.js";
import { Register } from "./Register.js";

import * as auth from "../utils/auth.js";
import api from "../utils/api.js";
import { InfoTooltip } from "./InfoTooltip.js";
import ProtectedRoute from "./ProtectedRoute.js";
import successRegistrationImg from "../images/success.png";
import failRegistrationImg from "../images/fail.png";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
  const [successRegistration, setSuccessRegistration] = useState(false);
  const [failRegistration, setFailRegistration] = useState(false);

  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");

  const history = useHistory();

  useEffect(() => {
    api
      .getUserInfo()
      .then((user) => {
        setCurrentUser(user);
      })
      .catch((err) => {
        console.log("app.js ", err);
      });
  }, []);

  useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    };

    document.addEventListener("keydown", closeByEscape);

    return () => document.removeEventListener("keydown", closeByEscape);
  }, []);

  useEffect(() => {
    api
      .getInitialCards()
      .then((initialCards) => {
        setCards(initialCards);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //check if user logged in before and save email
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .checkingTokenValidity(jwt)
        .then((user) => {
          setEmail(user.data.email);
          setIsLogin(true);
          history.push("/");
        })
        .catch((err) => console.log(err.message));
    }
  }, []);

  const closeAllPopups = () => {
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsImagePopupOpen(false);
    setIsDeleteCardPopupOpen(false);
    setSelectedCard({});
    setSuccessRegistration(false);
    setFailRegistration(false);
  };

  const handleAddPlaceSubmit = (newPlace) => {
    setIsLoading(true);
    api
      .addCard(newPlace)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((user) => user._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function handleCardTrashClick(card) {
    setSelectedCard(card);
    setIsDeleteCardPopupOpen(true);
  }

  function handleCardDelete(card) {
    setIsLoading(true);
    api
      .deleteCard(card._id)
      .then(() => {
        const newCards = cards.filter((c) => c._id !== card._id);
        setCards(newCards);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }
  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };
  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  };

  const handleUpdateAvatar = (avatar) => {
    setIsLoading(true);
    api
      .editUserAvatar(avatar)
      .then((newAvatar) => {
        setCurrentUser({ ...newAvatar });
        closeAllPopups();
      })
      .catch((err) => {
        console.log("app.js ", err);
      })
      .finally(() => setIsLoading(false));
  };
  const handleUpdateUser = (name, about) => {
    setIsLoading(true);
    api
      .editUserInfo(name, about)
      .then((newUser) => {
        setCurrentUser(newUser);
        closeAllPopups();
      })
      .catch((err) => {
        console.log("app.js ", err);
      })
      .finally(() => setIsLoading(false));
  };

  //Registration
  const handleRegistration = (email, password) => {
    if (password) {
      auth
        .register(email, password)
        .then((res) => {
          if (res) {
            history.push("/login");
            setSuccessRegistration(true);
          } else {
            console.log("Something went wrong.");
          }
        })
        .catch((err) => {
          setFailRegistration(true);
          console.log(err.message);
        });
    }
  };

  //logIn by email and password
  const handleLogin = (email, password) => {
    if (!email || !password) {
      return;
    }
    auth
      .logIn(email, password)
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        history.go("/");
      })
      .catch((err) => {
        setFailRegistration(true);
        console.log(err.message);
      });
  };

  //log Out
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsLogin(false);
    setEmail("");
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header loggedIn={isLogin} email={email} handleLogout={handleLogout} />
      <Switch>
        <Route path="/register">
          <Register handleRegistration={handleRegistration} />
        </Route>
        <Route path="/login">
          <Login handleLogin={handleLogin} />
        </Route>
        <Route path="/">
          <ProtectedRoute
            loggedIn={isLogin}
            onEditAvatarClick={handleEditAvatarClick}
            onEditProfileClick={handleEditProfileClick}
            onAddPlaceClick={handleAddPlaceClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardTrashClick={handleCardTrashClick}
            cards={cards}
            component={Main}
          />
        </Route>
        <Route path="*">
          <Login handleLogin={handleLogin} />
        </Route>
      </Switch>
      <DeletePopup
        isOpen={isDeleteCardPopupOpen}
        onClose={closeAllPopups}
        onDeleteCard={handleCardDelete}
        card={selectedCard}
        isLoading={isLoading}
      />

      <ImagePopup
        card={selectedCard}
        isOpen={isImagePopupOpen}
        onClose={closeAllPopups}
      />

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
        isLoading={isLoading}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlaceSubmit={handleAddPlaceSubmit}
        isLoading={isLoading}
      />

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
        isLoading={isLoading}
      />
      <InfoTooltip
        isOpen={successRegistration}
        onClose={closeAllPopups}
        text={"Success! You have now been registered."}
        img={successRegistrationImg}
        alt={"success"}
      />
      <InfoTooltip
        isOpen={failRegistration}
        onClose={closeAllPopups}
        text={"Oops, something went wrong! Please try again."}
        img={failRegistrationImg}
        alt={"fail"}
      />
      {isLogin && <Footer />}
    </CurrentUserContext.Provider>
  );
}

export default App;
