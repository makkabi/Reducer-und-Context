import { getFormattedPrice, getProductWithId } from '../helpers';
import BasketItem from './BasketItem';
import { useBasketDispatchContext } from './ImmerShop';

export default function BasketDisplay({ basket }) {
	const basketDispatch = useBasketDispatchContext();
	const basketIsEmpty = basket.length === 0;

	const totalPrice = basket.reduce((sum, item) => {
		const product = getProductWithId(item.id);

		if (!product) {
			return sum;
		}

		return sum + product.price * item.amount;
	}, 0);

	return (
		<section className="basket">
			<h2 className="basket__heading">Warenkorb</h2>
			{basketIsEmpty && <strong>Warenkorb ist leer</strong>}
			{basketIsEmpty || (
				<>
					<ul className="basket__list">
						{basket.map((item) => (
							<BasketItem {...item} key={item.id} />
						))}
					</ul>
					<button onClick={() => basketDispatch({ action: 'emptyBasket' })}>
						Warenkorb leeren
					</button>
				</>
			)}
			{/* Hier den Gesamtpreis in einem output-Element anzeigen, wenn der Warenkob nicht leer ist */}
			{!basketIsEmpty && <output>{getFormattedPrice(totalPrice)}</output>}
		</section>
	);
}
