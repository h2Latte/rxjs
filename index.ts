import './style.css';

import {
  of,
  map,
  from,
  fromEvent,
  interval,
  ReplaySubject,
  partition,
} from 'rxjs';
import { mergeAll, pairwise, reduce, scan, tap, toArray } from 'rxjs/operators';

const array = ['🐈', '🐕', '🦉', '🐘', '🐄'];
const stringSubject = new ReplaySubject<string[]>();
stringSubject.next(['🐈 dans un subject']);
stringSubject.next(['🐕 dans un subject']);

// pairwise operator

from(array)
  .pipe(pairwise())
  .subscribe((value) => console.log(value));

//mergeAll(), ToArray()
console.log('////////////////////');

const clicks = fromEvent(document, 'click');
const higherOrder = clicks.pipe(map(() => interval(1000)));
const firstOrder = higherOrder.pipe(mergeAll());

firstOrder.subscribe((x) => console.log(x));

of(array)
  .pipe(
    mergeAll(),
    tap(console.log),
    map((value) => value + ' mignon'),
    toArray()
  )
  .subscribe(console.log);

console.log('////////////////////');

stringSubject
  .pipe(
    mergeAll(),
    tap(console.log),
    map((value) => value + ' mignon'),
    toArray()
  )
  .subscribe(console.log);

// stringSubject.complete();

// Scan/reduce
console.log('////////////////////');

from(array)
  .pipe(scan((acc, value, index) => `${acc} et ${value}`))
  .subscribe(console.log);

console.log('////////////////////');

from(array)
  .pipe(reduce((acc, value, index) => `${acc} et ${value}`))
  .subscribe(console.log);

console.log('////////////////////');
//avec un subject quel est le comportement?

stringSubject
  .pipe(
    mergeAll(),
    scan((acc, value, index) => `${acc} et ${value}`)
  )
  .subscribe(console.log);

// partition un filtre en mieux (opération ternaire)
console.log('////////////////////');
const animaux = [
  { name: '🐈', isDomestic: true },
  { name: '🐕', isDomestic: true },
  { name: '🦉', isDomestic: false },
  { name: '🐘', isDomestic: false },
  { name: '🐄', isDomestic: true },
];
const [animauxDomestiques$, animauxPasDomestiques$] = partition(
  from(animaux),
  (animal) => animal.isDomestic
);

animauxDomestiques$.subscribe((animal) =>
  console.log('caresser ' + animal.name)
);
animauxPasDomestiques$.subscribe((animal) =>
  console.log('relacher ' + animal.name)
);
