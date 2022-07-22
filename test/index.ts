import path from "path";
import JSONToType from "../src";

new JSONToType().path(__dirname)
    .output(path.join(__dirname, 'typings'))
    .run()

