/* This JavaScript file is provided for running the NPM 'slugify-image-names' command
for bulk renaming image files so that their filenames look proper in the URL ("like-this"),
as seen in the "package.json" file. Uses the Slugify plugin. */

import path from 'path';
import slugify from '@sindresorhus/slugify';

class SlugifyFileName {
  replace (filePath) {
    const file = path.parse(filePath)
    const newName = slugify(file.name) + file.ext
    return path.join(file.dir, newName)
  }
}

export default SlugifyFileName