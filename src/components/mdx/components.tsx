import type { ComponentPropsWithoutRef } from "react";
import { Callout } from "@/components/ui/callout";
import { TierBadge } from "@/components/handbook/tier-badge";

function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="table-wrapper">
      <table {...props} />
    </div>
  );
}

export const mdxComponents = {
  Callout,
  TierBadge,
  table: Table,
};

export type MDXComponentMap = typeof mdxComponents;
