
"use server";

import { createManualAlbum, ensureCurrentMonthAlbum } from "@/lib/albums";
import { revalidatePath } from "next/cache";

export async function handleCreateAlbum(formData: FormData) {
    const year = formData.get('year') as string;
    const month = formData.get('month') as string;
    const link = formData.get('link') as string;
    const title = formData.get('title') as string;

    if (!year || !month) return;

    await createManualAlbum(year, month, link, title);
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function triggerAutoCreate() {
    await ensureCurrentMonthAlbum();
    revalidatePath('/');
}
