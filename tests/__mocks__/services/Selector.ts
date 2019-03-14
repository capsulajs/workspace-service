import { Observable } from 'rxjs';

interface Selector<T,K> {
  input(data: Observable<Array<T>>): Promise<void>;
  output$(): Observable<Array<T>>;
  select(key: K): Promise<T>;
  selected$(): Promise<T>;
}
