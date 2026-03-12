// =============================================================================
// SyncManager — offline-first queue that flushes to Supabase when online.
//
// Operations are persisted in localStorage so they survive page reloads.
// Duplicate upserts for the same (table, id) pair are de-duplicated so that
// only the most recent write is ever sent.
// =============================================================================

interface SyncOperation {
  table: string;
  type: 'upsert' | 'delete' | 'insert';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  /** Deduplication key: used to collapse repeated upserts for the same row. */
  id?: string;
}

const STORAGE_KEY = 'mecorp-sync-queue';

class SyncManager {
  private queue: SyncOperation[] = [];
  private flushing = false;
  private online = navigator.onLine;

  constructor() {
    // Restore any operations that survived a previous session.
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this.queue = JSON.parse(saved) as SyncOperation[];
      } catch {
        // Corrupted data — start fresh.
        this.queue = [];
      }
    }

    window.addEventListener('online', () => {
      this.online = true;
      this.flush();
    });

    window.addEventListener('offline', () => {
      this.online = false;
    });
  }

  /**
   * Add an operation to the queue.
   * For upsert operations with a dedup `id`, any existing pending upsert for
   * the same (table, id) pair is removed so only the latest state is sent.
   */
  enqueue(op: SyncOperation): void {
    if (op.type === 'upsert' && op.id !== undefined) {
      this.queue = this.queue.filter(
        (q) => !(q.table === op.table && q.id === op.id && q.type === 'upsert')
      );
    }

    this.queue.push(op);
    this.persist();

    if (this.online) {
      this.flush();
    }
  }

  /** Write the current queue to localStorage. */
  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
  }

  /**
   * Drain the queue, sending each operation to Supabase in order.
   * Uses exponential backoff on network errors, capped at 30 seconds.
   * Only one flush loop runs at a time.
   */
  async flush(): Promise<void> {
    if (this.flushing || this.queue.length === 0 || !this.online) return;
    this.flushing = true;

    const { supabase } = await import('./supabase');
    let retryDelay = 1000;

    while (this.queue.length > 0 && this.online) {
      const op = this.queue[0];

      try {
        let error: unknown = null;

        if (op.type === 'upsert') {
          const result = await supabase.from(op.table).upsert(op.data);
          error = result.error;
        } else if (op.type === 'insert') {
          const result = await supabase.from(op.table).insert(op.data);
          error = result.error;
        } else if (op.type === 'delete') {
          const result = await supabase
            .from(op.table)
            .delete()
            .eq('id', op.data['id'] as string);
          error = result.error;
        }

        if (error) throw error;

        // Success — remove the operation and reset backoff.
        this.queue.shift();
        this.persist();
        retryDelay = 1000;
      } catch (err) {
        console.warn('[SyncManager] flush error, retrying in', retryDelay, 'ms', err);
        await new Promise<void>((resolve) => setTimeout(resolve, retryDelay));
        retryDelay = Math.min(retryDelay * 2, 30_000);
      }
    }

    this.flushing = false;
  }
}

export const syncManager = new SyncManager();
