import path from "path";
import JSONToType from "../src";

new JSONToType().path(path.join(__dirname, '..', 'test')).run()
