import { getFormattedPrice } from "../helpers";
import { useProductsContext } from "./Shop";

export default function BasketItem({ id, amount, basketDispatch }) {
  const products = useProductsContext();

  const product = getProductWithId(id, products);

  if (!product) {
    return null;
  }

  const { title, price } = product;

  return (
    <li className="basket-item">
      <span className="basket-item__amount">{amount} &times; </span>
      <span className="basket-item__title">{title}: </span>
      <span className="basket-item__price">
        {getFormattedPrice(price * amount)}
      </span>
      <div className="basket-item__buttons">
        <button
          disabled={Boolean(amount <= 0)}
          className="basket-item__button"
          aria-label={`${title} minus eins`}
          onClick={() => basketDispatch({ type: "subtract", id })}
        >
          -
        </button>
        <button
          className="basket-item__button"
          aria-label={`${title} plus eins`}
          onClick={() => basketDispatch({ type: "add", id })}
        >
          +
        </button>
        <button
          className="basket-item__button"
          aria-label={`${title} aus Warenkorb löschen`}
          onClick={() => basketDispatch({ type: "remove", id })}
        >
          &times;
        </button>
      </div>
    </li>
  );
}

function getProductWithId(searchedId, products) {
  return products.find(({ id }) => id === searchedId);
}
