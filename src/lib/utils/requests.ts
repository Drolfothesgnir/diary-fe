import type { AxiosResponse } from "axios";
import type { EntrySchema } from "../../types";
import http from "./http";

export async function getEntries(
  page: number = 1,
  per_page: number = 10,
  pinnedOnly = false
) {
  const response: AxiosResponse<{
    items: EntrySchema[];
    total: number;
    has_next: boolean;
  }> = await http.get(pinnedOnly ? "/record/pinned" : "/record", {
    params: {
      page,
      per_page,
    },
  });

  return response.data;
}

export async function deleteEntry(id: number) {
  const response = await http.delete(`/record/${id}`);
  return response;
}

export async function postEntry(content: string, pinned?: boolean) {
  return await http.post("/record", { content, pinned });
}

export async function putEntry(id: number, content?: string, pinned?: boolean) {
  return await http.put(`/record/${id}`, { content, pinned });
}
