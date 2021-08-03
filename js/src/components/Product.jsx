//import { useContext } from "react";

import { getFormattedPrice } from "../helpers";

// Importiere den Kontext aus einer anderen Datei
// import { BasketDispatchContext } from "./Shop";

// Vereinfacht: Direkt den eigenen Hook importieren
import { useBasketDispatchContext } from "./Shop";

export default function Product({ title, image, price, sale, id }) {
  // Gebe den Kontext in useContext, erhalte den Wert zurück, der als
  // value im Kontext-Provider steht.
  // const basketDispatch = useContext(BasketDispatchContext);

  const basketDispatch = useBasketDispatchContext();

  const cssClasses = `product ${sale ? "product--sale" : ""}`;

  return (
    <article className={cssClasses}>
      <div className="product__image">{image}</div>
      <h3 className="product__heading">{title}</h3>
      <p className="product__price">{getFormattedPrice(price)}</p>
      <button
        onClick={() => basketDispatch({ type: "add", id })}
        aria-label={`${title} in den Warenkorb`}
      >
        Kaufen
      </button>
    </article>
  );
}
