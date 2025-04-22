"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { removeItem } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import { useActionState } from "react";

export default function DeleteItemButton({
  itemId,
  sku,
}: {
  itemId: string;
  sku: string;
}) {
  const { removeCartItem } = useCart();
  const [message, formAction] = useActionState(removeItem, null);

  const removeItemAction = formAction.bind(null, itemId);

  return (
    <form
      action={async () => {
        removeCartItem(sku);
        await removeItemAction();
      }}
    >
      <button
        aria-label="Remove cart item"
        className={clsx(
          "flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700",
        )}
        type="submit"
      >
        <TrashIcon className="hover:text-accent-3 mx-[1px] h-4 w-4" />
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message || ""}
      </p>
    </form>
  );
}
