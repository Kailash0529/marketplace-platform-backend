"use client";

import { useQuery } from "@tanstack/react-query";
import { api, ApiEnvelope } from "../../../../../lib/api";

interface MemberResponse {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
}

async function fetchMe(): Promise<MemberResponse> {
  // Note: /members/me is implemented on member-service; depending on gateway
  // routing, you might need to adjust this path to go directly to member-service.
  const res = await api.get<ApiEnvelope<MemberResponse>>("/members/me");
  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to load current member");
  }
  return res.data;
}

export default function AdminMembersPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-me"],
    queryFn: fetchMe,
  });

  return (
    <div className="w-full space-y-3">
      <h1 className="text-xl font-semibold tracking-tight">Members</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Showing the currently authenticated member via <code>/members/me</code>.
      </p>
      {isLoading && <p className="text-sm">Loading member...</p>}
      {isError && (
        <p className="text-sm text-red-600">
          {(error as Error)?.message || "Failed to load member"}
        </p>
      )}
      {data && (
        <div className="max-w-md rounded-lg border bg-white p-4 text-sm shadow-sm dark:bg-zinc-900">
          <p>
            <span className="font-medium">Email:</span> {data.email}
          </p>
          <p className="mt-1">
            <span className="font-medium">Name:</span>{" "}
            {data.fullName || "—"}
          </p>
          <p className="mt-1">
            <span className="font-medium">Phone:</span>{" "}
            {data.phone || "—"}
          </p>
          <p className="mt-1 text-xs text-zinc-500">ID: {data.id}</p>
        </div>
      )}
    </div>
  );
}


