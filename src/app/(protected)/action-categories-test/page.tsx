"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function ActionCategoriesPage() {
  const actionCategories = useQuery(api.action_categories.get);
  return (
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold mb-4">Action Categories</h1>
        <div className="flex flex-col items-left justify-between gap-4">
          {actionCategories?.map(({ _id, title }) => <div key={_id}>{title}</div>)}
        </div>
      </div>
  );
}