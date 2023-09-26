import path from "path";
import { EventEmitter } from "stream";

export const rootPath = __dirname;

export const domainMapPath = path.join(rootPath, "domain-map.json");

export const domainMap = require(domainMapPath);

export const eventEmitter = new EventEmitter();
