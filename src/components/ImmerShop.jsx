import { useEffect, createContext, useContext } from 'react';
import { useImmerReducer } from 'use-immer';
import BasketDisplay from './BasketDisplay';
import ProductsList from './ProductsList';

/* Erschaffe einen Context außerhalb der Komponente. In createContext()
kann ein Startwert eingegeben werden, das ist meist aber nicht sinnvoll
bzw. möglich. Also leer lassen oder explizit null verwenden.
Wenn man den eigenen Hook unten verwendet, muss der Kontext nicht exportiert werden. */
const BasketDispatchContext = createContext(null);

/* Eigener Hook, der das Ex- und Importieren des Kontextes
erspart. */
export function useBasketDispatchContext() {
	return useContext(BasketDispatchContext);
}

export default function ImmerShop() {
	const [basket, basketDispatch] = useImmerReducer(
		basketReducer,
		null, // Startwert für basket, wenn keine Funktion an dritter Stelle folgt
		getInitialBasket // Optional: Funktion, die den Startwert zurückgibt
	);

	useEffect(
		() => localStorage.setItem('basket', JSON.stringify(basket)),
		[basket]
	);

	return (
		<div className="shop">
			{/* 
      Der value des Context kann in allen Komponenten genutzt werden,
      die innerhalb der Provider-Komponente liegen, auch in tief verschachtelten.
      */}
			<BasketDispatchContext.Provider value={basketDispatch}>
				{/* Hier muss basketDispatch nicht zu Product durchgereicht
        werden ("prop drilling"). */}
				<ProductsList />
				<BasketDisplay basket={basket} />
			</BasketDispatchContext.Provider>
		</div>
	);
}

function basketReducer(basket, message) {
	const productNotInBasket = !basket.some(({ id }) => id === message.id);

	switch (message.action) {
		case 'add':
			if (productNotInBasket) {
				basket.push({ id: message.id, amount: 1 });
				break;
			}

			basket.find((item) => item.id === message.id).amount++;

			break;

		case 'subtract': {
			const product = basket.find((item) => item.id === message.id);
			if (product.amount > 0) {
				product.amount--;
			}
			break;
		}

		case 'remove':
			return basket.filter(({ id }) => id !== message.id);

		case 'emptyBasket':
			return [];
	}
}

function getInitialBasket() {
	try {
		const oldBasket = JSON.parse(localStorage.getItem('basket'));
		return Array.isArray(oldBasket) ? oldBasket : [];
	} catch (error) {
		console.log(error);
		localStorage.removeItem('basket');
	}

	return [];
}
