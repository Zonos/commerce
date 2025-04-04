"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { removeItem } from "components/cart/actions";
import type { ZonosCartItem } from "lib/zonos/types";
import { useActionState } from "react";

export function DeleteItemButton({
  item,
  optimisticUpdate,
}: {
  item: ZonosCartItem;
  optimisticUpdate: (
    variant: { id: string; quantity: number },
    updateType: "delete",
  ) => void;
}) {
  const [message, formAction] = useActionState(removeItem, null);
  const itemId = item.id;
  const variantId = item.sku;
  const removeItemAction = formAction.bind(null, itemId);
  if (!variantId) {
    return null;
  }

  return (
    <form
      action={async () => {
        optimisticUpdate({ id: variantId, quantity: 0 }, "delete");
        removeItemAction();
      }}
    >
      <button
        type="submit"
        aria-label="Remove cart item"
        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
      >
        <XMarkIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
