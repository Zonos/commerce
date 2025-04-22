"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { updateItemQuantity } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import { useActionState } from "react";

export function EditItemQuantityButton({
  item,
  type,
}: {
  item: {
    quantity: number;
    sku: string;
  };
  type: "plus" | "minus";
}) {
  const { updateCartItem } = useCart();
  const [message, formAction] = useActionState(updateItemQuantity, null);

  const payload = {
    sku: item.sku,
    quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
  };

  const updateItemQuantityAction = formAction.bind(null, payload);

  return (
    <form
      action={async () => {
        updateCartItem(payload, type);
        await updateItemQuantityAction();
      }}
    >
      <button
        type="submit"
        className={clsx(
          "flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded px-2",
          {
            "ml-auto": type === "minus",
            "mr-auto": type === "plus",
          },
        )}
        onClick={(e) => {
          // Only allow clicking on the button, not the form
          if ((e.target as HTMLElement).tagName === "BUTTON") {
            e.preventDefault();
            updateCartItem(payload, type);
            updateItemQuantityAction();
          }
        }}
      >
        {type === "plus" ? (
          <PlusIcon className="h-4 w-4" />
        ) : (
          <MinusIcon className="h-4 w-4" />
        )}
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message || ""}
      </p>
    </form>
  );
}
