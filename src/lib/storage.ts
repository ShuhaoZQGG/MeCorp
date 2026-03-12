// =============================================================================
// Supabase Storage helpers for the "proofs" bucket.
//
// NOTE: The "proofs" bucket must be created manually via the Supabase dashboard
// or CLI before these functions will work.  See the SQL migration file for
// details.
// =============================================================================

import { supabase } from './supabase';

/**
 * Uploads a base64-encoded screenshot to the "proofs" storage bucket and
 * returns the public URL of the uploaded file.
 *
 * @param userId  - The authenticated user's UUID (used as a path prefix).
 * @param taskId  - The task UUID (used to name the file).
 * @param base64  - A base64 data URL (e.g. "data:image/png;base64,...") or raw
 *                  base64 string.
 * @returns The publicly accessible URL of the uploaded screenshot.
 * @throws  If the Supabase upload fails.
 */
export async function uploadProofScreenshot(
  userId: string,
  taskId: string,
  base64: string
): Promise<string> {
  // Strip the data-URL prefix if present and parse the MIME type.
  const mimeMatch = base64.match(/data:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';

  const rawBase64 = base64.includes(',') ? base64.split(',')[1] : base64;

  // Decode base64 to binary.
  const byteString = atob(rawBase64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mime });

  // Unique path: <userId>/<taskId>-<timestamp>.png
  const path = `${userId}/${taskId}-${Date.now()}.png`;

  const { error } = await supabase.storage.from('proofs').upload(path, blob, {
    contentType: mime,
    upsert: true,
  });

  if (error) throw error;

  const { data } = supabase.storage.from('proofs').getPublicUrl(path);
  return data.publicUrl;
}
