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