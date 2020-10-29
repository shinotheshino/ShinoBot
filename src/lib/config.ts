import fs from "fs";

const has = (o: any, k: string) => Object.prototype.propertyIsEnumerable.call(o, k);

export default abstract class ConfigLoader {
  #filename: string;
  #props: string[];

  constructor(filename: string, props: string[]) {
    this.#filename = filename;
    this.#props = props;
  }

  load() {
    for (const prop in this) if (has(this, prop)) delete this[prop];
    const json = fs.readFileSync(this.#filename, "utf-8");
    const obj = JSON.parse(json);
    const missing: string[] = [];
    for (const prop of this.#props) {
      if (!has(obj, prop)) missing.push(prop);
      else this[prop as keyof this] = obj[prop];
    }
    if (missing.length) throw new TypeError(`Config missing keys: ${missing.join(", ")}`);
  }
}
