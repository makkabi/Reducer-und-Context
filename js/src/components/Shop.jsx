import { useReducer, useEffect, createContext, useContext } from "react";
import BasketDisplay from "./BasketDisplay";
import ProductsList from "./ProductsList";
import products from "../products";

/* Erschaffe einen Context außerhalb der Komponente. In createContext()
kann ein Startwert eingegeben werden, das ist meist aber nicht sinnvoll
bzw. möglich. Also leer lassen oder explizit null verwenden.
Wenn man den eigenen Hook unten verwendet, muss der Kontext nicht exportiert werden. */
const BasketDispatchContext = createContext(null);

/* Eigener Hook, der das Ex- und Importieren des Kontextes
erspart. */
export function useBasketDispatchContext() {
  const basketDispatch = useContext(BasketDispatchContext);
  return basketDispatch;
}

const ProductsContext = createContext(null);
export function useProductsContext() {
  const products = useContext(ProductsContext);
  return products;
}

export default function Shop() {
  const [basket, basketDispatch] = useReducer(
    basketReducer,
    null, // Startwert für basket, wenn keine Funktion an dritter Stelle folgt
    getInitialBasketState // Optional: Funktion, die den Startwert zurückgibt
  );

  useEffect(
    () => localStorage.setItem("basket", JSON.stringify(basket)),
    [basket]
  );

  return (
    <div className="shop">
      {/* 
      Der value des Kontext kann innerhalb der Kind-Komponenten und
      deren Kind-Komponenten verwendet werden.
      */}
      <BasketDispatchContext.Provider value={basketDispatch}>
        <ProductsContext.Provider value={products}>
          <ProductsList />
          <BasketDisplay basket={basket} basketDispatch={basketDispatch} />
        </ProductsContext.Provider>
      </BasketDispatchContext.Provider>
    </div>
  );
}

function basketReducer(basket, message) {
  /* Die Array-Methode some prüft, ob mindestens ein Eintrag eine
  Bedingung erfüllt, und gibt true oder false zurück. */
  const productNotInBasket = !basket.some(({ id }) => id === message.id);

  switch (message.type) {
    /* 
    basket enthält den aktuellen state. Dieser sollte nie
    direkt manipuliert werden, etwa mit basket.push(), sondern
    stattdessen sollte man aus der Reducer-Funktion einen
    veränderte Kopie des states zurückgeben. Stichwort "Immutability",
    d.h. "Mutationen" von Daten vermeiden und stattdessen
    veränderte Kopien verwenden.
    */
    case "add":
      if (productNotInBasket) {
        return [...basket, { id: message.id, amount: 1 }];
      }

      return basket.map((product) => {
        if (product.id === message.id) {
          /*            Um Mutationen des Original-Arrays bzw. des Objektes im
          Original-Array zu vermeiden, nutzen wir Objekt-Spread,
           um eine veränderte Kopie des Produkt-Objektes in den
           neuen Array zu legen. */
          return { ...product, amount: product.amount + 1 };
        }
        return product;
      });

    case "subtract":
      return basket.map((product) => {
        if (product.id === message.id) {
          return {
            ...product,
            amount: product.amount > 0 ? product.amount - 1 : 0,
          };
        }
        return product;
      });

    case "remove":
      return basket.filter(({ id }) => id !== message.id);

    case "emptyBasket":
      return [];

    default:
      return basket;
  }
}

function getInitialBasketState() {
  const oldBasket = JSON.parse(localStorage.getItem("basket"));
  if (Array.isArray(oldBasket)) {
    return oldBasket;
  }

  return [];
}

/* 
1. Verbindet die Buttons in BasketItem mit dem Aufruf der dispatch-Funktion,
wobei type hier add, subtract und remove sein soll. 
Mit subtract soll die Anzahl auf minimal 0 gesetzt werden können, ohne
dass das Produkt aus dem Warenkorb verschwindet.
Mit remove soll das Produkt komplett aus dem Warenkorb entfernt werden.
2. Bonus: Fügt irgendwo einen Button ein, der den Warenkorb komplett leert, 
der aber nur sichtbar ist, wenn der Warenkorb nicht leer ist.
3. Bonus: Nutzt localStorage, JSON, getInitialBasketState und useEffect so zusammen,
dass der der Inhalt des Warenkorbes stets in localStorage gespeichert ist und
am Anfang bei ersten Laden wieder (wenn vorhanden) hergestellt wird.


*/
