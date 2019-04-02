import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

export const data$ = interval(1000)
  .pipe(
    map((n: number) => ({ a: `Hello ${n}`, b: `World ${n}` }))
  );
