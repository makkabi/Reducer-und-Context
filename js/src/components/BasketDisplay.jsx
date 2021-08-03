import BasketItem from "./BasketItem";

export default function BasketDisplay({ basket, basketDispatch }) {
  const basketIsEmpty = basket.length === 0;

  return (
    <section className="basket">
      <h2 className="basket__heading">Warenkorb</h2>
      {basketIsEmpty && <strong>Warenkorb ist leer</strong>}
      {basketIsEmpty || (
        <>
          <ul className="basket__list">
            {basket.map((item) => (
              <BasketItem
                key={item.id}
                {...item}
                basketDispatch={basketDispatch}
              />
            ))}
          </ul>
          <button onClick={() => basketDispatch({ type: "emptyBasket" })}>
            Warenkorb leeren
          </button>
        </>
      )}
    </section>
  );
}
