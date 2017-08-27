import { sync as globSync } from "glob";
import { resolve, basename } from "path";
import { copy } from "fs-extra";

globSync(resolve(__dirname, "temp/*.jsx")).map(filePath => {
  const referencePath = resolve(__dirname, "references/" + basename(filePath));

  copy(filePath, referencePath, err => {
    if (err) return console.error(err);

    console.log(`${basename(filePath)} successfully overwritten`);
  });
});
