import { Subject, Observable } from 'rxjs';
import { throttleTime, bufferTime, filter, map, share } from 'rxjs/operators';
import type { PriceUpdate } from '../types';

const COINCAP_WS_URL = 'wss://ws.coincap.io/prices?assets=bitcoin,ethereum,solana,cardano,polkadot,chainlink,uniswap,aave';

export class CryptoWebSocketService {
  private socket: WebSocket | null = null;
  private rawSubject = new Subject<PriceUpdate>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isConnected = false;

  // RxJS pipeline: throttle, batch, deduplicate to prevent browser memory leaks
  public priceUpdates$: Observable<PriceUpdate[]> = this.rawSubject.pipe(
    // Throttle individual updates per symbol (100ms)
    throttleTime(100, undefined, { leading: true, trailing: true }),
    // Batch updates every 500ms
    bufferTime(500),
    // Filter out empty batches
    filter(batch => batch.length > 0),
    // Deduplicate: keep only the latest price per symbol in each batch
    map(batch => {
      const deduped = new Map<string, PriceUpdate>();
      for (const update of batch) {
        const existing = deduped.get(update.symbol);
        if (!existing || update.timestamp > existing.timestamp) {
          deduped.set(update.symbol, update);
        }
      }
      return Array.from(deduped.values());
    }),
    filter(batch => batch.length > 0),
    share() // Share single subscription among multiple consumers
  );

  connect(): void {
    if (this.isConnected) return;
    this.isConnected = true;
    this.createConnection();
  }

  private createConnection(): void {
    try {
      this.socket = new WebSocket(COINCAP_WS_URL);

      this.socket.onopen = () => {
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.socket.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data) as Record<string, string>;
          const timestamp = Date.now();
          for (const [symbol, priceStr] of Object.entries(data)) {
            this.rawSubject.next({
              symbol,
              price: parseFloat(priceStr),
              timestamp,
            });
          }
        } catch {
          // Ignore parse errors
        }
      };

      this.socket.onerror = () => {
        this.scheduleReconnect();
      };

      this.socket.onclose = () => {
        if (this.isConnected) {
          this.scheduleReconnect();
        }
      };
    } catch {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (!this.reconnectTimer && this.isConnected) {
      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null;
        this.createConnection();
      }, 3000);
    }
  }

  disconnect(): void {
    this.isConnected = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const cryptoWSService = new CryptoWebSocketService();
