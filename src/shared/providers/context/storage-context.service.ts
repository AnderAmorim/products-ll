import {Injectable} from '@nestjs/common';
import {AsyncLocalStorage} from 'async_hooks';
import * as contexts from '../../constants/contexts';

export interface ContextInfo {
  [contexts.CONTEXT_TRACE_ID]: string;
  [contexts.CONTEXT_USER_ID]: string;
  [contexts.CONTEXT_PRODUCT_ID]: string;
}

@Injectable()
export class StorageContextService {
  private readonly storage = new AsyncLocalStorage<Map<string, unknown>>();

  setContext<K extends keyof ContextInfo>(
    key: K,
    value: ContextInfo[K] | undefined,
  ): void {
    const store = this.storage.getStore();
    if (store) {
      store.set(key, value);
    } else {
      const newStore = new Map<string, unknown>();
      newStore.set(key, value);
      this.storage.enterWith(newStore);
    }
  }

  getContext<K extends keyof ContextInfo>(key: K): ContextInfo[K] | undefined {
    const store = this.storage.getStore();
    return store?.get(key) as ContextInfo[K] | undefined;
  }

  getAllContext(): Record<string, unknown> {
    const store = this.storage.getStore();
    return store ? Object.fromEntries(store) : {};
  }
}
