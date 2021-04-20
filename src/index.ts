export type EventType = string | symbol | '*';

export type EventMap = Array<[EventType, any]>;
export type GetKeyList<T extends EventMap> = T extends Array<infer E>
  ? E extends [infer K, any]
    ? K
    : null
  : null;
export type GetValueList<T extends EventMap> = T extends Array<infer E>
  ? E extends [any, infer V]
    ? V
    : null
  : null;
export type GetValueByKey<
  T extends EventMap,
  K extends EventType
> = T extends Array<infer E>
  ? E extends [K, infer R]
    ? R
    : undefined
  : unknown;

export type GetCbSet<T extends EventMap> = {
  [K in GetKeyList<T>]: GetValueByKey<T, K>;
};

const a: EventMap = [];

export default class Emitter<T extends EventMap> {
  // eventMap:EventMap
  // cbSet: GetCbSet<T>

  cbMap = new Map();
  constructor() {
    // this.eventMap = initMap
    // const keyList:GetKeyList<T> = Object.keys(initMap)
    // this.cbSet = {}/
  }
  on<P extends GetKeyList<T>>(key: P, handler: GetValueByKey<T, P>): void {
    const handlers = this.cbMap.get(key);
    const added = handlers && handlers.push(handler);
    if (!added) {
      this.cbMap.set(key, [handler]);
    }
  }

  off<P extends GetKeyList<T>>(key: P, handler: GetValueByKey<T, P>): void {
    const handlers = this.cbMap.get(key);
    if (handlers) {
      handlers.splice(handlers.indexOf(handler) >>> 0, 1);
    }
  }

  emit<P extends GetKeyList<T>>(key: P, e: any) {
    const list = this.cbMap.get(key);
    list.forEach(handler => {
      handler(e);
    });
    const allList = this.cbMap.get('*');
    allList.forEach(handler => {
      handler(key, e);
    });
  }
}

const sss = Symbol('hello');
// type m = [["string", [string]], ["number", [number]]];
type m = [
  ['string', (n: number) => number],

  ['number', (n: string) => string],
  ['b', (n: string, s: boolean) => string],
  [typeof sss, () => void]
];
const em = new Emitter<m>();

type k = GetKeyList<m>;
type v = GetValueByKey<m, 'string'>;
type vv = GetValueByKey<m, typeof sss>;

// em.on("string" as const, (n) => {
//   console.log(n++);
//   return n;
// });

em.on('string', n => {
  console.log(n++);
  return n;
});
em.on('b', n => {
  console.log(n);
  return n;
});
function on2<T extends EmitMap, P extends GetKey<T>>(
  key: P,
  cb: GetValue<T, P>
) {}
